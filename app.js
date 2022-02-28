const express = require('express')
const path = require('path')
const mongoose = require("mongoose")
const userRouter = require("./routes/user")
const productRouter = require("./routes/product")
const ownerRouter = require('./routes/owner')
const orderRouter = require('./routes/order')

require('dotenv').config()
const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(express.urlencoded())

// Register Routers
app.use(userRouter)
app.use(productRouter)
app.use(ownerRouter)
app.use(orderRouter)

app.get("/", (req, res) => {
  res.send("Welcome. I am Ananya Sharma")
})

// database connection
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log('mongoose connected')
    app.listen(PORT, () => {
      console.log(`Listening at port ${PORT}`);
    })
  }
  )
  .catch((err) => console.log(err));