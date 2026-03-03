const Message = require("../models/message");
const User = require("../models/user");
const dotenv = require("dotenv")
dotenv.config({ path: "./Config/config.env" })
const { getReceiverSocketId, io } = require("../SOCKETIO/socketio");

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


exports.getMessages = async (req, res) => {
    try {

        const { id: userToChatId } = req.params
        const myId = req.userId

        const messages = await Message.find({
            $or: [
                { senderId: myId, reciverId: userToChatId },
                { senderId: userToChatId, reciverId: myId },
            ],
        })

        res.send({ messages, msg: "your messages" })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal server error" })
    }
}

exports.sendMessage = async (req, res) => {
    try {
        const { text, image, MsgStatus } = req.body
        const { id: reciverId } = req.params
        const senderId = req.userId
        const reciverName = await User.findOne({ _id: reciverId })
        let imageUrl;
        if (image) {

            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;

            imageUrl = uploadResponse.secure_url;
        }
        const NewMessage = new Message({
            text,
            image: imageUrl,
            reciverId,
            senderId,
            MsgStatus
        })

        await NewMessage.save()
        const reciverSocketId = getReceiverSocketId(reciverId)
        if (reciverSocketId) {
            io.to(reciverSocketId).emit("newMessage", { Msg: NewMessage, Name: reciverName.username })
        }

        res.status(201).send({ NewMessage, msg: "Message Send" })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal server error" })
    }
}

exports.MessageStatus = async (req, res) => {
    try {
        const { sendby, status, reciveby } = req.body;
        const messages = await Message.find({ senderId: sendby });


        if (status == "Received") {
            await Message.updateMany(
                { reciverId: sendby, MsgStatus: "Sent" },
                { $set: { MsgStatus: "Received" } }
            );
        }

        // Update from "Received" to "seen"
        if (status == "seen") {
            await Message.updateMany(
                { senderId: sendby, reciverId: reciveby, MsgStatus: "Received" },
                { $set: { MsgStatus: "seen" } }
            );
        }
        const updatestatus = await Message.find({ senderId: sendby });
        res.send({ updatestatus, msg: "Status Updated" });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).send({ error: "Failed to update message status" });
    }
};
