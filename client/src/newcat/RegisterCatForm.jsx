import React, { useState } from 'react'
import { Formik } from "formik";
import * as Yup from "yup";
import Loading from '../Loading';
import Axios from 'axios'
import SimilarCat from './SimilarCat';
import { Button, Col, Form, FormFile, Image, InputGroup, Row } from 'react-bootstrap'

function RegisterCatForm({ locationID, setAdding, user, adding, setNewCatError }) {

    const [loading, setLoading] = useState(false);
    const [sameName, setSameName] = useState([]);
    const [imageFile, setImageFile] = useState({ file: null, url: null });

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
    async function similarCats(name) {
        setLoading(true);
        if (name !== "") {
            try {
                let data = { name }

                let exists = await Axios.post(`/api/public/same/${locationID}/`, data);
                if (exists.data.found) {
                    setSameName(exists.data.similarCats)
                    setLoading(false);
                    return;
                } else {
                    setSameName([])
                    setLoading(false);
                    return;
                }
            } catch (e) {
                setLoading(false);
                return;
            }
        }
        setLoading(false);
    }
    async function addCat(values) {

        let catData = {
            ...values,
            userID: user.user._id,
            location: locationID,
        };
        try {
            setAdding({
                ...adding,
                adding: true,
            })
            //include image
            if (imageFile.file) {
                const formData = new FormData();
                formData.append('file', imageFile.file);
                formData.append('upload_preset', 'catmeownity_cat');

                const cloudinary = 'https://api.cloudinary.com/v1_1/ryhuz/image/upload';
                const instance = Axios.create();
                instance.defaults.headers.common = {};

                let img = await instance.post(cloudinary, formData);
                let imageURL = img.data.secure_url;

                catData.image = imageURL;
            }
            let resp = await Axios.post("/api/auth/cats/add", catData);
            setAdding({
                adding: false,
                added: true,
                id: resp.data.cat._id,
            })
        } catch (e) {
            console.log(e.response)
            setNewCatError(true);
        }
    }
    return (
        <>
            <Formik
                initialValues={{
                    name: "", breed: "", colour: "", gender: "",
                    sterilised: "", catDescription: "", imgDesc: "",
                }}
                onSubmit={async values => {
                    addCat(values)
                }}
                validationSchema={Yup.object().shape({
                    name: Yup.string()
                        .required("Please give the cat a name")
                        .min(2, "Maybe a longer name"),
                    breed: Yup.string()
                        .required("Please enter the cat's breed")
                        .min(4, "Maybe a longer name"),
                    colour: Yup.string()
                        .required("Please enter the cat's colour")
                        .min(3, "Maybe a longer name"),
                    catDescription: Yup.string()
                        .required("Please give the cat a description")
                        .min(5, "Maybe a longer description"),
                    gender: Yup.string()
                        .required("Please choose the cat's gender"),
                    sterilised: Yup.string()
                        .required("Please tell us if the cat is sterilised"),
                })}
            >
                {props => {
                    const {
                        values,
                        touched,
                        errors,
                        isSubmitting,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                    } = props;
                    return (
                        <>
                            <Form onSubmit={handleSubmit}>
                                <Form.Label>
                                    <h5>Cat details</h5>
                                </Form.Label>
                                <Form.Row>
                                    <Col>
                                        <Form.Group className={`${errors.name && touched.name ? 'mb-1' : 'mb-3'}`}>
                                            <Form.Control type="text" name="name" placeholder="Cat's name"
                                                onChange={handleChange} onBlur={e => {
                                                    similarCats(values.name);
                                                    handleBlur(e);
                                                }} className={errors.name && touched.name ? "text-input error" : "text-input"}
                                            />
                                            {errors.name && touched.name && (
                                                <div className="input-feedback text-danger">{errors.name}</div>
                                            )}
                                        </Form.Group>
                                        <Form.Group className={`${errors.breed && touched.breed ? 'mb-1' : 'mb-3'}`}>
                                            <Form.Control type="text" name="breed" placeholder="Cat's breed (e.g. Singapura, British Shorthair)"
                                                onChange={handleChange} onBlur={handleBlur}
                                                className={errors.breed && touched.breed ? "text-input error" : "text-input"} />
                                            {errors.breed && touched.breed && (
                                                <div className="input-feedback text-danger">{errors.breed}</div>
                                            )}
                                        </Form.Group>
                                        <Form.Group className={`${errors.colour && touched.colour ? 'mb-1' : 'mb-3'}`}>
                                            <Form.Control type="text" name="colour" placeholder="Cat's colour (e.g Calico, Brown Striped; comma separated)"
                                                onChange={handleChange} onBlur={handleBlur}
                                                className={errors.breed && touched.breed ? "text-input error" : "text-input"} />
                                            {errors.colour && touched.colour && (
                                                <div className="input-feedback text-danger">{errors.colour}</div>
                                            )}
                                        </Form.Group>
                                        <Form.Group className={`${errors.gender && touched.gender ? 'mb-1' : 'mb-3'}`}>
                                            <Form.Control as="select" name="gender" defaultValue={"Cat's gender"}
                                                onChange={handleChange} onBlur={handleBlur}
                                                className={errors.gender && touched.gender ? "text-input error" : "text-input"}>
                                                <option disabled>Cat's gender</option>
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Not Sure</option>
                                            </Form.Control>
                                            {errors.gender && touched.gender && (
                                                <div className="input-feedback text-danger">{errors.gender}</div>
                                            )}
                                        </Form.Group>
                                        <Form.Group className={`${errors.sterilised && touched.sterilised ? 'mb-1' : 'mb-3'}`}>
                                            <Form.Control as="select" name="sterilised" defaultValue="Is it sterilised?"
                                                onChange={handleChange} onBlur={handleBlur}
                                                className={errors.sterilised && touched.sterilised ? "text-input error" : "text-input"}>
                                                <option disabled>Is it sterilised?</option>
                                                <option>Yes</option>
                                                <option>No</option>
                                                <option>Not Sure</option>
                                            </Form.Control>
                                            {errors.sterilised && touched.sterilised && (
                                                <div className="input-feedback text-danger">{errors.sterilised}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <SimilarCat loading={loading} similar={sameName} />
                                    </Col>
                                </Form.Row>
                                <hr />
                                <Form.Row>
                                    <Col>
                                        <Form.Label>
                                            <h5>Give a description of the cat</h5>
                                            <small>A short sentence telling us about it's personality!</small>
                                        </Form.Label>
                                        <Form.Group className={`${errors.catDescription && touched.catDescription ? 'mb-1' : 'mb-3'}`}>
                                            <Form.Control as="textarea" name="catDescription" placeholder="This cat is cute and friendly"
                                                onChange={handleChange} onBlur={handleBlur}
                                                className={errors.catDescription && touched.catDescription ? "text-input error" : "text-input"} />
                                            {errors.catDescription && touched.catDescription && (
                                                <div className="input-feedback text-danger">{errors.catDescription}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Label>
                                            <h5>Add a cat picture</h5>
                                            <small>optional</small>
                                        </Form.Label>
                                        {imageFile.file &&
                                            <>
                                                <div className="text-center profile-image-upload my-4">
                                                    <Image src={imageFile.url} />
                                                </div>
                                                <Form.Group className={`${values.imgDesc === "" && touched.imgDesc ? 'mb-1' : 'mb-3'}`}>
                                                    <Form.Control type="text" name="imgDesc" placeholder="A short description about this picture"
                                                        onChange={handleChange} onBlur={handleBlur}
                                                        className={values.imgDesc === "" && touched.imgDesc ? "text-input error" : "text-input"} />
                                                    {imageFile.file && values.imgDesc === "" && touched.imgDesc && (
                                                        <div className="input-feedback text-danger">Please enter a description of the picture</div>
                                                    )}
                                                </Form.Group>
                                            </>
                                        }
                                        <InputGroup className="border p-2 justify-content-between">
                                            <FormFile className="" type="file" name="image" onChange={imageSelect} />
                                            <InputGroup.Append>
                                                {imageFile.file &&
                                                    <span className="btn pr-3 pt-1 text-danger" onClick={remove}>Remove upload</span>
                                                }
                                            </InputGroup.Append>
                                        </InputGroup>

                                    </Col>
                                </Form.Row>
                                <hr />
                                {adding.adding &&
                                    <Row className="justify-content-center">
                                        <Col sm={2}>
                                            <Loading />
                                        </Col>
                                    </Row>
                                }
                                <Form.Row>
                                    <Button block variant="success" onClick={handleSubmit} disabled={isSubmitting || (imageFile.file && values.imgDesc === "")}>Add this cat</Button>
                                </Form.Row>
                            </Form>
                        </>
                    );
                }}
            </Formik>
        </>
    )
}

export default RegisterCatForm
