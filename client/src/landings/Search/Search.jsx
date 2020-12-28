import React, { useState } from 'react'
import { Container, Jumbotron, Row, Col } from 'react-bootstrap'
import AreaResult from './AreaResult';

function Search() {
    const [area, setArea] = useState("");

    let locality = ['North', 'South', 'Central', 'East', 'West', 'North-East', 'North-West']

    function showAreaButtons() {
        return (
            <Row sm={4} xs={3}>
                {locality.map((l, index) => (
                    <Col key={index} className="my-2">
                        <div id="btn-search" className={`btn ${area === l ? 'btn-light' : 'btn-outline-dark'} btn-block`}
                            onClick={() => (setArea(l))}>
                            {l}
                        </div>
                    </Col>
                ))}
            </Row>
        )
    }
    return (
        <>
            <Jumbotron className='jumboboard'>
                <div className="ml-5 pl-5 text-white">
                    <h1>Search</h1>
                </div>
            </Jumbotron >
            <Container className="my-5">
                {showAreaButtons()}
            </Container>
            {area !== "" &&
                <AreaResult area={area} />
            }
        </>
    )
}

export default Search
