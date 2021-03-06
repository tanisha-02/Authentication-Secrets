require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});
console.log(process.env.API_KEY);
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

// const secret="Thisisourlittlesecret.";//long string
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
//save will decrypt the password and find will encrypt the password
//if we don't mention the encrypted fields then it will encrypt our whole database so we choose to encrypt only th reqd field
const User=mongoose.model("User",userSchema);

app.get("/",function(req,res)
{
    res.render("home");
})
app.get("/login",function(req,res)
{
    res.render("login");
})
app.get("/register",function(req,res)
{
    res.render("register");
});
app.post("/register",function(req,res)
{
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save(function(err)
    {
        if(!err)
        res.render("secrets");
        else
        res.send(err);
    })
})
app.post("/login",function(req,res)
{
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username},function(err,foundUser)
    {
        if(err)
        res.send(err);
        else
        {
            if(foundUser)
            {
                if(foundUser.password===password)
                res.render("secrets");
                else
                res.send("You entered a wrong password");
            }
        }
    })
})
app.listen(3000,function()
{
    console.log("Server started running on port 3000");
})