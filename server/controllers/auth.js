const User = require("../models/user");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.signup = async(req,res)=>{
    try {
        const checkuser = await User.findOne({email:req.body.email})
        if(checkuser){
            res.status(409).send("User already exists")
            return;
        }
        const {password} = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const userTobeadded = new User({...req.body,password:hashedPassword})
        const user = await userTobeadded.save()
        res.send({user,msg:"user created"})
    } catch (error) {
        console.log(error);
    }
}

exports.signin = async(req,res)=>{
    try {
        const { email, password } = req.body
        const user = await User.findOne({email:email})
        if(user){
            const verify = await bcrypt.compare(password,user.password)
            if(verify){
                const token = jwt.sign({email,password},process.env.SECRET)
                res.send({token,userId:user._id,ProfilePicture:user.ProfilePicture,msg:"Welcome"})
            }else{
                res.status(401).send("Wrong Password")
            }
        }else{
            res.status(404).send("user does not Exists")
        }
    } catch (error) {
        console.log(error);
    }
}

exports.findAccount = async(req,res)=>{
    try {
        console.log(req.params.email);
        
        const account = await User.findOne({email:req.params.email})
        // console.log(account);
        
        if(account){
            res.send({email:account.email})
        }
        else{
            res.send("User Not Found")
        }
    } catch (error) {
      console.log(error); 
    }
}