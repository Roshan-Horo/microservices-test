const express = require('express')
const axios = require('axios')
const asyncHandler = require('express-async-handler')

const app = express()
app.use(express.json())

// VARIABLES
let events = [];

// MIDDLEWARE
const eventMiddlware = asyncHandler( async (req,res) => {
    const event = req.body
    console.log(event.type)
    events.push(event)
    
    await axios.post('http://posts-clusterip-srv:8000/events', event)
    await axios.post('http://comments-srv:8001/events', event)
    await axios.post('http://query-srv:8002/events', event)
    await axios.post('http://moderation-srv:8003/events', event)

    res.send({})
})

app.get('/',(req,res) => {
    res.send('Event Bus')
})

app.post('/events', eventMiddlware)

// app.post('/events',async (req,res) => {
//     const event = req.body

//     events.push(event)

//     await axios.post('http://localhost:8000/events', event)
//     await axios.post('http://localhost:8000/events', event)
//     await axios.post('http://localhost:8000/events', event)
//     await axios.post('http://localhost:8000/events', event)

    // if(axios.get('http://localhost:8000')){

    //     console.log('posts service running')
    //     axios.post('http://localhost:8000/events', event)  
    //     console.log("REsponse: ",postRes)
    // }
    // if(axios.get('http://localhost:8001')){
    //     console.log('comment service running')
    //     axios.post('http://localhost:8001/events', event)
        
    // }
    // if(axios.get('http://localhost:8002')){
    //     console.log('query service running')
    //     axios.post('http://localhost:8002/events', event)
    // }
    // if(axios.get('http://localhost:8003')){
    //     console.log('moderation service running')
    //     axios.post('http://localhost:8003/events', event)
    // }


//     res.send({ status: 'ok'})
// })

app.get('/events',(req,res) => {
    console.log(events)
    res.send(events)
})

app.listen(8005,() => console.log('Listening on PORT 8005'))