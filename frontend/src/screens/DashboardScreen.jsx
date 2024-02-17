import { Link } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const DashboardCard = ({text, to, newTab}) => {

    return <Card className="p-2 m-2">
        <Card.Body as="h5">{text}</Card.Body>

        {newTab === false && <Link
            className="stretched-link"
            to={to}
        />}

        {newTab === true && <Link
            target="_blank"
            rel="noopener noreferrer"
            className="stretched-link"
            to={to}
        />}

    </Card>
}

const links = [
/*  Name                    Link                                 New tab     */
    ["Microsoft Standards", "/microsoft-standards",              false],
    ["IETF RFC List",       "/rfc-list",                         false],
    ["Upload",              "/upload",                           false],
    ["Reverse SSH Shell",   "/reverse-ssh",                      false],
    ["Static Files",        "/static",                           true],
    ["CyberChef",           "https://gchq.github.io/CyberChef/", true],
    ["RevShells",           "https://www.revshells.com/",        true],
    ["gitignore",           "https://gitignore.io/",             true],
];

function DashboardScreen() {

    return (
        <>
            <Container className="p-5">

                <Row xs={1} md={2}>

                    {links.map((entry, index) => (
                        <Col key={index}>
                            <DashboardCard
                                key={index}
                                text={entry[0]}
                                to={entry[1]}
                                newTab={entry[2]}
                            />
                        </Col>
                    ))}
                </Row>

            </Container>
        </>
    )
}

export default DashboardScreen;
