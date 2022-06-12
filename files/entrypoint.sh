#!/bin/sh
nginx
eval "$(which sshd)"
python3 /web/app.py >/dev/null 2>/dev/null &
exec /bin/bash
