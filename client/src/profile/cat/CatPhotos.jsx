import React, { useState } from 'react'
import { Card, Col, Image, Modal } from 'react-bootstrap'
import Axios from 'axios'
import ConfirmDeletePhoto from './ConfirmDeletePhoto';

function CatPhotos({ cat, user, fetchCat }) {
    const [photoToDel, setPhotoToDel] = useState("");
    const [confirmDel, setConfirmDel] = useState(false)

    async function delPhoto(image) {
        let id = cat.cat._id;
        try {
            await Axios.put(`/api/auth/cats/delphoto/${id}`, { image });
            setConfirmDel(false);
            fetchCat();
        } catch (e) {
            console.log(e)
        }
    }
    function confirmDelphoto(photo) {
        setConfirmDel(true);
        setPhotoToDel(photo)
    }
    return (
        <>
            {cat.cat.photos.map(photo => (
                <Col key={photo._id}>
                    <Card>
                        <Image thumbnail rounded src={photo.image} className="img-responsive" width="100%" />
                        <Card.Body className='d-flex justify-content-between'>
                            <div>
                                {photo.desc}
                                <div><code className='text-dark'>-{photo.uploadedBy.name}</code></div>
                            </div>
                            {user &&
                                <div>
                                    <button type="button" className="close text-danger" aria-label="Close" onClick={() => confirmDelphoto(photo.image)}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            }
                        </Card.Body>
                    </Card>
                </Col>
            ))
            }
            <Modal show={confirmDel} onHide={() => (setConfirmDel(false))}>
                <ConfirmDeletePhoto setConfirmDel={setConfirmDel} delPhoto={() => delPhoto(photoToDel)} />
            </Modal>
        </>
    )
}

export default CatPhotos
