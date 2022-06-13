FROM ubuntu:rolling

ENV LC_CTYPE C.UTF-8
ENV TZ=Australia/Sydney

RUN ln -snf /usr/share/zoneinfo/Australia/Sydney /etc/localtime && \
	echo TZ=Australia/Sydney > /etc/timezone

RUN dpkg --add-architecture i386 && \
	apt-get update -y && \
	apt-get update --fix-missing && \
	apt-get upgrade -y

# Because of my bad internet, we do this is multiple stages
RUN apt-get install -y apt-utils ascii bat build-essential cargo cmake cscope
RUN apt-get install -y curl dnsutils exuberant-ctags fzf gawk gcc gcc-multilib
RUN apt-get install -y gdb gdb-multiarch git iproute2 jq libc6:i386 libdb-dev
RUN apt-get install -y libffi-dev libncurses5:i386 libpcre3-dev libssl-dev
RUN apt-get install -y libstdc++6:i386 libxaw7-dev libxt-dev locate ltrace make
RUN apt-get install -y man nasm net-tools netcat nginx openssh-server patchelf
RUN apt-get install -y php procps psmisc python2 python3 python3-dev
RUN apt-get install -y python3-pip ripgrep rubygems strace tmux valgrind vim
RUN apt-get install -y virtualenvwrapper wget

RUN git clone https://github.com/JarrodCameron/.dotfiles /root/.dotfiles \
	&& cd /root/.dotfiles \
	&& ./restore.sh --force

RUN python3 -m pip install --upgrade pwntools capstone filebytes flask \
	keystone-engine ropper pyvex z3-solver

RUN git clone https://github.com/radare/radare2 ~/tools/radare2 \
	&& cd ~/tools/radare2/ \
	&& sys/install.sh

RUN git clone https://github.com/pwndbg/pwndbg ~/tools/pwndbg \
	&& cd ~/tools/pwndbg/ \
	&& ./setup.sh

RUN gem install one_gadget

RUN updatedb

# Create low priv pleb user, this is mainly for ssh
RUN useradd -m -s /bin/bash jc

COPY files/entrypoint.sh /root/entrypoint.sh
COPY files/nginx.conf /etc/nginx/nginx.conf
COPY files/sshd_config /etc/ssh/sshd_config
COPY files/app.py /web/app.py
COPY Dockerfile /root/Dockerfile

# Don't use `ENTRYPOINT` because we might not want the background services
# to run
CMD ["/root/entrypoint.sh"]

WORKDIR /root
