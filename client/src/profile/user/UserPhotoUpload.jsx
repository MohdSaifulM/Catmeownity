import React, { useState } from 'react'
import { Button, Col, Form, FormFile, Image, InputGroup, Modal, Row } from 'react-bootstrap'
import Axios from 'axios';
import Loading from '../../Loading'

function UserPhotoUpload({ setUploadingPhoto, id, addPhoto }) {
    const [imageFile, setImageFile] = useState({ file: null, url: null });
    const [err, setErr] = useState({
        photo: "",
        desc: "",
    });
    const [loading, setLoading] = useState(false);

    function imageSelect(e) {
        if (e.target.files[0]) {
            setImageFile({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    }
    function remove() {
        if (!loading) {
            document.querySelector('.form-control-file').value = null;
            setImageFile({ file: null, url: null })
        }
    }

    async function uploadPhoto() {
        /* No image included */
        if (imageFile.file === null) {
            setErr({
                ...err,
                photo: "Please select a photo!"
            });
            return;
        }
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', imageFile.file);
            formData.append('upload_preset', 'catmeownity_user');

            const cloudinary = 'https://api.cloudinary.com/v1_1/ryhuz/image/upload';
            const instance = Axios.create();
            instance.defaults.headers.common = {};


            let img = await instance.post(cloudinary, formData);
            let image = img.data.secure_url;
            await Axios.put(`/api/auth/user/addphoto/${id}`, {
                image
            });
            setUploadingPhoto(false);
            setLoading(false);
            addPhoto();
        } catch (e) {
            setLoading(false);
        }
    }

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Upload photo of yourself</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Choose a photo and upload!
                    </p>
                {imageFile.file &&
                    <div className="text-center profile-image-upload my-4">
                        <Image src={imageFile.url} width="50%" height="auto" />
                    </div>
                }
                <Row>
                    <Col>
                        {/* Image select */}
                        <InputGroup className="border p-2 justify-content-between">
                            <FormFile type="file" name="image" onChange={imageSelect} />
                            <InputGroup.Append>
                                {imageFile.file &&
                                    <span className="btn pr-3 pt-1 text-danger" onClick={remove}>Remove upload</span>
                                }
                            </InputGroup.Append>
                        </InputGroup>
                        {/* No image - error message */}
                        {err.photo !== "" &&
                            <Form.Text>
                                <div className="text-danger ml-2">{err.photo}</div>
                            </Form.Text>
                        }
                    </Col>
                </Row>
                {loading &&
                    <Row className="justify-content-center">
                        <Col sm={2}>
                            <Loading />
                        </Col>
                    </Row>
                }
                <Row className="mt-3">
                    <Col sm={6} />
                    <Col>
                        <Button block variant="secondary" onClick={uploadPhoto} disabled={loading}>
                            Upload
                        </Button>
                    </Col>
                    <Col>
                        <Button block variant="danger" onClick={() => setUploadingPhoto(false)} disabled={loading}>
                            Cancel
                        </Button>
                    </Col>
                </Row>
            </Modal.Body>
        </>
    )
}

export default UserPhotoUpload