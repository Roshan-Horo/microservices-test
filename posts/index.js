const express = require('express')
const { randomBytes } = require('crypto')
const cors = require('cors')
const axios = require('axios')
const asyncHandler = require('express-async-handler')

const app = express()
app.use(express.json())
app.use(cors())

// VARIABLES
let posts = {}

// FUNCTIONS
const eventHandler = asyncHandler( async (req,res) => {
    const id = randomBytes(4).toString('hex')
    const { title } = req.body

    posts[id] = {
        id,title
    }

    await axios.post('http://event-bus-srv:8005/events',{
        type: 'PostCreated',
        data: {
            id,title
        }
    })
   res.status(201).send(posts[id])
})

// ROUTES   
app.get('/',(req,res) => {
    res.send('post service')
})

app.get('/posts', (req,res) => {
    res.send(posts)
})

app.post('/posts/create', eventHandler)

// app.post('/posts',async (req,res) => {
//    const id = randomBytes(4).toString('hex')
//    const { title } = req.body

//    posts[id] = {
//        id,title
//    }

//     await axios.post('http://localhost:8005/events',{
//        type: 'PostCreated',
//        data: {
//            id,title
//        }
//    })

//    res.status(201).send(posts[id])
// })

app.post('/events',async (req,res) => {
    console.log("Event Emitted: ",req.body.type)

    res.send({})
})


app.listen(8000,() => {
    console.log('Listening at PORT 8000')
})