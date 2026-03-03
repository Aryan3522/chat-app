const User = require("../models/user");
const bcrypt = require("bcrypt")
exports.getprofile = async (req,res)=>{
   try {
    let myprofile = await User.findOne({_id:req.params.id})
    myprofile = myprofile.toObject();
   delete myprofile.password
   res.send({myprofile,msg:"profile get"})
   } catch (error) {
    console.log(error);
   }
}

exports.deleteaccount = async (req,res)=>{
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    res.send({user,deleteFolder,deleteNotes,msg:"User"})
  } catch (error) {
    console.log(error);
  }
}

exports.updateprofile= async (req,res)=>{
  try {
    const user = await User.findByIdAndUpdate(req.params.id,{username:req.body.username,email:req.body.email,
    ProfilePicture:req.body.ProfilePicture})
    res.send(user)
  } catch (error) {
    console.log(error);
  }
}

exports.updatepassword = async (req, res) => {
  try {
    const { password, email } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userTobeadded = await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!userTobeadded) {
      return res.status(404).send({ msg: "User not found" });
    }

    console.log(userTobeadded);
    res.send({ msg: "Password is updated" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Server error" });
  }
};


