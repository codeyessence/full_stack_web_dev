const express = require("express")
const port= process.env.PORT ||3000
const app=express()
const hbs=require("hbs")
const path=require('path')
const views_path=path.join(__dirname,"../templatesa/viewsa")
const body_parser=require("body-parser")
app.use(body_parser.json())
app.use(body_parser.urlencoded(extended=false))
app.use("/css",express.static(path.join(__dirname,"../templatesa/assets/css")))
app.use("/images",express.static(path.join(__dirname,"../templatesa/assets/images")))
const mongoose=require("mongoose")
require("./dba/conn")
const register=require("./modela/register")
app.set("view engine","hbs")
app.set("views",views_path)

app.listen(port,()=>{
    console.log(`Running in port: ${port}`)
})

app.get("/index",(req,res)=>{
    res.render("index")
})

app.post("/send",(req,res)=>{
    const name=req.body.name
    const roll_no=req.body.roll_no
    const reg_no=req.body.reg_no
    const event=req.body.event
    console.log(name)
    console.log(roll_no)
    console.log(reg_no)
    const save_data= new register({name:name,roll_no:roll_no,registration_no:reg_no,event:event})
    save_data.save().then(
        ()=>{
            console.log("Data Saved to DB!")
        }
    ).catch(
        (e)=>{
            console.log(`Error: ${e}`)
        }
    )
    res.send("Thank you for registering!")
})
app.get("/display",async(req,res)=>{
    const data=await register.find()
    console.log(data)
    res.render("display",{data})
})
app.post("/update",async(req,res)=>{
    const name=req.body.name
    const roll_no=req.body.roll_no
    const reg_no=req.body.reg_no
    const event=req.body.event
    const id=req.body.id
    const btn=req.body.btn
    var status
        if(btn==="UPDATE"){
          const update = await register.updateOne({"_id":new mongoose.Types.ObjectId(id)},
              {$set:{"name":name,"roll_no":roll_no,"registration_no":reg_no,"event":event}})
            status=1
        }
        if(btn==="DELETE"){
            const del=await register.deleteOne({"_id":new mongoose.Types.ObjectId(id)})
            status=2
            console.log(status)
        }
        const data= await register.find()
        res.render("display",{data,status})
    })