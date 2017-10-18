#!/bin/bash
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to 4200
cd /home/ubuntu/CesiumFPS && sudo yarn start:prod
