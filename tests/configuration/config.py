from .environment import ENV

apigee_app_ids = {
    "int": "7a4ad8c7-3927-4259-af7b-ac9d305a86ad",
    "prod": "881f4128-2dcd-4a61-90a6-33af19c3c202",
    "internal-dev": "123456"
}

# Api Details
ENVIRONMENT = ENV["environment"]
BASE_URL = f"https://{ENVIRONMENT}.api.service.nhs.uk"
BASE_PATH = ENV["base_path"]
APIGEE_APP_ID = apigee_app_ids[ENVIRONMENT]
