import React, { useState } from 'react'
import { Button, Card, Col, FormFile, Image, InputGroup, Modal, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom';
import Loading from '../../Loading';
import Axios from 'axios';

function ProfilePic({ prevSection, formData, setHome, setValid }) {
    const [loading, setLoading] = useState(false);
    const [lastErr, setLastErr] = useState(false);
    const [imageFile, setImageFile] = useState({ file: null, url: null });

    console.log(formData)
    function imageSelect(e) {
        if (e.target.files[0]) {
            setImageFile({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    }
    function remove() {
        document.querySelector('.form-control-file').value = null;
        setImageFile({ file: null, url: null })
    }

    async function register() {
        setLoading(true);
        try {
            //include image
            let userData = { ...formData };
            console.log('starting register', userData)
            if (imageFile.file) {
                console.log('starting image upload', imageFile)
                const imageForm = new FormData();
                imageForm.append('file', imageFile.file);
                imageForm.append('upload_preset', 'catmeownity_user');

                const cloudinary = 'https://api.cloudinary.com/v1_1/ryhuz/image/upload';

                let img = await Axios.post(cloudinary, imageForm);
                let imageURL = img.data.secure_url;

                userData.image = imageURL;
            }
            console.log('after image upload', userData)
            //register user
            let resp = await Axios.post("/api/user/register", userData);
            // store token in local storage
            localStorage.setItem('token', resp.data.token);

            setLoading(false);
            setValid({
                valid: true,
                refreshed: false,
            });
            setHome(true);
        } catch (error) {
            console.log(error.response)
            setLastErr(true)
            setLoading(false);
        }
    }

    return (
        <>
            <Modal show={lastErr} onHide={() => (setLastErr(false))}>
                <Modal.Header closeButton>
                    <Modal.Title>Error creating your account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NavLink to='/' className='btn btn-block btn-outline-danger'>Back to home</NavLink>
                </Modal.Body>
            </Modal>
            <Card className="p-3 mx-auto mt-5">
                <Card.Body>
                    <h5>Would you like to upload a profile photo?</h5>
                    <hr />
                    {imageFile.file &&
                        <div className="text-center profile-image-upload my-4">
                            <Image src={imageFile.url} />
                        </div>
                    }
                    <Row>
                        <Col>
                            <InputGroup className="border p-2 justify-content-between">
                                <FormFile className="" type="file" name="image" onChange={imageSelect} />
                                <InputGroup.Append>
                                    {imageFile.file && !loading && (
                                        <span className="btn pr-3 pt-1 text-danger" onClick={remove}>Remove upload</span>
                                    )}
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row className='justify-content-center'>
                        <Col sm={9}>
                            <Row className="justify-content-around mt-3">
                                <Col sm={6}>
                                    <Button block variant='outline-dark' onClick={() => prevSection(false)}>
                                        Back
                                </Button>
                                </Col>
                                <Col sm={6}>
                                    {imageFile.file ?
                                        <Button block variant='dark' onClick={register} disabled={loading}>
                                            Upload and complete sign-up
                            </Button> :
                                        <Button block variant='danger' onClick={register} disabled={loading}>
                                            Skip this step and complete sign-up
                            </Button>
                                    }
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {loading &&
                        <Row className="justify-content-center">
                            <Col sm={2}>
                                <Loading />
                            </Col>
                        </Row>
                    }
                </Card.Body>
            </Card >
        </>
    )
}

export default ProfilePic
