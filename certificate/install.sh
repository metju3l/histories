#!/bin/bash

sudo apt-get update -y;
sudo apt install wget libnss3-tools -y;
export VER="v1.3.0";
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/${VER}/mkcert-${VER}-linux-amd64;
chmod +x  mkcert;
sudo mv mkcert /usr/local/bin;