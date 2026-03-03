import { AuthContext } from '@/app/context/AuthContext';
import React, { useContext, useState } from 'react'
import { Bounce, toast } from 'react-toastify';

export const NewPassword = ({setMode,Email}) => {
    const [formData,setFormData] = useState({})
    const{PasswordUpdate} = useContext(AuthContext)
    async function handleSubmit(e) {
      e.preventDefault();
      try {
          if (formData.Newpassword === formData.confirmPassword) {
            const body = {password:formData.Newpassword,email:Email}
            const status = await PasswordUpdate(body);
            if (status === 200) {
              toast.info('Password Changed successful', { position: 'top-center', autoClose: 3000, theme: 'light', transition: Bounce });
              setTimeout(() => setMode('signin'), 3000);
            }
          } else {
            toast.error("Passwords don't match", { position: 'top-center', autoClose: 5000, theme: 'light', transition: Bounce });
          }
      } catch (error) {
        console.error(error);
      }
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="bg-slate-200 p-8 rounded-2xl shadow-lg w-full max-w-md">
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create New Password</h2>
    <form onSubmit={handleSubmit}  className="space-y-4">
      {[ 'Newpassword', 'confirmPassword'].map((field, idx) => (
        <input
          key={idx}
          type="password"
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          onChange={(e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))}
        />
      ))}



      <button type="submit" className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Confirm</button>
    </form>
    <button onClick={() => setMode('signin')} className="mt-4 w-full text-teal-600 hover:underline">Go To Signin Page</button>
  </div>
</div>
  )
}
