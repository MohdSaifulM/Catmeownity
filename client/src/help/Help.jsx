import React from 'react'
import { Container, Jumbotron } from 'react-bootstrap'

function Help() {
    let helpItems = [
        {
            question: "What is CatMeownity?",
            answer: `<p>CatMeownity is a community app for cat-lovers! You can use this app to discover, keep tabs on, or share your love for cats (or just a particular one) with others.</p>
                <p>There are various functions for you to use such as tracking your favourite cats, adding photos for cats, and leaving descriptions/comments so others will have an insight
                in to what this cat is like!</p>`
        },
        {
            question: "How do I find a cat?",
            answer: `<p>Finding a cat is simple! Click on the search button to view the locations with cats. They are sorted into Singapore's north, south, east, west, north-east, and north-west.</p>
            <p>Once there, you will be shown the various districts as well as the locations in that district. Select your location and you can see all the cats who live there.</p>`
        },
        {
            question: "I can't find the cat I'm looking for. How do I add him/her?",
            answer: `<p>First, make sure that you are searching in the correct locality, district, and location. If the cat isn't there, click the "Add A New Cat" button.</p>
            <p>You will be asked to fill in the cat's details, and you can also upload a photo for your furry friend. If there are any cats who happen to have the same name, you will be
            prompted to check if they are indeed the same cat!</p>`
        },
        {
            question: "I can't find the location I'm looking for. What do I add it?",
            answer: `<p>First, make sure that you are searching in the correct locality and district. You can also check other districts in the locality as you location might
            be in between 2 districts.
            </p>
            <p>If your location is not there, you can select the district to which it belongs and click the "Add It Here" button. Simply key in the name of your district and voilà!</p>`
        },
        {
            question: "How do I tell other people about a particular cat?",
            answer: `<p>Once we bond with a cat, what better feeling is there than to share that bond with other cat-lovers!</p>
            <p>Go over to the cat's profile by searching for it, or from your list of tracked cats on your dashboard.</p>
            <p>Scroll down to the comments tab to see all the comments/descriptions that have been left for this cat. There is a field where you can include your own description
                of the cat. Just write your comment and click add, and it will be displayed on the cat's page for all to see!</p>
            <p className="font-italic">You will need to be logged in for this feature</p>`
        },
        {
            question: "Can I add more photos of a cat?",
            answer: `<p>Go over to the cat's profile by searching for it, or from your list of tracked cats on your dashboard.</p>
            <p>Scroll down to the photos tab to see all the of this cat.</p>
            <p>Click on the "Add A New Photo" button and choose a photo of the cat to upload. Remember to add a short description of the photo! Click upload to upload the photo.</p>
            <p className="font-italic">You will need to be logged in for this feature</p>`
        },
        {
            question: "Can I change the location of a cat?",
            answer: `<p>Not right now, but we are working on that!</p>
            <p>It is not recommended to move a stray cat as cats are very territorial. You might upset the balance of cat territories and it might lead to a cat war! The cat
                might also not be able to adjust to it's new surroundings.</p>`
        },
        {
            question: "How can I let others know that I've fed the cat?",
            answer: `<p>On the cat's profile, scroll down to the feeding tab. This will show the last 3 times users have fed this cat. Use this to decide when and what to feed the cat!</p>
            <p>Click on the "Fed This Kitty?" button to log your feeding of the cat. Remember to leave short description of what you fed it!</p>
            <p className="font-italic">You will need to be logged in for this feature</p>`
        },
        {
            question: "How do I change the cat's details?",
            answer: `<p>On the cat's profile, click on the "Edit" button below the cat's details. You can add or remove the cat's different names and colours, change it's breed and gender.</p>
            <p>Click on the "Update" button to save the changes!</p>
            <p className="font-italic">You will need to be logged in for this feature</p>`
        },
        {
            question: "How do I edit my profile?",
            answer: `<p>Go to your profile from the dashboard. Click on the "Edit" button below your details and edit them.</p>
            <p>Click on the "Update" button to save the changes!</p>
            <p className="font-italic">You will need to be logged in for this feature</p>`
        },
        {
            question: "How do I view my favourite cats and tracked locations?",
            answer: `<p>Go to your dashboard, and you can see your favourite cats and tracked locations!</p>
            <p>To add a cat to your favourites, simply go to the cat's profile and click on the "Follow This Cat" button. You can also unfollow a favourite cat here, or do it on your dashboard</p>
            <p>To track a location, go to Search and search for the location you want to track. Click on the "Track" button to add it to your tracked locations! You can also untrack a location here, or do it on your dashboard!</p>
            <p className="font-italic">You will need to be logged in for this feature</p>`
        },
        {
            question: "I haven't seen a particular cat in a while. What should I do?",
            answer: `<p>Hopefully it's nothing serious. Talk to the others in your cat community - maybe they will know. Someone might also have left a comment as to whether they are 
            at the vet, or have been adopted.</p>
            <p>If you are really worried and would like to notify the community, you can click on the "Haven't Seen This Kitty Lately?" button on the cat profile page. This will put up
            a missing notice that other users can see.</p>`
        },
    ]
    return (
        <>
            <Jumbotron className='text-center jumboboard text-white'>
                <h1>Help Page</h1>
                <p className="text-muted">
                    Can't figure out how to use CatMeownity?
                </p>
            </Jumbotron>
            <Container className="my-5">
                <div className="h5">
                    {helpItems.map((item, index) => (
                        <div key={index} className="my-3">
                            <a className="text-muted" href={`#${item.question.split(' ').join('-')}`}><li className="my-2">{item.question}</li></a>
                        </div>
                    ))}
                </div>
            </Container>
            <hr />
            <Container>
                <div>
                    {helpItems.map((item, index) => (
                        <div key={index} className='my-5'>
                            <a className="anchor" id={`${item.question.split(' ').join('-')}`}></a>
                            <div>
                                <h4>{item.question}</h4>
                            </div>
                            <Container dangerouslySetInnerHTML={{__html: item.answer}} />
                        </div>
                    ))}
                </div>
            </Container>
        </>
    )
}

export default Help
