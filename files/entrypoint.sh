#!/bin/sh

# Author: Jarrod Cameron (z5210220)
# Date:   02/10/2024 12:08

# Exit on non-zero return status
set -e

[ -z "${LOW_USER}" ] && export LOW_USER='conk'

############################## SSH SERVER SETUP ##############################
# SSH for $LOW_USER
mkdir -p "/home/${LOW_USER}/.ssh"
if [ ! -e "/home/${LOW_USER}/.ssh/id_rsa" ]; then
	ssh-keygen -f "/home/${LOW_USER}/.ssh/id_rsa" -N ''

	cp \
		"/home/${LOW_USER}/.ssh/id_rsa.pub" \
		"/home/${LOW_USER}/.ssh/authorized_keys"

	chown -R "${LOW_USER}:${LOW_USER}" "/home/${LOW_USER}/.ssh"
fi

# Generate host keys
ssh-keygen -A
############################## SSH SERVER SETUP ##############################

################################# NGINX SETUP #################################
mkdir -p /etc/nginx/ssl/
openssl \
	req \
	-x509 \
	-newkey rsa:4096 \
	-keyout /etc/nginx/ssl/key.pem \
	-out /etc/nginx/ssl/cert.pem \
	-sha256 \
	-days 3650 \
	-nodes \
	-subj "/CN=vm.local"

touch /var/log/nginx/access.log
################################# NGINX SETUP #################################

exec supervisord \
	--nodaemon \
	--configuration /etc/supervisor/supervisord.conf \
	--user root
