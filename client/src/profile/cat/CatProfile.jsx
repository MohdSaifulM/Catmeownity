import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Accordion, Card, Button, Jumbotron, Modal, ListGroup, InputGroup, Form, Tab, Tabs, Popover, OverlayTrigger, Image } from 'react-bootstrap'
import Axios from 'axios'
import { useParams, useLocation, NavLink } from 'react-router-dom';
import CatBio from './CatBio';
import { decode } from "jsonwebtoken";
import NotLoggedIn from '../../private/NotLoggedIn';
import CatComments from './CatComments';
import pic from '../../resources/nocatpic.png'
import CatPhotoUpload from './CatPhotoUpload';
import CatPhotos from './CatPhotos';

function CatProfile() {
    let token = localStorage.getItem('token')
    let user = decode(token);
    Axios.defaults.headers.common['x-auth-token'] = token;
    let { id } = useParams()
    const [cat, setCat] = useState({
        cat: null,
        defaultPhoto: null,
        found: false,
    });
    const [favourites, setFavourites] = useState([]);
    const [needToLogIn, setNeedToLogIn] = useState(false);
    const [catDescription, setCatDescription] = useState({})
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [eventKey, setEventKey] = useState(false);
    const [feedingDescription, setFeedingDescription] = useState();
    const location = useLocation();
    const moment = require('moment');

    /* get curr user list of favourites */
    useEffect(() => {
        async function fetchFavourites() {
            try {
                let resp = await Axios.get(`/api/auth/user/get-favourites/${user.user._id}`);
                setFavourites(resp.data.favourites);
            } catch (e) {
                // setError(e.response.data.message);
                console.log(e.response)
            }
        }
        fetchFavourites()
    }, [])
    /* get cat data */
    useEffect(() => {
        fetchCat()
    }, [id])
    async function fetchCat() {
        try {
            let resp = await Axios.get(`/api/public/cat/${id}`);
            let tempPhoto;
            if (resp.data.cat.photos.length > 0) {
                tempPhoto = resp.data.cat.photos.find(photo => photo.isDefault)
            }
            setCat({ cat: resp.data.cat, defaultPhoto: tempPhoto, found: true });
            /* REDIRECT TO ERROR PAGE IF CAT NOT FOUND */
        } catch (e) {
            // setError(e.response.data.message);
            console.log(e.response)
        }
    }
    function displayEatingTimes() {
        if (cat.cat.fed.length > 0) {
            return (
                <>
                    {cat.cat.fed.slice(0, 3).map((el, index) => (
                        <li key={index}>
                            {`Fed ${el.foodDescription} ${moment(el.createdAt).fromNow()} by `}
                            <NavLink className="text-muted text-decoration-none" to={`/profile/${el.byUser._id}`}>{el.byUser && el.byUser.name}</NavLink>
                        </li>
                    ))}
                </>
            )
        } else {
            return (
                <>
                    <span>Not Sure</span>
                </>
            )
        }
    }
    function followed() {
        return favourites.includes(id);
    }
    function missing() {
        if (cat.cat.missing) {
            return (
                <Container className="bg-danger mt-3">
                    <Row>
                        <Col sm={5}>
                            <h5 className="mt-4 text-right">Missing Cat
                            </h5>
                        </Col>
                        <Col>
                            <h6 className="p-3">This cat hasn't been seen in a while.<br />Please contact us if you know of its whereabouts
                            </h6>
                        </Col>
                    </Row>
                </Container>
            );
        }
    }
    async function followUnfollow() {
        if (!user) {
            setNeedToLogIn(true);
            return;
        }
        if (favourites.includes(id)) {
            await Axios.put(`/api/auth/user/${user.user._id}/unfavourite/${id}`);
            let temp = [...favourites];
            temp.splice(temp.indexOf(id), 1);
            setFavourites(temp);
        } else {
            try {
                await Axios.put(`/api/auth/user/${user.user._id}/favourite/${id}`);
                setFavourites([...favourites, id])
            } catch (e) {
                console.log(e.response)
            }
        }
    }
    async function postCatDescription() {
        if (!user) {
            setNeedToLogIn(true);
            return;
        }
        try {
            await Axios.post(`/api/auth/comment/${id}/desc/${user.user._id}`, catDescription)
            document.querySelector('#catDescriptionInput').value = ""
            fetchCat();
        } catch (error) {
            console.log(error)
        }
    }
    function handleCatDescription(e) {
        setCatDescription({ ...catDescription, [e.target.name]: e.target.value });
    }
    function handleFeeding(e) {
        setFeedingDescription({ ...feedingDescription, [e.target.name]: e.target.value });
    }
    async function feedKitty() {
        if (!user) {
            setNeedToLogIn(true);
            return;
        }
        try {
            await Axios.post(`/api/auth/cats/${user.user._id}/feed/${id}`, feedingDescription)
            fetchCat();
            document.querySelector('#overlaybtn').click()
        } catch (error) {
            console.log(error)
        }
    }
    function addPhoto() {
        fetchCat();
    }

    (async () => {
        if (eventKey) {
            return "0"
        } else {
            return "1"
        }
    })(eventKey);
    function checkLoginForUpload() {
        if (user) {
            setUploadingPhoto(true)
        } else {
            setNeedToLogIn(true);
        }
    }
    const popover = (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Log the feeding</Popover.Title>
            <Popover.Content>
                <InputGroup className="my-3">
                    <Form.Control type="text" placeholder="Food Description" name="foodDescription" aria-describedby="basic-addon2" onChange={handleFeeding}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                feedKitty();
                            }
                        }} />
                    <InputGroup.Append>
                        <Button variant="outline-secondary" onClick={feedKitty}>Add</Button>
                    </InputGroup.Append>
                </InputGroup>
            </Popover.Content>
        </Popover>
    );

    return (
        <>{cat.found &&
            <>
                <Modal show={needToLogIn} onHide={() => (setNeedToLogIn(false))}>
                    <NotLoggedIn setNeedToLogIn={setNeedToLogIn} location={location.pathname} />
                </Modal>
                <Modal show={uploadingPhoto} onHide={() => (setUploadingPhoto(false))} size="lg">
                    <CatPhotoUpload setUploadingPhoto={setUploadingPhoto} defaultPhoto={cat.defaultPhoto} addPhoto={addPhoto} id={id} user={user} />
                </Modal>
                <Jumbotron className="jumbocat">
                    <Container>
                        <Row id="cat-holder">
                            {/* Cat main picture and follow button */}
                            <Col>
                                <Image thumbnail src={cat.defaultPhoto ? cat.defaultPhoto.image : pic} className="rounded thumbnail img-responsive mx-auto d-block " width="70%" />
                                {!cat.defaultPhoto &&
                                    <Row xs={1}>
                                        <Col className='text-center py-2'>
                                            {cat.cat.names[0]} doesn't have a picture yet.
                                        </Col>
                                        <Col className='text-center'>
                                            <div className='btn btn-success' onClick={checkLoginForUpload}>
                                                Add their first photo!
                                            </div>
                                        </Col>
                                    </Row>}
                                <div className="text-center h4 mt-3">
                                    {followed() ?
                                        <>
                                            <Button id="btn-unfollowing-cat" variant="outline-danger" onClick={followUnfollow}>
                                                <i className="fas fa-heart mx-2"></i> Following this cat
                                            </Button>
                                        </> :
                                        <>
                                            <Button id="btn-follow-cat" variant="secondary" onClick={followUnfollow}>
                                                <i className="fas fa-cat mx-2"></i> Follow this cat
                                            </Button>
                                        </>
                                    }
                                </div>
                            </Col>
                            {/* Cat profile */}
                            <CatBio cat={cat} setCat={setCat} user={user} fetchCat={fetchCat} />
                        </Row>
                    </Container>
                    {missing()}
                </Jumbotron>
                {/* Tabs nav */}
                <Container>
                    <Tabs defaultActiveKey="comment" id="uncontrolled-tab-example">
                        {/* Comments Tab */}
                        <Tab eventKey="comment" title="Comments">
                            <Accordion defaultActiveKey="0" className="scroll">
                                <Card>
                                    <Card.Header>
                                        {eventKey === false && <div>
                                            {cat.cat.desc.slice(0, 3).map((el) => (
                                                <CatComments desc={el} key={el._id} fetchCat={fetchCat} />
                                            ))}
                                        </div>}
                                        {/* Check if cat description is more than 3 to display show all comments button */}
                                        {(cat.cat.desc.length) > 3 && <Accordion.Toggle className="text-muted" as={Button} variant="link" eventKey="1" onClick={() => setEventKey(!eventKey)}>
                                            {eventKey ? 'close' : 'show all comments...'}
                                        </Accordion.Toggle>}
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body>
                                            <ListGroup>
                                                {cat.cat.desc.map((el) => (
                                                    <CatComments desc={el} key={el._id} fetchCat={fetchCat} />
                                                ))}
                                            </ListGroup>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                    <Card.Body>
                                        <InputGroup>
                                            <Form.Control type="text" placeholder="Enter your comment" name="catDescription" aria-describedby="basic-addon2" onChange={handleCatDescription}
                                                id="catDescriptionInput" onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        postCatDescription();
                                                    }
                                                }} />
                                            <InputGroup.Append>
                                                <Button variant="outline-secondary" onClick={postCatDescription}>
                                                    Add
                                                </Button>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </Card.Body>
                                </Card>
                            </Accordion>
                        </Tab>
                        {/* Photo Tab */}
                        <Tab eventKey="photos" title="Photo">
                            <Accordion defaultActiveKey="0">
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle className="text-muted" as={Button} variant="link" eventKey="0">
                                            More photos
                                    </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body className="mx-auto">
                                            <Row md={4} sm={2} className="mx-5">
                                                {user &&
                                                    <Col>
                                                        <Card onClick={() => setUploadingPhoto(true)}>
                                                            <Image thumbnail rounded src={pic} className="to-link" width="100%" />
                                                            <Card.Body className="my-2 py-4">
                                                                <div className="to-link">
                                                                    <i className="fas fa-plus"></i> Add a new photo
                                                            </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>}
                                                <CatPhotos cat={cat} user={user} fetchCat={fetchCat}/>
                                            </Row>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Tab>
                        {/* Feeding Tab */}
                        <Tab eventKey="feeding" title="Feeding">
                            <Col className="border">
                                <Table borderless size="lg">
                                    <tbody>
                                        <tr>
                                            <td>Last fed:</td>
                                            <td className="align-middle">{displayEatingTimes()}</td>
                                        </tr>
                                        <tr>
                                            <td>Residing:</td>
                                            <td>{`${cat.cat.location.district.name}, ${cat.cat.location.street}`}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                                                    <Button variant="outline-secondary" id="overlaybtn">Fed this kitty?</Button>
                                                </OverlayTrigger>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Tab>
                    </Tabs>
                </Container>
            </>
        }
        </>
    )
}

export default CatProfile
