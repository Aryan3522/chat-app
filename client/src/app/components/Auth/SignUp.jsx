import React, { useContext, useState } from 'react';
import { Bounce, toast } from 'react-toastify';
import { AuthContext } from '@/app/context/AuthContext';
import '@/app/style.css';

export const SignUp = ({ setMode }) => {
  const [formData, setFormData] = useState({});
  const { UserSignUp } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (formData?.username && formData?.email && formData?.password && formData?.confirmPassword) {
        if (formData.password === formData.confirmPassword) {
          const status = await UserSignUp(formData);
          if (status === 200) {
            toast.info('SignUp successful', { position: 'top-center', autoClose: 3000, theme: 'light', transition: Bounce });
            setTimeout(() => setMode('signin'), 3000);
          }
        } else {
          toast.error("Passwords don't match", { position: 'top-center', autoClose: 5000, theme: 'light', transition: Bounce });
        }
      } else {
        toast.error('Please fill out the form', { position: 'top-center', autoClose: 5000, theme: 'light', transition: Bounce });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className='flex justify-items-center items-center mr-5'
    style={{width:"600px",height:"48vh"}}>
        <h1 className='text-slate-900 font-bold self-center' style={{fontSize:"40px"}}>"Join the conversation. Create your account today."</h1>
    </div>
      <div className="bg-slate-200 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['username', 'email', 'password', 'confirmPassword'].map((field, idx) => (
            <input
              key={idx}
              type={field.includes('password') ? 'password' : 'text'}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))}
            />
          ))}

<label className="block text-gray-700">Profile Picture</label>
          <div className="border-2 border-teal-300 border-dashed p-4 rounded-lg text-center cursor-pointer hover:border-teal-500">
            <input
              type="file"
              className="w-full p-2 rounded-lg"
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  const fileReader = new FileReader();
                  fileReader.onload = (event) => setFormData((prev) => ({ ...prev, ProfilePicture: event.target.result }));
                  fileReader.readAsDataURL(e.target.files[0]);
                }
              }}
            />
          </div>
          {formData.ProfilePicture && (
            <img src={formData.ProfilePicture} alt="Profile" className="mx-auto mt-4 w-32 h-32 rounded-full object-cover" />
          )}

          <button type="submit" className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Sign Up</button>
        </form>
        <button onClick={() => setMode('signin')} className="mt-4 w-full text-teal-600 hover:underline">Already have an account? Sign In</button>
      </div>
    </div>
  );
};
