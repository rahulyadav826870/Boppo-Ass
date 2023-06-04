const express =require("express")
const { connection } = require("./Config/db")
const { userRoute } = require("./Routes/user.route")
require('dotenv').config()
const cors = require("cors");

const app =express()
app.use(cors({ origin: "*" }));
app.use(express.json())

app.get("/",(req,res)=>{
    try {
        res.send("This is home page")
    } catch (error) {
        console.log(error)
    }
})
app.use("/user",userRoute)

app.listen(process.env.port, async()=>{
    try {
        await connection
        console.log("Connected to Mongoose")
        console.log(`Server is Running at ${process.env.port}`)
    } catch (error) {
        
    }
})