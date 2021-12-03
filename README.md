# WQP_UI
===================

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b4640bae0bcc4a279222f9c422da9ac5)](https://app.codacy.com/app/usgs_wma_dev/WQP_UI?utm_source=github.com&utm_medium=referral&utm_content=NWQMC/WQP_UI&utm_campaign=badger)
[![Build Status](https://travis-ci.org/NWQMC/WQP_UI.svg?branch=master)](https://travis-ci.org/NWQMC/WQP_UI)
[![codecov](https://codecov.io/gh/NWQMC/WQP_UI/branch/master/graph/badge.svg)](https://codecov.io/gh/NWQMC)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=NWQMC/WQP_UI)](https://dependabot.com)

Water Quality Portal User Interface

This application should be built using python 3.6.x and node version > 8.x.x.

## Local development - Docker

Two containers are provided - one for node-based build tooling, the second for
a Python server container.

### Build

```bash
docker-compose build
```

### Development server

The Docker Compose configuration provides a default application configuration
suitable for local development. If you would like to modify the configuration
(see [`server/config.py`](./server/config.py)), set the appropriate environment
variables in the `local.env` file in the root directory of the project. The
Geoserver Proxy requires a Geoserver URL. Example `local.env` file:

```
WQP_MAP_GEOSERVER_ENDPOINT=<url to Geoserver>
SITES_MAP_GEOSERVER_ENDPOINT=<url to ogcproxy>
SLD_ENDPOINT=<url to SLD endpoint>
CODES_ENDPOINT=<url to lookup codes endpoint>
SEARCH_QUERY_ENDPOINT=<url to search query endpoint - should add with '/'
PUBLIC_SRSNAMES_ENDPOINT=<url to public srsnames endpoint>
NLDI_SERVICES_ENDPOINT=<url to NLDI>
```

In addition are the following optional environment variables that may be used:
```
WSGI_STR=<this string will be removed when using really URLS. Defaults to empty string
GA_TRACKING_CODE=<google analytics code, defaults to empty string
NLDI_DISABLED=<include this if NLDI feature should be disabled>
ROBOTS_WELCOME=<include if you want to allow robot crawling>
LOCAL_BASE_URL=<only needed if url mapping requires it>

```

```bash
# Run in the foreground
docker-compose up

# Run in the background
docker-compose up -d

# Run just the Python dev server on port 5050
docker-compose up server

# Run just the node.js build server on port 9000
docker-compose up assets
```

### Run tests

```bash
# Run Python server tests
docker-compose run server make test

# Run Javascript tests
docker-compose run assets npm test
```

## Local development - Makefile configuration

Application configuration may be specified by creating an instance config in
`server/instance/config.py`. This configuration augments the default one.
The make devenv target will copy a sample, `server/instance/config.py.sample`,
as a convenience if one doesn't exist. By default these will point to production services.
You will need to fill in the url for the geoserver endpoint, WQP_MAP_GEOSERVER_ENDPOINT

For Windows machines it is recommended that Windows Subsystem for Linux (WSL) is used. At the time of writing this WSL version 1 must be used due to a bug in version 2. To install WSL:
1. Go to https://docs.microsoft.com/en-us/windows/wsl/install-win10 and scroll to the section titled "Manual Installation Steps"
3. Complete steps 1-4 in that section
4. In powershell run `wsl --set-default-version 1`
5. Go to https://docs.microsoft.com/en-us/windows/wsl/install-manual and download a distro of Linux
7. Open up a powershell prompt inside the folder that contains the downloaded linux distro
8. run `Add-AppxPackage .\app_name.appx`, substituting 'app_name' with the name of the file

### Install dependencies

The repository contains a make target to configure a local development environment:

```bash
make devenv
```

To manually configure your environment, please see the READMEs of each separate project.

### Development server

To run each dev server individually:

```bash
cd server && make watch
cd assets && make watch
```

See the specific project READMEs for additional information on how to run for local development

- [Flask Server README](./server/README.md)
- [Assets README](./assets/README.md)

### Run tests

To run all project tests:

```bash
make test
```

### Clean targets

```bash
make clean      ; clean build artifacts
make cleanenv   ; clean environment configuration and build artifacts
```

`make` supports chaining targets, so you could also `make clean watch`, etc.
