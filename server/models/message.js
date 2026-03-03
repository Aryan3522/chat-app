const { default: mongoose, model } = require("mongoose");

const MessageSchema = mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    reciverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    text:{
        type:String
    },

    image:{
        type:String
    },
    MsgStatus:{
        type:String,
        default:"Sent"
    }

},
{timestamps:true}
)

const Message = mongoose.model("Message",MessageSchema)
module.exports = Message