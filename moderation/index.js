const express = require('express')
const axios = require('axios')

const app = express()
app.use(express.json())

app.post('/events',async (req,res) => {
    const { type, data} = req.body
    console.log('Event emitted: ',type)
    if(type === 'CommentCreated'){
        const status = data.content.includes('orange') ? 'rejected' : 'approved'

        await axios.post('http://event-bus-srv:8005/events',{
            type: 'CommentModerated',
            data: {
                id: data.id,
                content: data.content,
                postId: data.postId,
                status

            }
        })
    }

    res.send({})
})

app.listen(8003,() => console.log('Listening at PORT 8003'))