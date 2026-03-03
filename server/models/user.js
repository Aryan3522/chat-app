const { default: mongoose } = require("mongoose");

const UserSchema= mongoose.Schema({
    username:{
      type:String,
      required:true
    },

    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },

    ProfilePicture:{
        type:String
    },

    verify:{
        type:Boolean,
        default:false
    },
    verificationtoken:{
        type:String
    },
    friends:{
        type:Array,
        default:[]
    },
    friendRequestSent:{
        type:Array,
        default:[]
    },
    friendRequestReceived:{
        type:Array,
        default:[]
    }

},{timestamps:true});

const User = mongoose.model("User",UserSchema)
module.exports = User