#!/bin/bash

# --- deploying server ---
# cd packages/server
# ../../deploy.sh cesium-server $VERSION

# --- deploying client ---
# cd packages/client
# npm run build:prod
# ../../deploy.sh cesium/client $VERSION

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

echo "start deploying version $version on target $target"

eval $(aws ecr get-login --no-include-email --region eu-central-1)

docker build -t "$target:$version" .

docker tag "$target:$version" "$target:latest"

docker tag "$target:latest" "223455578796.dkr.ecr.eu-central-1.amazonaws.com/$target:latest"

docker tag "$target:latest" "223455578796.dkr.ecr.eu-central-1.amazonaws.com/$target:$version"

docker push "223455578796.dkr.ecr.eu-central-1.amazonaws.com/$target:latest"

docker push "223455578796.dkr.ecr.eu-central-1.amazonaws.com/$target:$version"

echo "deployment succeeded";

PAUSE
read -n1 -r -p "Press any key to continue..." key