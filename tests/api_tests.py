from functools import lru_cache
import os
from uuid import uuid4

import pytest
import requests
import json

import urllib.parse

from pytest_nhsd_apim.identity_service import (
    ClientCredentialsConfig,
    ClientCredentialsAuthenticator,
)


@lru_cache()
def get_token_for_apigee_app(consumer_key, jwt_private_key, apigee_environment):
    config = ClientCredentialsConfig(
        environment=apigee_environment,
        identity_service_base_url=f"https://{apigee_environment}.api.service.nhs.uk/oauth2",
        client_id=consumer_key,
        jwt_private_key=jwt_private_key,
        jwt_kid="test-1",
    )

    authenticator = ClientCredentialsAuthenticator(config=config)

    token_response = authenticator.get_token()
    assert "access_token" in token_response
    return token_response


def test_ping_endpoint(nhsd_apim_proxy_url):
    resp = requests.get(nhsd_apim_proxy_url + "/_ping")
    assert resp.status_code == 200
    ping_data = json.loads(resp.text)
    assert "version" in ping_data


def test_status_endpoint(nhsd_apim_proxy_url, status_endpoint_auth_headers):
    resp = requests.get(
        nhsd_apim_proxy_url + "/_status", headers=status_endpoint_auth_headers
    )
    status_json = resp.json()
    assert resp.status_code == 200
    assert status_json["status"] == "pass"


@pytest.mark.nhsd_apim_authorization({"access": "application", "level": "level0"})
@pytest.mark.parametrize(
    ["ods_code", "expected"],
    [
        [
            "RJ11",
            200,
        ],
        [
            "",
            400,
        ],
        [
            "VALID_ODS_CODE_BUT_NOT_GRANTED",
            403,
        ],
    ],
)
def test_smoke(
    ods_code: str,
    expected: int,
    _test_app_credentials,
    _jwt_keys,
    apigee_environment,
    nhsd_apim_proxy_url,
    _apigee_app_base_url,
    _create_test_app,
):
    # 1. Set your app config
    consumer_key = _test_app_credentials["consumerKey"]
    jwt_private_key = _jwt_keys["private_key_pem"]

    token_response = get_token_for_apigee_app(
        consumer_key, jwt_private_key, apigee_environment
    )

    token = token_response["access_token"]
    correlation_id = f"SMOKE:{uuid4()}"

    headers = {
        "accept": "application/json; version=1.0",
        "Authorization": f"Bearer {token}",
        "x-correlation-id": correlation_id,
        "x-request-id": f"{uuid4()}",
        "NHSD-End-User-Organisation-ODS": ods_code,
    }

    nhs_number = "9278693472"
    patient_id = urllib.parse.quote(f"https://fhir.nhs.uk/Id/nhs-number|{nhs_number}")
    url = f"{nhsd_apim_proxy_url}/FHIR/R4/DocumentReference?subject={patient_id}"
    created_app_name = _create_test_app["name"]

    apigee_update_url = f"{_apigee_app_base_url}/{created_app_name}"
    key_value_pairs = {
        "attributes": [
            {
                "name": "nrl-ods-RJ11",
                "value": "https://snomed.info/ict|736253001\nhttps://snomed.info/ict|736253002",
            }
        ],
    }

    update_response = requests.put(
        apigee_update_url,
        json=key_value_pairs,
        headers={"Authorization": f"Bearer {os.environ['APIGEE_ACCESS_TOKEN']}"},
    )
    update_response.raise_for_status()

    response = requests.get(url, headers=headers)

    assert response.status_code == expected, response.text
