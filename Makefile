SHELL=/bin/bash -euo pipefail

#Installs dependencies using poetry.
install-python:
	python --version
	poetry --version
	poetry install

#Installs dependencies using npm.
install-node:
	npm install --legacy-peer-deps

#Configures Git Hooks, which are scipts that run given a specified event.
.git/hooks/pre-commit:
	cp scripts/pre-commit .git/hooks/pre-commit

#Condensed Target to run all targets above.
install: install-node install-python .git/hooks/pre-commit

#Run the npm linting script (specified in package.json). Used to check the syntax and formatting of files.
lint:
	# npm run lint
	find . -name '*.py' -not -path '**/.venv/*' | xargs poetry run flake8

#Removes build/ + dist/ directories
clean:
	rm -rf build
	rm -rf dist

#Creates the fully expanded OAS spec in json
publish: clean
	mkdir -p build
	npm run publish 2> /dev/null

#Runs build proxy script
build-proxy:
	scripts/build_proxy.sh

run:
	sudo docker run -e SWAGGER_JSON=/swagger.json -v ./build/nrl-producer-api.json:/swagger.json -p 8080:8080 docker.io/swaggerapi/swagger-ui

#Files to loop over in release
_dist_include="pytest.ini poetry.lock poetry.toml pyproject.toml Makefile build/. tests"

#Create /dist/ sub-directory and copy files into directory
release: clean publish build-proxy
	mkdir -p dist
	for f in $(_dist_include); do cp -r $$f dist; done

#Command to run end-to-end smoktests post-deployment to verify the environment is working
smoketest:
	@if [[ "${PROXY_NAME}" == *sandbox ]]; then\
		poetry run pytest -v --junitxml=smoketest-report.xml -s --proxy-name=${PROXY_NAME} --api-name=${API_NAME} -m "not smoketest";\
	elif [[ ${ENVIRONMENT} == prod  ]]; then\
		poetry run pytest -v --junitxml=smoketest-report.xml -s --proxy-name=${PROXY_NAME} --api-name=${API_NAME} --apigee-app-id=${PROD_APIGEE_APP_ID} --apigee-organization="nhsd-prod" --status-endpoint-api-key=${STATUS_ENDPOINT_API_KEY} -m "not sandbox" -k "test_status_endpoint";\
	elif [[ ${ENVIRONMENT} == int  ]]; then\
		poetry run pytest -v --junitxml=smoketest-report.xml -s --proxy-name=${PROXY_NAME} --api-name=${API_NAME} --apigee-app-id=${INT_APIGEE_APP_ID} --apigee-organization="nhsd-prod" --status-endpoint-api-key=${STATUS_ENDPOINT_API_KEY} -m "not sandbox" -k "test_status_endpoint";\
	else\
		poetry run pytest -v --junitxml=smoketest-report.xml -s --proxy-name=${PROXY_NAME} --api-name=${API_NAME} -m "not sandbox";\
	fi;