import React from 'react'
import Loading from '../Loading'
import { Col, Container, Image, Row } from 'react-bootstrap'
import nopic from '../resources/nocatpic.png'
import { NavLink } from 'react-router-dom'

function SimilarCat({ loading, similar }) {
    function displayCatPhoto(photos) {
        if (photos.length === 0) {
            return nopic;
        }
        let final = photos.find(photo => photo.isDefault);
        return final.image;
    }
    return (
        <Container>
            {loading && <>
                <Row className='justify-content-center'>
                    <Col xs={3}>
                        <Loading />
                    </Col>
                </Row>
                <Row className='justify-content-center'>
                    <h6>Checking for similar cats</h6>
                </Row>
            </>}
            {similar.length > 0 &&
                <>
                    <Row className="justify-content-center ml-4 mb-3">
                        <div>
                            We found the following cats in the area with the same name.<br />Would you like to see if they might be the same cat?
                        </div>
                    </Row>
                    <Row className="ml-4" sm={3}>
                        {similar.map(cat => (
                            <Col key={cat._id} className="border">
                                <div className="text-center">
                                    <NavLink to={`/cat/${cat._id}`} >{cat.names[0]}
                                    </NavLink>
                                </div>
                                <NavLink to={`/cat/${cat._id}`}>
                                    <Image src={displayCatPhoto(cat.photos)} width="100%" thumbnail />
                                </NavLink>
                            </Col>
                        ))}
                    </Row>
                </>
            }
        </Container>
    )
}

export default SimilarCat
