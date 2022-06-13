#!/bin/sh

IP="{{ ip }}"
PORT="{{ port }}"

tmp="$(mktemp)"

cat > "$tmp" << EOF
{{ ssh_private_key }}
EOF

mkdir -p ~/.ssh/
ssh-keyscan -p "$PORT" "$IP" >> ~/.ssh/known_hosts
echo '{{ ssh_public_key }}' >> ~/.ssh/authorized_keys

ssh -N -i "$tmp" -p "$PORT" -R 2000:localhost:22 jc@"$IP"
rm -f "$tmp"



