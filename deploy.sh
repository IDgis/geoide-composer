#!/bin/bash

echo deploying geoide composer...

export ROOT_URL=http://192.168.99.100
export PORT=8090
export COMPOSER_VERSION=1.0.10

export METEOR_SETTINGS='{
	"viewer": {
		"reloadConfigUrl": "http://${ROOT_URL}:${PORT}/geoide/refresh"
	},
	"legendGraphic": {
		"uploadFolder": "/usr/geoide-upload-folder/images/"
	},
	"requestCache": {
		"delay": 600000
	}
}'

docker-compose \
	-p geoide \
	up -d
