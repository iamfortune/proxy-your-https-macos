#!/bin/bash

# Install mkcert using Homebrew
brew install mkcert

# Run mkcert to install the local CA
mkcert -install

# Create a certificate for localhost
mkcert localhost

# Install local-ssl-proxy globally using npm
npm install -g local-ssl-proxy

# Prompt the user for the source and target ports
read -p "Enter the source port (e.g., 3010): " source_port
read -p "Enter the target port (e.g., 3000): " target_port

# PEM files are generated in the current directory
echo "PEM files generated successfully."

# Run the local-ssl-proxy with user-specified ports
local-ssl-proxy --source "$source_port" --target "$target_port" --cert localhost.pem --key localhost-key.pem

