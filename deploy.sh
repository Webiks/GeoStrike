#!/bin/bash

# --- deploying server ---
# cd packages/server
# ../../deploy.sh server-[stable or stage] $VERSION

# --- deploying client ---
# cd packages/client
# npm run build:prod
# ../../deploy.sh client-[stable or stage] $VERSION

target=$1
echo "target $target"
if [ -z "$target" ]
then
   echo "Missing deployment target"
else
   target=geostrike-$target
fi

version=$2
echo "version $version"
if [ -z "$version" ]
then
   echo "Missing deployment version"
fi


serverAddress=223455578796.dkr.ecr.eu-central-1.amazonaws.com/

uploadServerAddress=$serverAddress$target:$version
echo "$uploadServerAddress"


eval $(aws ecr get-login --no-include-email --region eu-central-1)

docker build -t "$target:$version" .

docker tag "$target:$version" "$target:latest"

docker tag "$target:latest" "223455578796.dkr.ecr.eu-central-1.amazonaws.com/$target:latest"

docker tag "$target:latest" "223455578796.dkr.ecr.eu-central-1.amazonaws.com/$target:$version"

docker push "2234555787 96.dkr.ecr.eu-central-1.amazonaws.com/$target:latest"

docker push "223455578796.dkr.ecr.eu-central-1.amazonaws.com/$target:$version"

echo "deployment succeeded";

read -n1 -r -p "Press any key to continue..." key