import React, { useState } from 'react'
import { Button, Card, Col, Form, Image, Row } from 'react-bootstrap'
import Axios from 'axios'
import load from '../../resources/loading.gif'
import { Formik } from "formik";
import * as Yup from "yup";

function Register({ nextSection, setFormData}) {
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState("");

  async function checkSimilarEmail(email) {
    setLoading(true);
    if (email !== "") {
      try {
        let exists = await Axios.get(`/api/user/check/${email}`);
        if (exists.data.found) {
          setEmailExists("This email is already registered");
        } else {
          setEmailExists("");
        }
      } catch (e) {

      }
    } else {
      setEmailExists("");
    }
    setLoading(false);
  }

  function registrationFormik() {
    return (
      <Formik
        initialValues={{ email: "", password: "", name: "" }}
        onSubmit={(values) => {
          nextSection();
          setFormData(values);
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email('Please enter a valid email')
            .required("Please enter your email"),
          password: Yup.string()
            .required("Please enter your password")
            .min(6, 'Your password needs to be at least 6 characters long'),
          name: Yup.string()
            .required("Please enter your name")
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
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                {loading && <div className="text-center"><Image src={load} width="10%" /></div>}
                <Form.Control type="text" name="email" placeholder="Email (you will use this to log in)" value={values.email}
                  onChange={e => { handleChange(e); setEmailExists(""); }} onBlur={e => {
                    handleBlur(e);
                    checkSimilarEmail(values.email)
                  }} onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSubmit(values);
                    }
                  }} />
                {emailExists !== "" &&
                  <Form.Text>
                    <div className="text-danger">{emailExists}</div>
                  </Form.Text>
                }
                {errors.email && touched.email && (
                  <Form.Text>
                    <div className="input-feedback text-danger">{errors.email}</div>
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Control type="password" name="password" placeholder="Password" value={values.password}
                  onChange={handleChange} onBlur={handleBlur} onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSubmit(values);
                    }
                  }} />
                {errors.password && touched.password && (
                  <Form.Text>
                    <div className="text-danger">{errors.password}</div>
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group controlId="formBasicName">
                <Form.Control type="text" name="name" placeholder="Name" value={values.name}
                  onChange={handleChange} onBlur={handleBlur} onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSubmit(values);
                    }
                  }} />
                {errors.name && touched.name && (
                  <Form.Text>
                    <div className="input-feedback text-danger">{errors.name}</div>
                  </Form.Text>
                )}
              </Form.Group>
              <Row className="justify-content-center">
                <Col>
                  <Button variant="dark" block onClick={handleSubmit} disabled={loading || isSubmitting || emailExists}>
                    Next Step
                </Button>
                  <Row className='justify-content-end mt-3'>
                    <Col />
                    <Col sm='auto'>
                      Have an account?
                    </Col>
                  </Row>
                  <Row bottom="xs">
                    <Col />
                    <Col sm='auto'>
                      <a href="/login">Log in here</a>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          );
        }}
      </Formik>
    )
  }


  return (
    <Card className="p-3 mx-auto mt-5">
      <Card.Body>
          <Form.Label>
            <h5>You're on your way to a wonderful world of cats!</h5>
          </Form.Label>
          <hr />
          <Row className="justify-content-center">
            <Col sm={8}>
              {registrationFormik()}


            </Col>
          </Row>
      </Card.Body>
    </Card>
  )
}

export default Register
