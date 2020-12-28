import React, { useState } from 'react'
import { Button, Col, Form, FormControl, FormFile, Image, InputGroup, Modal, Row } from 'react-bootstrap'
import Axios from 'axios';
import Loading from '../../Loading'

function CatPhotoUpload({ setUploadingPhoto, defaultPhoto, id, addPhoto, user }) {
    const [imageFile, setImageFile] = useState({ file: null, url: null });
    const [desc, setDesc] = useState("");
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
    function descHandler(e) {
        setDesc(e.target.value);
        if (err.photo !== "" || err.desc !== "") {
            setErr({
                photo: "",
                desc: "",
            })
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
        /* No description included */
        if (desc === "") {
            setErr({
                ...err,
                desc: "Please enter a description!"
            });
            return;
        }
        setLoading(true);
        /* If this is the first photo, set to default */
        let isDefault;
        if (defaultPhoto === null || defaultPhoto === undefined) {
            isDefault = true;
        }

        try {
            const formData = new FormData();
            formData.append('file', imageFile.file);
            formData.append('upload_preset', 'catmeownity_cat');

            const cloudinary = 'https://api.cloudinary.com/v1_1/ryhuz/image/upload';
            const instance = Axios.create();
            instance.defaults.headers.common = {};


            let img = await instance.post(cloudinary, formData);
            let image = img.data.secure_url;
            let photo = {
                image,
                isDefault,
                desc,
                uploadedBy: user.user._id
            }
            await Axios.put(`/api/auth/cats/addphoto/${id}`, photo);
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
                <Modal.Title>Upload cat photo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Choose a photo, add a description, and upload!
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
                {imageFile.file &&
                    <Row>
                        <Col>
                            {/* Description input */}
                            <InputGroup className="p-2 justify-content-between">
                                <FormControl type="text" name="desc" onChange={descHandler} placeholder="A short sentence about the photo" />
                            </InputGroup>
                            {/* No description - error message */}
                            {err.desc !== "" &&
                                <Form.Text>
                                    <div className="text-danger ml-2">{err.desc}</div>
                                </Form.Text>
                            }
                        </Col>
                    </Row>
                }
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

export default CatPhotoUpload
