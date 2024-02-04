import { Link } from 'react-router-dom';
import { useState } from 'react'
import axios from 'axios';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import AxiosClient from '../utils/AxiosClient';
import LoadableButton from '../components/LoadableButton';

const DEFAULT_HOST = document.location['host'];
const DEFAULT_FILE = 'file.txt';

const COMMAND_TYPES = [
    ['Linux curl', (host, filePath, enableHttps) => {
        if (enableHttps === true) {
            return `curl -F f=@${filePath} -k https://${host}/api/upload/`;
        } else {
            return `curl -F f=@${filePath} http://${host}/api/upload/`;
        }
    }],

    ['Linux full path curl', (host, filePath, enableHttps) => {
        if (enableHttps === true) {
            return `/usr/bin/curl -F f=@${filePath} -k https://${host}/api/upload/`;
        } else {
            return `/usr/bin/curl -F f=@${filePath} http://${host}/api/upload/`;
        }
    }],

    ['Linux curl (stdin)', (host, filePath, enableHttps) => {
        if (enableHttps === true) {
            return `curl -F f=@- -k https://${host}/api/upload/ < ${filePath}`;
        } else {
            return `curl -F f=@- http://${host}/api/upload/ < ${filePath}`;
        }
    }],


    ['Linux full path curl (stdin)', (host, filePath, enableHttps) => {
        if (enableHttps === true) {
            return `/usr/bin/curl -F f=@- -k https://${host}/api/upload/ < ${filePath}`;
        } else {
            return `/usr/bin/curl -F f=@- http://${host}/api/upload/ < ${filePath}`;
        }
    }],
];

function UploadScreen() {

    return (
        <>
            <Container className="p-5">
                <h1>Upload File</h1>
                <Row className="justify-content-center">
                    <Col xs={6}>
                        <Tabs
                            defaultActiveKey="web-interface"
                            className="mb-3"
                            variant="pills"
                        >
                            <Tab eventKey="web-interface" title="Web Interface">
                                {webInterfaceTab()}
                            </Tab>

                            <Tab eventKey="cli" title="Command Line Interface">
                                {cliTab()}
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Container>
        </>
    );

};

const webInterfaceTab = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const ac = new AxiosClient();

    /***************************** AXIOS CONFIG *****************************/
    ac.setStatusHandler(200 /* OK */, response => {
        setFileName(response.data['data']['name']);
        setFileUrl(response.data['data']['location']);
        setShowSuccess(true);
    });

    ac.setStatusHandler(400 /* Bad Request */, error => {
        setErrorText(error.response.data['error']['message']);
        setShowError(true);
    });
    /***************************** AXIOS CONFIG *****************************/

    /***************************** EVENT HANDLES *****************************/
    const handleSubmit = (event) => {
        event.preventDefault()
        setIsLoading(true);
        const formData = new FormData();
        formData.append("f", selectedFile);
        ac.post(
            "/api/upload/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            }
        ).then(response => {
            setIsLoading(false);
        }).catch(error => {
            setIsLoading(false);
        })
    };

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };
    /***************************** EVENT HANDLES *****************************/


    return (
        <>
            <Card>
                <Card.Body>

                    <Card.Title className="p-3">
                        <h3>Select Your File</h3>
                    </Card.Title>

                    <Form onSubmit={handleSubmit}>
                        <input
                            type="file"
                            onChange={handleFileSelect}
                        />
                        <LoadableButton
                            type="submit"
                            isLoading={isLoading}
                        />
                    </Form>

                    <Alert
                        show={showSuccess}
                        variant="success"
                        className="m-4"
                        dismissible
                        onClose={() => setShowSuccess(false)}
                    >
                        File (<b>{fileName}</b>) uploaded to <Alert.Link
                        href={fileUrl}>{fileUrl}</Alert.Link>.
                    </Alert>

                    <Alert
                        show={showError}
                        variant="danger"
                        className="m-4"
                        dismissible
                        onClose={() => setShowError(false)}
                    >{errorText}</Alert>
                </Card.Body>
            </Card>
        </>
    );
};

const cliTab = () => {

    const [host, setHost] = useState(DEFAULT_HOST);
    const [filePath, setFilePath] = useState('');
    const [enableHttps, setEnableHttps] = useState(false);
    const [commandIndex, setCommandIndex] = useState(0);

    return (
        <>
            <Card>
                <Card.Body>

                    <InputGroup className="mb-3">
                        <InputGroup.Text>Host</InputGroup.Text>
                        <Form.Control
                            placeholder="1.2.3.4"
                            defaultValue={DEFAULT_HOST}
                            onChange={e => setHost(e.target.value)}
                        >
                        </Form.Control>
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <InputGroup.Text>File Path</InputGroup.Text>
                        <Form.Control
                            placeholder={DEFAULT_FILE}
                            defaultValue={DEFAULT_FILE}
                            onChange={e => setFilePath(e.target.value)}
                        >
                        </Form.Control>
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <InputGroup.Text>Type</InputGroup.Text>
                        <Form.Select
                            onChange={e => {
                                const value = parseInt(e.target.value);
                                setCommandIndex(value);
                            }}
                        >
                            {COMMAND_TYPES.map((entry, index) => (
                                <option value={index} key={index}>
                                    {entry[0]}
                                </option>
                            ))}
                        </Form.Select>
                    </InputGroup>

                    <Form.Check
                        type="switch"
                        label="Enable HTTPS"
                        onChange={e => setEnableHttps(e.target.checked)}
                    />

                    <div className="d-flex justify-content-center mt-4 mb-3">

                        <code>{COMMAND_TYPES[commandIndex][1](
                            (host.length === 0) ? DEFAULT_HOST : host,
                            (filePath.length === 0) ? DEFAULT_FILE : filePath,
                            enableHttps
                        )}</code>
                    </div>
                </Card.Body>
            </Card>
        </>
    );

};

export default UploadScreen;
