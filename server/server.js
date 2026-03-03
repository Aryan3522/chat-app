const express = require("express")
const bodyparser = require("body-parser")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const { connectdb } = require("./Config/db")
const AuthRouter = require("./routes/auth")
const MessageRouter = require("./routes/message")
const { app, server } = require("./SOCKETIO/socketio")
const profileRouter = require("./routes/profile")
const OTPRouter = require("./routes/OTP")
const filerouter = require("./routes/file")
const userRouter = require("./routes/user")
dotenv.config({path:"./Config/config.env"})
app.use(
  cors({
    origin:process.env.CORS_PORT||"http://localhost:3000", 
    methods: ["GET", "POST","PUT"],
    credentials: true,
  })
);
app.use(bodyparser.json({
    limit:"30mb"
}))
app.use(morgan("dev"))
connectdb()

app.get("/",(req,res)=>{
  try {
      res.send("Hello")
  } catch (error) {
      console.log(error);
  }
})
app.use("/auth",AuthRouter)
app.use("/message",MessageRouter)
app.use("/profile",profileRouter)
app.use("/otp",OTPRouter)
app.use("/search",userRouter)

server.listen(process.env.PORT,()=>{
    console.log("server is running");
})
