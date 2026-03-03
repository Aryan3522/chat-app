import { AuthContext } from '@/app/context/AuthContext';
import React, { useContext, useState } from 'react'
import { Bounce, toast } from 'react-toastify';
import { NewPassword } from './NewPassword';

const ForgotPass = ({setMode}) => {
    const {findAccount,SENDOTP,VERIFYOTP} = useContext(AuthContext)
    const [data,setFormData] = useState({})
    const [user,setUser] = useState(false)
    const [Email,SetEmail] = useState('')
    const [passwordInp,SetpasswordInp] = useState(false)
    const [showinput,Setshowonput] = useState(false)


    async function findUserAccount(body) {
      try {
        const data = await findAccount(body);
        const resolveAfter3Sec = new Promise((resolve, reject) => {
          setTimeout(() => {
            if (data.email){
              SetEmail(data.email);
              setUser(true);
              resolve();
            } 
            else reject();
          }, 3000);
        });
    
        toast.promise(resolveAfter3Sec, {
          pending: 'Finding Account...',
          success: 'Account found successfully 👌',
          error: '"User Not Found" 🤯',
        });
      } catch (error) {
        console.log(error);
        toast.error('An error occurred while finding the account.');
      }
    }
    

    async function OTPHandler(body){
      try {
          const data = await SENDOTP(body)
          const resolveAfter3Sec = new Promise((resolve, reject) => {
          setTimeout(() => {
            if (data.Status=="OTP Sent Successfully"){
              Setshowonput(true);
              resolve();
            } 
            else reject();
          }, 2000);
        });
    
        toast.promise(resolveAfter3Sec, {
          pending: 'Sending OTP...',
          success: 'OTP Send successfully 👌',
          error: '"Error sending OTP" 🤯',
        });
      } catch (error) {
          console.log(error);
      }
  }

  async function VERIFYOTPHandler(body){
    try {
        const data = await VERIFYOTP(body)
        const resolveAfter3Sec = new Promise((resolve, reject) => {
          setTimeout(() => {
            if (data.msg==='OTP verified successfully'){
              SetpasswordInp(true)
              resolve();
            } 
            else reject();
          }, 3000);
        });
    
        toast.promise(resolveAfter3Sec, {
          pending: 'Verifying OTP...',
          success: `${data.msg} 👌`,
          error: `${data.msg} 🤯`,
        });
    } catch (error) {
        console.log(error);
    }
}
  return (
   <>
   {passwordInp?<NewPassword setMode={setMode} Email={Email}/>:(user?    <div className="flex justify-center h-full">
      <div className="bg-slate-200 rounded-2xl flex flex-col items-center shadow-2xl mt-10 p-6 w-[450px] h-[45vh]">
        <h5 className="text-slate-900 text-3xl font-extrabold mt-4 font-sans">{Email}</h5>

        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col items-center mt-4 w-full">
          {showinput && (
            <div className="mt-4 flex items-center">
              <input
                type="text"
                className="w-40 bg-white p-3 border border-slate-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500 transition duration-300"
                placeholder="Enter OTP"
                onChange={(e) => setFormData((prev) => ({ ...prev, OTP: e.target.value }))}
              />
              <button
                className="bg-green-700 w-24 h-12 rounded-xl text-white hover:bg-green-800 transition duration-300 ml-2"
                onClick={() => VERIFYOTPHandler({ email: Email, otp: data.OTP })}
              >
                Submit
              </button>
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-700 w-40 h-12 text-white rounded-xl hover:bg-blue-800 transition duration-300 mt-4"
            onClick={(e) => {
              e.preventDefault();
              OTPHandler({ UserEmail: Email });
            }}
          >
            {showinput ? 'Resend OTP' : 'Send OTP'}
          </button>
        </form>

        <button
          className="text-teal-900 mt-4 hover:underline text-lg transition duration-300"
          onClick={() => setMode('signin')}
        >
          Go to login page
        </button>
      </div>
    </div>: <div
    className="flex justify-center "
    style={{ height: '100%' }}
  >

<div className="bg-slate-200 rounded-2xl flex flex-col items-center shadow-2xl mt-10 p-6 w-[450px] h-[48vh]">
      <h5 className="text-slate-900 text-3xl font-extrabold mt-4 font-sans">Find Your Account</h5>
      <p className="text-slate-700 text-lg mt-2">Enter Your Email</p>

      <form className="mt-3 w-full" onSubmit={(e) => e.preventDefault()}>
        <div className="mb-4 w-full">
          <input
            type="email"
            className="w-full h-12 p-3 border border-slate-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300"
            placeholder="Enter Email"
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-700 w-full h-12 text-white rounded-xl hover:bg-blue-800 transition duration-300 mt-2"
          onClick={(e) => {
            e.preventDefault();
            findUserAccount(data);
          }}
        >
          Continue
        </button>
      </form>

      <button
        className="text-teal-900 mt-4 hover:underline text-lg transition duration-300"
        onClick={() => setMode('signin')}
      >
        Go to login page
      </button>
    </div>
  </div>)}
   </>
  )
}

export default ForgotPass