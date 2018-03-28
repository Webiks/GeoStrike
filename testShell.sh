#!/bin/bash

# --- deploying server ---
# cd packages/server
# ../../deploy.sh cesium-server $VERSION $isStage

# --- deploying client ---
# cd packages/client
# npm run build:prod
# ../../deploy.sh cesium/client $VERSION $isStage

target=$1
echo "target $target"
if [ -z "$target" ]
then
	echo "Missing deployment target"
	exit 1
fi

version=$2
echo "version $version"
if [ -z "$version" ]
then
	echo "Missing deployment version"
	exit 1
fi

if [ -z "$3" ]
then
    isStage=""
else
    isStage=-stage
fi

echo "is stage? $isStage"

echo "start deploying version $version on target $target isStage $isStage"
eval $(aws ecr get-login --no-include-email --region eu-central-1)

echo "$target$isStage:latest"
docker build -t "$target$isStage:$version" .

docker tag "$target$isStage:$version" "$target:latest"

docker tag "$target$isStage:latest" "223455578796.dkr.ecr.eu-central-1.amazonaws.com/$target$isStage:latest"

docker tag "$target$isStage:latest" "223455578796.dkr.ecr.eu-central-1.amazonaws.com/$target$isStage:$version"

docker push "223455578796.dkr.ecr.eu-central-1.amazonaws.com/$target$isStage:latest"

docker push "223455578796.dkr.ecr.eu-central-1.amazonaws.com/$target$isStage:$version"

echo "deployment succeeded";

$SHELL
PAUSE
read -n1 -r -p "Pre