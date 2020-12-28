import React from 'react'
import { Col, Modal, Row } from 'react-bootstrap'

function ConfirmDeleteComment({setConfirmDel, delComment}) {
    return (
        <>
            <Modal.Header>
                <Modal.Title>Delete Comment?</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <Row>
                    <Col>
                        <div className="btn btn-block btn-outline-danger" onClick={delComment}>
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

export default ConfirmDeleteComment
