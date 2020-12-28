import React from 'react'
import { Carousel, Col, Container, Jumbotron } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import '../App.css'

function Home() {
    let trivia = [
        {
            header: "What are cats' whiskers for?",
            trivia: `Cats use their whiskers to navigate through the world. They use them to help determine if 
            they can fit in a small space because their whiskers are approximately the same width as 
            their body. This is why you shouldn’t cut your cat’s whiskers.`
        },
        {
            header: "Wild cat?",
            trivia: `Cat’s share 95.6 percent of their genome with tigers and demonstrate several of the same behaviors.`
        },
        {
            header: "Play time!",
            trivia: `Cats with a question mark-shaped tail are feeling playful.`
        },
        {
            header: "Why are you hitting me?",
            trivia: `A cat batting you with paws (and not claws) is playing and not attacking.`
        },
        {
            header: "How many?",
            trivia: `A group of cats can be called a “clowder,” “clutter,” “glaring” and “pounce.”`
        },
        {
            header: "Meow",
            trivia: `Cats have as many as 100 different vocalizations while dogs only have 10.`
        },
        {
            header: "Danger, Will Robinson",
            trivia: `Unlike dogs, beware a cat that is wagging their tail!`
        },
        {
            header: "Bath time",
            trivia: `Grooming themselves helps cats relax, stimulate their blood flow and regulate their body temperature.`
        },
        {
            header: "Toilet time",
            trivia: `Cats prefer to have a litter box for themselves so have one for each of your kitties.`
        },

    ]
    return (
        <>
            <Jumbotron id="jumbo" className='text-center jumbotop'>
                <Col xs={5} className="mx-auto">
                    <Container id="title-container" className="py-2">
                        <h1 className="text-black my-3">CatMeownity</h1>
                        <p className="text-dark">
                            Neighbourhood and community cats in an app
                        </p>
                    </Container>
                    <div>
                        <NavLink id="btn-search-community" to='/search' className='btn btn-block btn-dark btn-lg mt-5'>Search for a community with cats</NavLink>
                    </div>
                </Col>
            </Jumbotron>
            <div className="learn-container">
                <Container>
                    <h4 className="text-center p-4">Learn more about cats</h4>
                    <Carousel>
                        {trivia.map((item, index) => (
                            <Carousel.Item key={index}>
                                <img id={`trivia${index}`} className="d-block w-100" src="https://images.pexels.com/photos/35888/amazing-beautiful-breathtaking-clouds.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
                                <Carousel.Caption>
                                    <h3>{item.header}</h3>
                                    <p>{item.trivia}</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Container>
            </div>
        </>
    )
}

export default Home