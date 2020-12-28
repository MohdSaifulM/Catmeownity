import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import Loading from '../Loading';

function LogOut({ setValid, valid }) {

    function logout() {
        localStorage.removeItem('token');
        setValid({
            valid: false,
            refreshed: false,
        });
    }
    setTimeout(() => {
        logout()
    }, 1500);

    if (!valid.valid) {
        return <Redirect to="/" />
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col sm={4}>
                    <Loading />
                </Col>
            </Row>
        </Container>
    )
}

export default LogOut
