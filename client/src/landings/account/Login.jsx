import Axios from 'axios';
import React, { useState } from 'react';
import { Button, Card, Col, Container, Jumbotron, Row, Form, FormControl, InputGroup } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { Formik } from "formik";
import * as Yup from "yup";

const Login = ({ setValid }) => {
  const [home, setHome] = useState(false);
  const [err, setErr] = useState({ msg: '' });
  const [location, setLocation] = useState(null);
  if (home && location) {
    return <Redirect to={`${location}`} />
  } else if (home) {
    return <Redirect to="/dashboard" />
  }

  async function login(values) {
    try {
      //register user
      let resp = await Axios.post("/api/user/login", values);
      //store token in local storage
      localStorage.setItem('token', resp.data.token);
      setErr({})
      setValid({
        valid: true,
        refreshed: false,
      });
      setHome(true);
      let temp = localStorage.getItem('location')
      if (temp) {
        localStorage.removeItem('location');
        setLocation(temp)
      }
    } catch (error) {
      console.log(error.response)
      setErr(error.response.data)
    }
  }

  function loginForm() {
    return (
      <>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={async values => {
            login(values)
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email('Please enter a valid email')
              .required("Please enter your email"),
            password: Yup.string()
              .required("Please enter your password")
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
                <InputGroup className={`${errors.email && touched.email ? 'mb-1' : 'mb-3'}`}>
                  <FormControl id="email" placeholder="Enter your email" name="email" type="text"
                    value={values.email} onChange={handleChange} onBlur={handleBlur} onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleSubmit();
                      }
                    }} className={errors.email && touched.email ? "text-input error" : "text-input"}
                  />
                </InputGroup>
                {errors.email && touched.email && (
                  <div className="input-feedback text-danger">{errors.email}</div>
                )}
                <InputGroup className={`${errors.password && touched.password ? 'mb-1' : 'mb-3'}`}>
                  <FormControl id="password" placeholder="Enter your password" name="password" type="password"
                    value={values.password} onChange={handleChange} onBlur={handleBlur} onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleSubmit();
                      }
                    }} className={errors.password && touched.password ? "text-input error" : "text-input"}
                  />
                </InputGroup>
                {errors.password && touched.password && (
                  <div className="input-feedback text-danger">{errors.password}</div>
                )}
                {err.msg !== "" && (
                  <div className="text-danger">{err.msg}</div>
                )}
                <Button block variant="dark" onClick={handleSubmit} disabled={isSubmitting}>
                  Submit
            </Button>
              </Form>
            );
          }}
        </Formik>
      </>
    )
  }

  return (
    <>
      <Jumbotron className='jumboacc'>
        <div className="ml-5 pl-5 jumboheader">
          <h1>Login</h1>
        </div>
      </Jumbotron>
      <Container>
        <Card className="p-3 mx-auto mt-5">
          <Card.Body>
            <Row className="justify-content-center">
              <Col sm={8}>
                <div className="h3 mb-3">Enter your user details</div>
                {loginForm()}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default Login;/* 
 */