import React from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

function NotLoggedIn({ setNeedToLogIn, location }) {
    localStorage.setItem('location', location)
    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Oops!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>You need to log in for that
                    </p>
                <Row>
                    <Col>
                        <NavLink to='/login' className="btn btn-block btn-secondary">
                            Login
                        </NavLink>
                    </Col>
                    <Col>
                        <NavLink to='/register' className="btn btn-block btn-primary">
                            Register
                        </NavLink>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Row>
                    <small className="nav-link" onClick={() => (setNeedToLogIn(false))}>
                        Nah I'm good
                        </small>
                </Row>
            </Modal.Footer>
        </>
    )
}

export default NotLoggedIn
