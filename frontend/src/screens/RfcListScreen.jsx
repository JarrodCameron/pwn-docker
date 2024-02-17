import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Placeholder from 'react-bootstrap/Placeholder';
import Row from 'react-bootstrap/Row';

import AxiosClient from '../utils/AxiosClient';

const isRegexMatch = (query, string) => {
    const regex = new RegExp(query, "i");
    return regex.test(string);
}

function RfcListScreen() {

    const [query, setQuery] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [rfcList, setRfcList] = useState([]);

    const ac = new AxiosClient();

    /***************************** AXIOS CONFIG *****************************/
    ac.setStatusHandler(200 /* OK */, response => {
        const newRfcList = response.data['data'].map(entry => ({
            'title': `[RFC${entry['id']}] ${entry['name']}`,
            'link': `https://datatracker.ietf.org/doc/html/rfc${entry['id']}`,
        }));
        setRfcList(newRfcList);
    });
    /***************************** AXIOS CONFIG *****************************/

    useEffect(() => {
        ac.get('/api/rfc-list/');
    }, []);

    const handleOnChange = e => {
        const newQuery = e.target.value;

        try {
            // Will throw exception if invalid regex
            RegExp(newQuery, "i");

            setQuery(newQuery);
            setIsValid(true);
        } catch {
            setIsValid(false);
        }
    }

    return (
        <>
            <Container className="p-5">

                <h1>RFC List</h1>

                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <InputGroup className="my-3">
                            <InputGroup.Text>/&gt;</InputGroup.Text>
                            <Form.Control
                                placeholder="TCP, UDP, IP, Kerberos, ..."
                                aria-label="Search"
                                onChange={handleOnChange}
                                isInvalid={!isValid}
                            />
                            <Form.Control.Feedback type="invalid">
                                Invalid regular expression!
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Col>
                </Row>


                <ListGroup>
                    {rfcList.map((entry, index) => (
                        isRegexMatch(query, entry['title']) && <ListGroup.Item
                            key={index} action
                        >
                            {entry["title"]}
                            <Link
                                target="_blank"
                                rel="noopener noreferrer"
                                className="stretched-link"
                                to={entry["link"]}
                            />
                        </ListGroup.Item>
                    ))}

                    {rfcList.length === 0 && [12, 6, 10, 4].map(entry => (
                        <ListGroup.Item key={entry} action>
                            <Placeholder animation="glow">
                                <Placeholder
                                    size="lg"
                                    xs={entry}
                                />
                            </Placeholder>
                        </ListGroup.Item>
                    ))}

                </ListGroup>

                <div className="d-flex justify-content-between p-3">
                    <Button
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://datatracker.ietf.org/"
                        variant="outline-primary"
                    >IETF RFC Search</Button>

                    <p className="text-muted">
                        Total # of RFCs: <b>{rfcList.length}</b>
                    </p>
                </div>
            </Container>
        </>
    )
}

export default RfcListScreen;
