const express = require("express")
const { signup, signin, findAccount } = require("../controllers/auth")
const { getUserForSidebar } = require("../controllers/user")
const { authenticator } = require("../middleware/authenticator")

const AuthRouter = express.Router()

AuthRouter.post("/signup",signup)
AuthRouter.post("/signin",signin)
AuthRouter.get("/getUsers",authenticator,getUserForSidebar)
AuthRouter.get("/FindAccount/:email",findAccount)

module.exports = AuthRouter