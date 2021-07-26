const express = require('express')
const asyncHandler = require('express-async-handler')
const axios = require('axios')
const fetch = require('node-fetch')

const app = express()
app.use(express.json())

// const eventMiddleware = asyncHandler(async (req,res,next) => {

//     // let response = await axios.get('http://localhost:8002')

//     // if(await axios.get('http://localhost:8002')){
//     //     console.log('server running')
//     // }else{
//     //     throw new Error('Error : ',error)
//     // }

//     await axios.post('http://localhost:8002/events',{
//         type: 'testing',
//         data: {}
//     })

//     res.send({})
// })
// app.get('/',eventMiddleware)

app.get('/',async (req,res) => {

    let event = {
        type: "testing",
        data: {}
    }

    try {

    await fetch('http://localhost:8000/events',{
        method: 'post',
        body: event,
        header: {'Content-Type':'application/json'}
    })
        
    } catch (error) {
        console.log("Errror: ",error)
    }

    res.send({})
})

app.listen(7000,() => console.log('Listening on PORT 7000'))
