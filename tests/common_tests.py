import requests
import json
import pytest


@pytest.mark.skip(reason="Disabled by NRLF-397, re-enabled by NRLF-398")
def test_ping_endpoint(nhsd_apim_proxy_url):
    resp = requests.get(nhsd_apim_proxy_url + "/_ping")
    assert resp.status_code == 200
    ping_data = json.loads(resp.text)
    assert "version" in ping_data
