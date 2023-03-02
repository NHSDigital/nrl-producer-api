from uuid import uuid4

import pytest
import requests

import urllib.parse


@pytest.mark.skip(reason="Producing inconsistent results due to race condition with APIGEE API & NHS Login")
@pytest.mark.sandbox
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
def test_smoke(ods_code: str, expected: int, nhsd_apim_proxy_url):

    headers = {
        "accept": "application/json; version=1.0",
        "x-correlation-id": f"SMOKE:{uuid4()}-odsCode_{ods_code}-expected_{expected}",
        "x-request-id": f"{uuid4()}",
        "NHSD-End-User-Organisation-ODS": ods_code,
        "Authorization": "letmein",
    }

    patient_id = urllib.parse.quote("https://fhir.nhs.uk/Id/nhs-number|9278693472")
    url = f"{nhsd_apim_proxy_url}/FHIR/R4/DocumentReference?subject.identifier={patient_id}"
    response = requests.get(url, headers=headers)
    assert response.status_code == expected, response.text
