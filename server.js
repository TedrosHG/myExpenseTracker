const express = require('express')
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')

const auth = require('./middleware/authentication')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const bankRouter = require('./routes/bank')

const app = express()

// database connection
mongoose.connect(`${process.env.MONGO_URL}`)
        .then(()=>{
            console.log('database connected successfully.');
        })
        .catch((error)=>{
            console.log(`database connection failed: ${error}`)
        })

// middleware
app.use(express.json())
app.use(cors())


//Route
app.use('/auth', authRouter)
app.use('/user', auth, userRouter)
app.use('/bank', auth, bankRouter)

app.get('/',(req, res)=>{
    res.status(200).send('welcome to mybank, where it collects all your money transaction.')
})

// catch page not found error
app.use((req, res, next)=>{
    const err = new Error('Page not found')
    err.statusCode = 404
    next(err)
})

// Error handler
app.use((error, req, res, next)=>{
    error.statusCode = error.statusCode || 500
    return res.status(error.statusCode).json({
        status: "Error",
        message: error.message
    })
})

const port = process.env.PORT || 5000 



app.listen(port, ()=> console.log(`server is listening on port: ${port}`))