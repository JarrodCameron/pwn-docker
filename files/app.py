from flask import Flask, send_from_directory, request
import secrets

ERROR_400 = '''\
"file" param not found! Try uploading your file with one of the following:

curl -F file=@/path/to/file.txt http://localhost/
curl -F file=@- http://localhost/ < /path/to/file.txt
'''

app = Flask(__name__)

@app.route('/')
def index():
    return 'Web App with Python Flask!'

@app.route('/upload', methods=['POST'])
def upload_file():
    if False:
        # Disabled by default to prevent DOS
        return 'Modify the source to enable this feature!', 503

    if 'file' not in request.files:
        return ERROR_400, 400

    f = f'/web/upload/{secrets.token_hex(8)}.bin'
    request.files['file'].save(f)
    return f, 202


@app.route('/static/<path>')
def static_file(path):
    return send_from_directory('/web/static/', path)

if __name__ == '__main__':
    app.run(host='127.0.0.1', debug=True)
