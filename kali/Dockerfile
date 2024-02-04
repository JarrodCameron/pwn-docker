FROM kalilinux/kali-rolling

WORKDIR /root/

RUN ln -snf /usr/share/zoneinfo/Australia/Sydney /etc/localtime
RUN echo 'TZ=Australia/Sydney' > /etc/timezone

RUN dpkg --add-architecture i386
RUN apt-get update -y
RUN apt-get update --fix-missing
RUN apt-get upgrade -y

# Smaller downloads to prevent mysterous 404 errors.
RUN apt install -y --no-install-recommends apt-utils ascii awscli bat \
	build-essential cargo cifs-utils cmake cscope curl dnsutils dos2unix entr \
	exuberant-ctags fzf gawk gcc gcc-multilib gdb gdb-multiarch git htop

RUN apt install -y --no-install-recommends iproute2 jq libc6:i386 libdb-dev \
	libffi-dev libpcre3-dev libssl-dev libstdc++6:i386 libxaw7-dev libxt-dev \
	locate ltrace make man man-db maven metasploit-framework nasm net-tools

RUN apt install -y --no-install-recommends netcat-openbsd nginx nmap \
	openssh-server pahole patchelf php plocate powershell procps proxychains \
	psmisc python3 python3-dev python3-pip python3-virtualenv radare2 ripgrep

RUN apt install -y --no-install-recommends rlwrap rubygems samba smbclient \
	strace supervisor tmux valgrind vim virtualenvwrapper wget xdotool

# Do this last because it's so fucking big
RUN apt install -y --no-install-recommends npm

##############################
# DOTFILES - QUALITY OF LIFE #
##############################
RUN git clone https://github.com/JarrodCameron/.dotfiles.git --depth 1
RUN sh -c 'cd .dotfiles && ./restore.sh --force'

##########
# PWNDBG #
##########
RUN git clone https://github.com/pwndbg/pwndbg /root/tools/pwndbg
RUN sh -c 'cd ~/tools/pwndbg/ && ./setup.sh'

#################
# LOW PRIV USER #
#################
RUN useradd --create-home --shell /bin/bash kali
RUN echo 'kali:Password@123' | chpasswd
RUN /bin/echo -e 'Password@123\nPassword@123' | smbpasswd -a kali

#########################
# SSH CLIENT AND SERVER #
#########################
RUN mkdir -p /home/kali/.ssh
RUN ssh-keygen -f /home/kali/.ssh/id_rsa -N ''
RUN cp /home/kali/.ssh/id_rsa.pub /home/kali/.ssh/authorized_keys
RUN chown -R kali:kali /home/kali/.ssh

# Require for sshd to work (don't ask me why)
RUN mkdir -p /run/sshd/

############################
# PREP CONTAINER FOR NGINX #
############################
RUN mkdir -p /etc/nginx/ssl/
RUN openssl \
	req \
	-x509 \
	-newkey rsa:4096 \
	-keyout /etc/nginx/ssl/key.pem \
	-out /etc/nginx/ssl/cert.pem \
	-sha256 \
	-days 3650 \
	-nodes \
	-subj "/CN=vm.local"

# Remove any existing sites
RUN rm -rf /etc/nginx/sites-available/*
RUN rm -rf /etc/nginx/sites-enabled/*

###################
# QUALITY OF LIFE #
###################
RUN echo 'export PS1="\e[1m(kali) ${PS1}"' | tee -a /root/.bashrc
RUN updatedb

#####################
# COPY CONFIG FILES #
#####################
# `docker-compose.yml` will also mount these files. So why do we `COPY` them?
# This is so images uploaded to docker hub contain the config files.
COPY kali/smb.conf /etc/samba/smb.conf
COPY kali/supervisord.conf /etc/supervisor/conf.d/
COPY files/nginx/nginx.conf /etc/nginx/conf.d/nginx.conf
COPY app/ /web/app
COPY frontend/ /web/frontend

###################################
# PYTHON DEPENDANCIES FOR WEB APP #
###################################
COPY app/requirements.txt .
RUN mkdir -p /web/
RUN python3 -m venv /web/venv
RUN pip3 --python /web/venv/bin/python3 install -r requirements.txt
RUN rm -f requirements.txt

CMD [ \
	"supervisord", \
	"--nodaemon", \
	"--configuration", "/etc/supervisor/supervisord.conf", \
	"--user", "root" \
]
