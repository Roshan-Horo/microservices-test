const express = require('express')
const cors = require('cors')
const axios = require('axios')
const asyncHandler = require('express-async-handler')

const app = express()
app.use(express.json())
app.use(cors())

// VARIABLES
let posts = {}

// functions

const startServer = asyncHandler(async () => {
    console.log('background process')

    try {
        
        let res = await axios.get('http://event-bus-srv:8005/events')
        
        if(res.status !== 200){

            throw new Error('Error')
        
        }else{
            for(let event of res.data){
                    console.log('Processing Event: ',event.type)

                    handleEvents(event.type, event.data)
            }
        }
    } catch (error) {
        console.log('Error: ',error)
    }
})

const handleEvents = (type, data) => {

     if(type === 'PostCreated'){
        const { id, title} = data
 
        posts[id] = {id, title, comments: [] }

     }

     if(type === 'CommentCreated'){
        const {id, content, postId, status} = data

        const post = posts[postId]

        post.comments.push({id, content, status})

     }

     if(type === 'CommentUpdated'){
         const {id, content, postId, status} = data

         const post = posts[postId]

         const comment = post.comments.find(comment => {
             return comment.id === id
         })

         comment.status = status
         comment.content = content
     }

     if(type === 'Testing'){
         console.log('Testing event')
     }

}

// Routes
app.get('/',(req,res) => {
    res.status(200)
    res.send('query')
})

app.head('/',(req,res) => {
    res.status(260)
    res.set('running','yes')
})


app.get('/posts',(req,res) => {
    res.send(posts)
})

app.post('/events',(req,res) => {
    const { type, data} = req.body

    console.log('Event Emitted: ',type)
    handleEvents(type,data)
    
    res.send({})
})

app.listen(8002, async () => {
    console.log('Listening at PORT 8002!!!')
    // startServer()
    try {
        
        console.log('background process')
        const res = await axios.get('http://event-bus-srv:8005/events')
        if(res){
            for(let event of res.data){
                console.log('Processing Event: ',event.type)

                handleEvents(event.type, event.data)
            }
        }else{
            res.status(401)
            throw new Error('Error: ',error)
        }
    } catch (error) {
        console.log('Error : Event Bus service Not Running')
    }
})