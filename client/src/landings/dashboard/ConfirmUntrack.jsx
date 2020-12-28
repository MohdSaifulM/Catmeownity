import React from 'react'
import { Col, Modal, Row } from 'react-bootstrap'

function ConfirmUntrack({ location, setConfirmUntrack, untrack }) {
    return (
        <>
            <Modal.Header>
                <Modal.Title>Untracking location</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <p>Are you sure you want to untrack {location}
                </p>
                <Row>
                    <Col>
                        <div className="btn btn-block btn-outline-danger" onClick={untrack}>
                            Yes
                        </div>
                    </Col>
                    <Col>
                        <div className="btn btn-block btn-outline-secondary" onClick={() => (setConfirmUntrack(false))}>
                            No
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </>
    )
}

export default ConfirmUntrack
