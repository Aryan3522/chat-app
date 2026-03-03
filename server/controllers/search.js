const User = require("../models/user");


exports.search = async(req,res)=>{
    try {
        const loggedInUserId = req.userId;
        const searchTerm = req.query.username
        // const users = await User.find({ _id: { $ne: loggedInUserId } });
        SearchedUser = await User.find({
            _id: { $ne: loggedInUserId }, 
            username: { $regex: `^${searchTerm}`, $options: "i" }, 
        }).limit(10); 
        res.status(200).send({ SearchedUser, msg: "Users Found" });

        // users.map((ele)=>{
        //     // console.log(ele.username);
        //     const a = ele.username.slice(0,searchTerm.length)
        //     if(a==req.query.username){
        //     SearchedUser.push(ele)
        //     console.log(a)
        //     }
            
        // })
    } catch (error) {
        console.log(error);
    }
}