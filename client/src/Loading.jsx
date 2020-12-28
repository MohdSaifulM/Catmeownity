import React from 'react'
import { Container, Image } from 'react-bootstrap'
import loading from './resources/loading.gif'

function Loading() {
    return (
        <Container className="text-center pt-5">
            <Image src={loading} width="100%"/>
        </Container>
    )
}

export default Loading
