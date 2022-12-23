# pwn-docker

### TODO

- [ ] Add more info to README
- [ ] Uploading a file can be done by specifying the name
- [ ] GET request to upload enpoint should return web page
- [ ] Increase max size of file uploads allowed by nginx
- [ ] Randomly generate password for "jc" + save password to disk
- [ ] Enable SSH password authentication
- [ ] Scheduled updated should be at 3am (not lunch)
- [ ] GET:/revssh endpoint should print copy/pasteable ssh command

- [x] Add to GitHub
- [x] Generate ssh keys for `jc` user on startup
- [x] Use GitHub actions to update images on event (e.g. push, dispatch)
- [x] Generate certs for server should be in `entrypoint.sh`
- [x] Add endpoint to generate file to reverse ssh
- [x] Re-generate sigb/pwn every 24 hours
- [x] Install proxychains and pahole
- [x] Install the Azure Cli
- [x] Use ssh `-o` option so that the reverse ssh-shell doesn't need prompt
- [x] Low priv user should be in chroot jail (or some other sandbox)
