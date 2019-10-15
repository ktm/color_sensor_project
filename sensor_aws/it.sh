#!/bin/bash

docker stop dynamodb
docker rm dynamodb

npm run-script build
npm run-script SAM_template
sam build
docker run -d -v "$PWD":/dynamodb_local_db -p 8000:8000 --name dynamodb amazon/dynamodb-local

aws dynamodb create-table --endpoint-url http://localhost:8000 --table-name reading --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1


sam local start-api

