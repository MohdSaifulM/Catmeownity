import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { Col, Container, Row } from 'react-bootstrap'
import LocationResult from './LocationResult'

function AreaResult({ area }) {
    const [districts, setDistricts] = useState({ districts: [], found: false })
    const [selectedDistrict, setSelectedDistrict] = useState({
        id: "",
        name: ""
    })

    useEffect(() => {
        setSelectedDistrict("");
        async function fetchDistrict() {
            try {
                let resp = await Axios.get(`/api/public/district/${area}`);
                setDistricts({ districts: resp.data.districts, found: true });
            } catch (e) {
                console.log(e.response)
            }
        }
        fetchDistrict()
    }, [area])

    function showDistricts() {
        if (districts.found) {
            if (districts.districts.length > 0) {
                /* sorting the districts by name */
                districts.districts.sort(function (a, b) {
                    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                });
                /* display each district */
                return (
                    <>
                        {districts.districts.map(district => (
                            <Row key={district._id}>
                                <Col className="p-1" xs={8}>
                                    <div id="btn-search-results" className={`btn btn-block ${selectedDistrict === district._id ? 'btn-success' : 'btn-outline-secondary'}`}
                                        onClick={() => { setSelectedDistrict({ id: district._id, name: district.name }) }}>
                                        {district.name}
                                    </div>
                                </Col>
                            </Row>
                        ))}
                    </>
                )
            }
        }
    }

    return (
        <Container>
            <h1>{area}</h1>
            <hr />
            <Row className="justify-content-center">
                <Col md={3}>
                    <h3>Districts</h3>
                    <hr />
                    {showDistricts()}

                </Col>
                <Col md={9}>
                    {selectedDistrict !== "" &&
                        <LocationResult district={selectedDistrict} />
                    }
                </Col>
            </Row>

        </Container>
    )
}

export default AreaResult
