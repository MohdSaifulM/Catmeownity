import React, { useState, useEffect, useRef } from 'react'
import { Col, Button, Form, InputGroup } from 'react-bootstrap'
import Axios from 'axios'
import { useParams } from 'react-router-dom';


function CatBio({ cat, setCat, user, fetchCat }) {

    let token = localStorage.getItem('token');
    let { id } = useParams();
    Axios.defaults.headers.common['x-auth-token'] = token;

    useEffect(() => {
        setCat(cat)
    }, [])

    const [showEditCat, setShowEditCat] = useState(false);
    const [form, setForm] = useState({
        names: cat.cat.names,
        breed: cat.cat.breed,
        gender: cat.cat.gender,
        colour: cat.cat.colour,
    });
    const [addName, setAddName] = useState("")
    const [addColour, setAddColour] = useState("")
    const node = useRef()

    function changeHandler(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (e.target.name === "names") {
            if (e.target.value !== "") {
                setAddName(e.target.value)
            }
        } else if (e.target.name === "colours") {
            if (e.target.value !== "") {
                setAddColour(e.target.value)
            }
        }
    }

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClick);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const handleClick = e => {
        if (node.current.contains(e.target)) {
            // inside click
            return;
        }
        // outside click 
        setShowEditCat(false)
    };

    async function editCat() {
        try {
            if (cat.cat.names.length > 1) {
                cat.cat.names.shift();
                cat.cat.names.unshift(addName);
                await Axios.put(`/api/auth/cats/${id}`, {
                    names: cat.cat.names,
                    gender: form.gender,
                    breed: form.breed,
                    colour: form.colour,
                });
            } else if (cat.cat.colours.length > 1) {
                cat.cat.colours.shift();
                cat.cat.colours.unshift(addColour);
                await Axios.put(`/api/auth/cats/${id}`, {
                    names: cat.cat.names,
                    gender: form.gender,
                    breed: form.breed,
                    colour: cat.cat.colours,
                });
            } else {
                await Axios.put(`/api/auth/cats/${id}`, form);
            }
            setShowEditCat(false)
            fetchCat();
        } catch (e) {
            console.log(e.response)
        }
    }

    function displayOtherNames() {
        let other = cat.cat.names.slice(1);
        return (
            <>
                {other.map((name, index) => (
                    <span key={index} className="font-italic h5 badge badge-pill badge-secondary">
                        {name}
                        {user && showEditCat && <button type="button" className="close" aria-label="Close" onClick={() => {
                            (async () => {
                                let delName = cat.cat.names[index + 1];
                                await Axios.put(`/api/auth/cats/delname/${id}`, {
                                    names: delName
                                });
                                setShowEditCat(true)
                                fetchCat();
                            })();
                        }}>
                            <span aria-hidden="true">&times;</span>
                        </button>}
                    </span>
                ))
                }
            </>
        )
    }

    function displayColours() {
        let colour = cat.cat.colours;
        return (
            <>
                {colour.map((colour, index) => (
                    <span key={index} className="font-italic h5 badge badge-pill badge-secondary">
                        {colour}
                        {user && showEditCat && <button type="button" className="close" aria-label="Close" onClick={() => {
                            (async () => {
                                let delcolour = cat.cat.colours[index];
                                await Axios.put(`/api/auth/cats/delcolour/${id}`, {
                                    colours: delcolour
                                });
                                setShowEditCat(true)
                                fetchCat();
                            })();
                        }}>
                            <span aria-hidden="true">&times;</span>
                        </button>}
                    </span>
                ))
                }
            </>
        )
    }

    async function addButtonName() {
        try {
            await Axios.put(`/api/auth/cats/name/${id}`, {
                names: addName
            });
            document.querySelector('#addNameInput').value = ""
            fetchCat();
            setShowEditCat(true)
        } catch (e) {
            console.log(e.response)
        }
    }

    async function addButtonColour() {
        try {
            await Axios.put(`/api/auth/cats/colour/${id}`, {
                colours: addColour
            });
            fetchCat();
            setShowEditCat(true)
        } catch (e) {
            console.log(e.response)
        }
    }

    async function missing() {
        try {
            await Axios.put(`/api/auth/cats/${id}/missing`);
            fetchCat();
        } catch (error) {
            console.log(error)
        }

    }

    async function found() {
        try {
            await Axios.put(`/api/auth/cats/${id}/found`);
            fetchCat();
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <Col ref={node}>
            {/* Check if edit button is pressed then show edit form and update button */}
            {showEditCat ?
                <div >
                    <InputGroup  >
                        <Form.Control type="text" placeholder={`Not everyone calls this kitty ${cat.cat.names[0]}`} defaultValue={cat.cat.names[0]} onChange={changeHandler} name="names" aria-describedby="basic-addon2" id="addNameInput" />
                        <InputGroup.Append>
                            <Button variant="outline-secondary" onClick={addButtonName}>Add</Button>
                        </InputGroup.Append>
                    </InputGroup>
                    {cat.cat.names.length > 1 &&
                        <div>
                            <small className="text-light">Also known as:</small>
                            <div>
                                {displayOtherNames()}
                            </div>
                        </div>
                    }
                    <div>
                        <small className="text-light">Gender:</small>
                        <div className="h5">
                            <Form.Control as="select" type="select" onChange={changeHandler} defaultValue={cat.cat.gender} name="gender">
                                <option value="">Select One</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Not Sure">Not Sure</option>
                            </Form.Control>
                        </div>
                    </div>
                    <div>
                        <small className="text-light">Breed:</small>
                        <div className="h5">
                            <Form.Control type="text" placeholder="Enter breed of cat" onChange={changeHandler} defaultValue={cat.cat.breed} name="breed" />
                        </div>
                    </div>
                    <div>
                        <small className="text-light">Colour:</small>
                        <div className="h5">
                            <InputGroup  >
                                <Form.Control type="text" placeholder="Enter colour of cat" onChange={changeHandler} defaultValue={cat.cat.colour} name="colours" aria-describedby="basic-addon2" />
                                <InputGroup.Append>
                                    <Button variant="outline-secondary" onClick={addButtonColour}>Add</Button>
                                </InputGroup.Append>
                            </InputGroup>
                            {displayColours()}
                        </div>
                    </div>
                    <div className="d-flex justify-content-between">
                        <Button variant="outline-secondary" onClick={editCat}>Update</Button>
                    </div>
                </div> :
                <div className="text-light">
                    <h1 className="my-2">{cat.cat.names[0]}</h1>
                    {cat.cat.names.length > 1 &&
                        <div>
                            <small>Also known as:</small>
                            <div>
                                {displayOtherNames()}
                            </div>
                        </div>
                    }
                    <div>
                        <small>Gender:</small>
                        <div className="h5">
                            {cat.cat.gender}
                        </div>
                    </div>
                    <div>
                        <small>Breed:</small>
                        <div className="h5">
                            {cat.cat.breed}
                        </div>
                    </div>
                    <div>
                        <small>Colour:</small>
                        <div className="h5">
                            {displayColours()}
                        </div>
                    </div>
                    {/* Check if user is logged in then display edit button and if cat missing display missing button */}
                    {user ? <div><Button id="btn-edit-cat" variant="secondary" onClick={() => setShowEditCat(true)}>Edit</Button>{!cat.cat.missing ? <Button id="btn-cat-missing" className="mx-2" variant="outline-danger" onClick={missing}>Haven't seen this kitty lately?</Button> : <Button className="mx-2" variant="outline-success" onClick={found}>Saw this kitty somewhere?</Button>}</div> : <div></div>}
                </div>}
        </Col>
    )
}

export default CatBio
