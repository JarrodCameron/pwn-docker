FROM alpine:latest

# Low priv user
ARG LOW_USER=conk

WORKDIR /root/

RUN ln -snf /usr/share/zoneinfo/Australia/Sydney /etc/localtime
RUN echo 'TZ=Australia/Sydney' > /etc/timezone

RUN echo '@testing https://dl-cdn.alpinelinux.org/alpine/edge/testing' \
	| tee -a /etc/apk/repositories

RUN apk update
RUN apk upgrade

# Install `docs` to install the man pages
RUN apk add aws-cli bash bat curl docs entr fzf git htop iproute2 jq man-db \
	man-pages net-tools netcat-openbsd nginx nmap npm openssh openssh-server \
	openssl plocate py3-impacket py3-pip py3-virtualenv python3 ripgrep \
	rlwrap samba strace supervisor tmux vim wget

RUN apk add responder@testing

# Trim the image
RUN rm -rf /var/cache/apk/*

###############################
## DOTFILES - QUALITY OF LIFE #
###############################
RUN git clone https://github.com/JarrodCameron/.dotfiles.git --depth 1
RUN sh -c 'cd .dotfiles && ./restore.sh --force'

##################
## LOW PRIV USER #
##################
RUN adduser -D -s /sbin/nologin -g 'Citizen of North Korea' "${LOW_USER}"

##############
# SSH SERVER #
##############
# Required for openssh-server to work (don't ask me why)
RUN mkdir -p /run/sshd/

COPY files/sshd_config /etc/ssh/sshd_config.d/

###############
# NGINX SETUP #
###############
# Remove any existing sites
RUN rm -rf /etc/nginx/sites-available/*
RUN rm -rf /etc/nginx/sites-enabled/*
RUN rm -rf /etc/nginx/http.d/*

COPY files/nginx/nginx.conf /etc/nginx/http.d/nginx.conf

###############
# SUPERVISORD #
###############
RUN mkdir -p /var/log/supervisor/
COPY files/supervisord.conf /etc/supervisor/supervisord.conf

######################
# OTHER CONFIG FILES #
######################
COPY files/smb.conf /etc/samba/smb.conf

#################
# WEB APP STUFF #
#################
COPY app/ /web/app
COPY frontend/ /web/frontend

RUN python3 -m venv /web/venv
RUN /web/venv/bin/pip install -r /web/app/requirements.txt

COPY files/entrypoint.sh /entrypoint.sh

###################
# QUALITY OF LIFE #
###################
RUN updatedb

ENV LOW_USER "${LOW_USER}"
CMD ["/bin/sh", "/entrypoint.sh"]
