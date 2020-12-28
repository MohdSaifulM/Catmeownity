import React from 'react'
import { Col, Modal, Row } from 'react-bootstrap'

function ConfirmDeletePhoto({ setConfirmDel, delPhoto }) {
    return (
        <>
            <Modal.Header>
                <Modal.Title>Delete this photo?</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <Row>
                    <Col>
                        <div className="btn btn-block btn-outline-danger" onClick={delPhoto}>
                            Yes
                        </div>
                    </Col>
                    <Col>
                        <div className="btn btn-block btn-outline-secondary" onClick={() => (setConfirmDel(false))}>
                            No
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </>
    )
}

export default ConfirmDeletePhoto
