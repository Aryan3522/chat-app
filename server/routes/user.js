const express = require("express")
const { search } = require("../controllers/search")
const { authenticator } = require("../middleware/authenticator")

const userRouter=express.Router()

userRouter.get("/searchuser",authenticator,search)

module.exports = userRouter
