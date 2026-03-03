const express = require("express")
const { getprofile, deleteaccount, updateprofile, updatepassword} = require("../controllers/profile")
const profileRouter = express.Router()

profileRouter.get("/getprofile/:id",getprofile)
profileRouter.delete("/deleteprofile/:id",deleteaccount)
profileRouter.put("/updateprofile/:id",updateprofile)
profileRouter.put("/updatepassword",updatepassword)



module.exports = profileRouter