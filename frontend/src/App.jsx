import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createContext } from 'react';
import axios from 'axios';
import { LinkContainer } from 'react-router-bootstrap';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

import DashboardScreen from './screens/DashboardScreen';
import UploadScreen from './screens/UploadScreen';
import ReverseSshScreen from './screens/ReverseSshScreen';
import MicrosoftStandardsScreen from './screens/MicrosoftStandardsScreen';
import RfcListScreen from './screens/RfcListScreen';

import { SUN_ICON } from './utils/Icons.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

    const handleClick = e => {
        const theme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-bs-theme', newTheme);
    }

    return (
        <>
            <Router>
                <Navbar className="bg-body-tertiary">
                    <Container>
                        <LinkContainer to="/">
                            <Navbar.Brand>Pwn Docker</Navbar.Brand>
                        </LinkContainer>

                        <Button
                            type="button"
                            size="sm"
                            variant="outline-secondary"
                            onClick={e => handleClick(e)}
                        >{SUN_ICON}</Button>
                    </Container>
                </Navbar>

                <Routes>
                    <Route path="/" element={<DashboardScreen />} exact />
                    <Route path="/upload" element={<UploadScreen />} exact />
                    <Route
                        path="/rfc-list"
                        element={<RfcListScreen />}
                        exact
                    />

                    <Route
                        path="/reverse-ssh"
                        element={<ReverseSshScreen />}
                        exact
                    />

                    <Route
                        path="/microsoft-standards"
                        element={<MicrosoftStandardsScreen />}
                        exact
                    />

                </Routes>
            </Router>
        </>
    )
}

export default App
