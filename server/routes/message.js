const express = require("express")
const { sendMessage, getMessages, MessageStatus} = require("../controllers/message")
const { authenticator } = require("../middleware/authenticator")

const MessageRouter=express.Router()
MessageRouter.post("/SendMessage/:id",authenticator,sendMessage)
MessageRouter.get("/GetMessage/:id",authenticator,getMessages)
MessageRouter.put("/UpdateMsgStatus",authenticator,MessageStatus)

module.exports = MessageRouter

