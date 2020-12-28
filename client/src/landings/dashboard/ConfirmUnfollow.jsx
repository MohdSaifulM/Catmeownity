import React from 'react'
import { Col, Modal, Row } from 'react-bootstrap'

function ConfirmUnfollow({ setConfirmUnfollow, name, gender, unfollow }) {
    function displayGender() {
        let final = {
            Male: 'him',
            Female: 'her',
        }

        if (gender === "Not Sure") {
            return "this cat";
        } else {
            return final[gender];
        }
    }

    return (
        <>
            <Modal.Header>
                <Modal.Title>Unfollowing {name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <p>Are you sure you want to unfollow {displayGender()}
                </p>
                <Row>
                    <Col>
                        <div className="btn btn-block btn-outline-danger" onClick={unfollow}>
                            Yes
                        </div>
                    </Col>
                    <Col>
                        <div className="btn btn-block btn-outline-secondary" onClick={() => (setConfirmUnfollow(false))}>
                            No
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </>
    )
}

export default ConfirmUnfollow
