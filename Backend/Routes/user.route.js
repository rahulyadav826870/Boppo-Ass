const express =require("express")
const { UserModel } = require("../Model/user.model")

const userRoute=express.Router()

userRoute.get("/",async(req,res)=>{
    try {
        const user = await UserModel.find()
        res.send(user)
    } catch (error) {
        
    }
})

userRoute.get("/:id",async(req,res)=>{
    const id=req.params.id
    try {
        const user = await UserModel.findById({_id:id})
        res.send(user)
    } catch (error) {
        
    }
})


userRoute.post("/register",async(req,res)=>{
    const payload =req.body

     // Check if user already exists
  const existingUser = await UserModel.findOne({
    $or: [
      { email: payload.email },
   
    ],
  });

  if (existingUser) {
    res.send({ msg: "User already exists." });
    return;
  }
    try {
        const user = await UserModel.insertMany(payload)
        res.send({"msg":"User Added Sucessfully"})
    } catch (err) {
        res.send({ msg: "Something went Wrong", error: err });
    }
})

userRoute.put("/update/:id",async(req,res)=>{
    const id =req.params.id
    const payload =req.body
    try {
        const user = await UserModel.findByIdAndUpdate({_id:id},payload)
        res.send({"msg":"User Updated Sucessfully"})
    } catch (err) {
        res.send({ msg: "Something went Wrong", error: err });
    }
})


userRoute.delete("/delete/:id",async(req,res)=>{
    const id =req.params.id
    try {
        const user = await UserModel.findByIdAndDelete({_id:id})
        res.send({"msg":"User Delete Sucessfully"})
    } catch (err) {
        res.send({ msg: "Something went Wrong", error: err });
    }
})



module.exports={
    userRoute
}