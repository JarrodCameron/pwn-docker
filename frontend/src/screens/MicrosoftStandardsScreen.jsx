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

const compareStrings = (a, b) => {
    const titleA = a['title'].toLowerCase();
    const titleB = b['title'].toLowerCase();
    if (titleA === titleB) {
        return 0
    } else if (titleA > titleB) {
        return 1;
    } else {
        return -1;
    }
}

const isRegexMatch = (query, string) => {
    const regex = new RegExp(query, "i");
    return regex.test(string);
}

function MicrosoftStandardsScreen() {

    const [standards, setStandards] = useState([]);
    const [query, setQuery] = useState('');
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        axios.get("/api/microsoft-standards/").then(response => {
            const unorderedStandards = response.data['data'];
            const orderedStandards = unorderedStandards.sort(compareStrings);
            setStandards(orderedStandards);
        });
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

                <h1>Microsoft Standards</h1>

                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <InputGroup className="my-3">
                            <InputGroup.Text>/&gt;</InputGroup.Text>
                            <Form.Control
                                placeholder="NTLM, Kerberos, Active Directory, ..."
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
                    {standards.map((entry, index) => (
                        isRegexMatch(query, entry['title']) && <ListGroup.Item
                            key={index} action
                        >
                            {entry.title}
                            <Link
                                target="_blank"
                                rel="noopener noreferrer"
                                className="stretched-link"
                                to={entry.href}
                            />
                        </ListGroup.Item>
                    ))}

                    {standards.length === 0 && [12, 6, 10, 4].map(entry => (
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
                        href="https://learn.microsoft.com/search/"
                        variant="outline-primary"
                    >Microsoft Search</Button>

                    <p className="text-muted">
                        Total # of standards: <b>{standards.length}</b>
                    </p>
                </div>
            </Container>
        </>
    )
}

export default MicrosoftStandardsScreen;
