FROM ubuntu:rolling

ENV LC_CTYPE C.UTF-8
ENV TZ=Australia/Sydney

RUN ln -snf /usr/share/zoneinfo/Australia/Sydney /etc/localtime && \
	echo TZ=Australia/Sydney > /etc/timezone

RUN dpkg --add-architecture i386 && \
	apt-get update -y && \
	apt-get update --fix-missing && \
	apt-get upgrade -y

RUN apt-get install -y apt-utils ascii awscli bat build-essential cargo cmake \
        cscope curl dnsutils exuberant-ctags fzf gawk gcc gcc-multilib gdb \
        gdb-multiarch git iproute2 jq libc6:i386 libdb-dev libffi-dev \
        libncurses5:i386 libpcre3-dev libssl-dev libstdc++6:i386 libxaw7-dev \
        libxt-dev locate ltrace make man maven nasm net-tools netcat nginx nmap \
        openssh-server patchelf php procps psmisc python2 python3 python3-dev \
        python3-pip qemu-system ripgrep rubygems strace tmux valgrind vim \
        virtualenvwrapper wget pahole proxychains

# Symlink because `bat` is installed as `batcat`
RUN ln -s /usr/bin/batcat /usr/local/sbin/bat

RUN git clone https://github.com/JarrodCameron/.dotfiles /root/.dotfiles \
	&& cd /root/.dotfiles \
	&& ./restore.sh --force

RUN python3 -m pip install --upgrade azure-cli pwntools capstone filebytes \
        flask keystone-engine ropper pyvex z3-solver

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
COPY files/reverse_ssh.sh /web/templates/reverse_ssh.sh
COPY files/intel_isa_first.pdf /root/docs/intel_isa_first.pdf
COPY files/intel_isa_second.pdf /root/docs/intel_isa_second.pdf
COPY Dockerfile /root/Dockerfile

# Don't use `ENTRYPOINT` because we might not want the background services
# to run
CMD ["/root/entrypoint.sh"]

WORKDIR /root
