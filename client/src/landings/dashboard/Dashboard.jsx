import React, { useState, useEffect } from 'react'
import { Card, CardGroup, Col, Form, Image, Jumbotron, Modal, Row } from 'react-bootstrap';
import { decode } from "jsonwebtoken";
import Axios from 'axios'
import { NavLink } from 'react-router-dom';
import ConfirmUnfollow from './ConfirmUnfollow';
import pic from '../../resources/nocatpic.png'
import noProfilePic from '../../resources/no-profile-pic.png'
import ConfirmUntrack from './ConfirmUntrack';

const Dashboard = () => {
  let token = localStorage.getItem('token')
  let user = decode(token);
  Axios.defaults.headers.common['x-auth-token'] = token;

  const [confirmUnfollow, setConfirmUnfollow] = useState(false);
  const [confirmUntrack, setConfirmUntrack] = useState(false);
  const [unParams, setUnParams] = useState({
    name: "",
    gender: "",
    ID: "",
  });

  const [profile, setProfile] = useState({
    profile: {},
    found: false
  });
  /* getting user data */
  useEffect(() => {
    async function fetchProfile() {
      try {
        let resp = await Axios.get(`/api/auth/user/${user.user._id}`);
        setProfile({
          profile: resp.data.user,
          found: true
        });
      } catch (e) {
        console.log(e.response)
      }
    }
    fetchProfile()
  }, [])

  function toConfirmUnfollow(name, gender, ID) {
    setUnParams({
      name,
      gender,
      ID
    })
    setConfirmUnfollow(true)
  }
  function toConfirmUntrack(name, ID) {
    setUnParams({
      name,
      ID
    })
    setConfirmUntrack(true)
  }
  function showFavouriteCats() {
    if (profile.profile.favourites.length > 0) {
      return (
        <>
          {profile.profile.favourites.map(cat => (
            <Col key={cat._id}>
              <Card>
                <NavLink className="text-muted text-decoration-none" to={`/cat/${cat._id}`}>
                  <Image src={showCatPhoto(cat)} width="100%" className="img-thumbnail" />
                </NavLink>
                <Card.Header className='h5'>
                  <NavLink className="text-muted text-decoration-none" to={`/cat/${cat._id}`}>{cat.names[0]}</NavLink>
                </Card.Header>
                <Card.Body>
                  <div>{cat.location.street}</div>
                  <div>
                    <div id="btn-unfollow" className="btn"  onClick={() => toConfirmUnfollow(cat.names[0], cat.gender, cat._id)}>
                      <i className="fas fa-cat mx-2"></i>Unfollow this cat
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </>
      )
    } else {
      return (
        <Col>
          <Card>
            <Card.Title>
              You haven't followed any cats :(
            </Card.Title>
            <Card.Body>
              Search for one now!
            </Card.Body>
          </Card>
        </Col>
      )
    }
  }
  function showTrackedLocations() {
    if (profile.profile.trackedLocations.length > 0) {
      let tracked = profile.profile.trackedLocations;
      let districts = [];
      tracked.forEach(location => {
        districts.push(location.district.name)
      });
      districts = Array.from(new Set(districts)).sort();
      let allTracked = tracked.sort(function (a, b) {
        var nameA = a.street;
        var nameB = b.street;
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
      })
      return (
        <>
          {districts.map(district => (
            <div key={district}>
              <h6>{district}</h6>
              <hr />
              <Row className="mb-4">
                {allTracked.map(place => (
                  <div key={place._id}>
                    {place.district.name === district &&
                      <>
                        <Col>
                          <div className="d-flex">
                            <NavLink id="btn-follow-tracked" to={`/location/${place._id}`} className='btn'>
                              {place.street}
                            </NavLink>
                            <div id="btn-unfollow-tracked" className='btn d-flex align-items-center' onClick={() => toConfirmUntrack(place.street, place._id)}>
                              <span aria-hidden="true">&times;</span>
                            </div>
                          </div>
                        </Col>
                      </>
                    }
                  </div>
                ))}
              </Row>
            </div>
          ))
          }
        </>
      )
    } else {
      return (
        /*         <Col>
                  <Card>
                    <Card.Title>
                      You haven't followed any cats :(
                    </Card.Title>
                    <Card.Body>
                      Search for one now!
                    </Card.Body>
                  </Card>
                </Col> */
        <>
        </>
      )
    }
  }
  async function unfollow(id) {
    await Axios.put(`/api/auth/user/${user.user._id}/unfavourite/${id}`, {
      headers: {
        "x-auth-token": token,
      },
    });

    setConfirmUnfollow(false);
    let temp = profile.profile.favourites;
    temp.splice(temp.findIndex(x => x._id == id), 1);
    console.log('after', temp)

    setProfile({ ...profile, favourites: temp });
  }

  async function untrack(id) {
    await Axios.put(`/api/auth/user/${user.user._id}/untrack/${id}`, {
      headers: {
        "x-auth-token": token,
      },
    });

    setConfirmUntrack(false);

    let temp = profile.profile.trackedLocations;
    temp.splice(temp.findIndex(x => x._id === id), 1);
    console.log(temp)
    setProfile({ ...profile, trackedLocations: temp });
  }

  function showCatPhoto(cat) {
    if (cat.photos.length > 0) {
      let temp = cat.photos.find(x => x.isDefault)
      return temp.image;
    } else {
      return pic;
    }
  }
  return (
    <div>
      <Modal show={confirmUnfollow} onHide={() => (setConfirmUnfollow(false))}>
        <ConfirmUnfollow setConfirmUnfollow={setConfirmUnfollow} name={unParams.name} gender={unParams.gender} unfollow={() => unfollow(unParams.ID)} />
      </Modal>
      <Modal show={confirmUntrack} onHide={() => (setConfirmUntrack(false))}>
        <ConfirmUntrack setConfirmUntrack={setConfirmUntrack} location={unParams.name} untrack={() => untrack(unParams.ID)} />
      </Modal>
      {profile.found &&
        <>
          {/* Header */}
          <Jumbotron className='jumboboard'>
            <h2 className="mb-auto jumbotitledown text-white">Welcome back, {profile.profile.name}!</h2>
            <cite id="cited" className="text-white">“I'm not sure why I like cats so much...</cite>
            <Row id="dash-preview" className="justify-content-center">
              <Col sm={1}>
                <Image id="dash-image" src={profile.profile.image ? profile.profile.image : noProfilePic} width="100%" />
              </Col>
              <Col sm={2}>
                <NavLink to={`/profile/${profile.profile._id}`} id="btnprofile" className='btn btn-block btn-success'>
                  View Your profile
              </NavLink>
              </Col>
            </Row>
          </Jumbotron>
          {/* Profile Preview */}

          <div className="fav-track-dash">
            {/* Favourite Cats */}
            <CardGroup className="mx-5 py-4">
              <Card className="mb-3 mx-5">
                <Card.Body>
                  <Card.Title>Your favourite cats</Card.Title>
                  <Row sm={1} md={1} lg={3}>
                    {showFavouriteCats()}
                  </Row>
                </Card.Body>
              </Card>
              {/* Tracked locations */}
              <Card className="mb-3 mx-5">
                <Card.Body>
                  <Card.Title>Your tracked locations</Card.Title>
                  <div>
                    {showTrackedLocations()}
                  </div>
                </Card.Body>
              </Card>
            </CardGroup>
          </div>
          <Card className="bg-light text-white p-3 mx-auto">
            <Card.Body>
              <Form className="text-center">
                <Form.Label>
                  <Card.Title className="text-center h-5"></Card.Title>
                </Form.Label>
              </Form>
            </Card.Body>
          </Card>
        </>
      }
    </div>
  )
}

export default Dashboard

