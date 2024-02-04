#!/bin/sh

set -e

HOST='{{ host }}'
PORT='{{ port }}'
USERNAME='{{ username }}'

private_key_file="$(mktemp)"
trap "rm -rf $private_key_file" EXIT INT

mkdir -p ~/.ssh/
/bin/echo -n '{{ public_ssh_key }}' >> ~/.ssh/authorized_keys

cat > "$private_key_file" << EOF
{{ private_ssh_key }}
EOF

chmod 400 "$private_key_file"

listen_port="$(shuf \
    --head-count=1 \
    --input-range='{{ min_port }}-{{ max_port }}'
)"

ssh \
    -N \
    -o StrictHostKeyChecking=no \
    -o UserKnownHostsFile=/dev/null \
    -p "$PORT" \
    -i "$private_key_file" \
    -R "127.0.0.1:$listen_port:127.0.0.1:22" \
    "$USERNAME@$HOST"
