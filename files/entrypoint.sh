#!/bin/sh

LOW=jc
LOW_HOME=/home/"$LOW"

# Setup Webserver with self signed TLS certs
{
	mkdir -p /web
	openssl req \
		-newkey rsa:4096 \
		-x509 \
		-sha256 \
		-days 3650 \
		-nodes \
		-out /web/server.crt \
		-keyout /web/server.key \
		-subj "/foo=bar"
	nginx
} >/dev/null 2>/dev/null &

# Setup sshd and keys for low priv user
{
	mkdir -p /run/sshd "$LOW_HOME"/.ssh
	eval "$(which sshd)"

	ssh-keygen -f "$LOW_HOME"/.ssh/id_rsa -N ''
	cat "$LOW_HOME"/.ssh/id_rsa.pub >> "$LOW_HOME"/.ssh/authorized_keys

	chown -R "$LOW:$LOW" "$LOW_HOME"/.ssh
} >/dev/null 2>/dev/null &

# Setup web app
{
	mkdir -p /web/upload /web/static /web/templates
	python3 /web/app.py
} >/dev/null 2>/dev/null &

exec /bin/bash
