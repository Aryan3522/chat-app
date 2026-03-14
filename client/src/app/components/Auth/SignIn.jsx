import React, { useContext, useState } from 'react';
import { AuthContext } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Bounce, toast } from 'react-toastify';
import '@/app/style.css'
export const SignIn = ({ setMode }) => {
  const [formData, setFormData] = useState({});
  const { Authdispatch, UserSignIn } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload
    try {
      if (formData?.email && formData?.password) {
        const logindata = await UserSignIn(formData);
        if (logindata.status === 404) {
          toast.error('User does not exist', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            transition: Bounce,
          });
        } else if (logindata.status === 401) {
          toast.error('Wrong password', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            transition: Bounce,
          });
        }

        if (logindata?.status === 200) {
          toast.info("login successful", {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            transition: Bounce,
          })
          Authdispatch({
            type: 'SIGN_IN',
            payload: logindata.data,
          });
          router.push('/');
        }
      } else {
        toast.error('Please fill out the form', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="flex justify-center align-items-center"
      style={{ height: '100%' }}
    >
      <div className='flex justify-items-center items-center mr-5'
        style={{ width: "600px", height: "48vh" }}>
        <h1 className='text-slate-900 font-bold self-center' style={{ fontSize: "40px" }}>"Ready to chat? Log in to pick up where you left off."</h1>
      </div>

      <div
        className="bg-slate-200 p-8 rounded-lg flex flex-col items-center justify-items-center shadow-lg"
      >
        <h5
          className="text-slate-900 text-2xl font-bold mt-6"
          style={{ fontFamily: 'sans-serif', fontWeight: '700' }}
        >
          Signin
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="form-group mt-3 mb-3">
            <input
              type="email"
              className="w-full bg-white p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black mt-2"
              placeholder="Enter Email"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              style={{
                borderRadius: '6px',
                backgroundColor: '#e6e6e6',
                width: '300px',
                height: "45px"
              }}
            />
          </div>

          <div className="form-group mt-4">
            <input
              type="password"
              className="w-full bg-white p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black mt-1"
              placeholder="Enter Password"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              style={{
                borderRadius: '6px',
                backgroundColor: '#e6e6e6',
                width: '300px',
                height: "45px",
              }}
            />
          </div>
          <button
            className="text-red-500 mt-1 grid justify-self-end hover:underline"
            onClick={() => {
              setMode('ForgotPass');
            }}
          >
            Forgot Password?
          </button>
          <br />
          <button
            type="submit"
            className="bg-teal-950 w-40 h-12 text-white mt-1 rounded-sm hover:bg-teal-900"
            style={{ borderRadius: '10px', width: '160px', marginLeft: "60px" }}
          >
            Signin!
          </button>
          <br />
        </form>
        <div className='flex items-center justify-center gap-2 mt-4'>
          <p>
            Don't Have An Account?
          </p>
          <button
            className="text-teal-900 hover:underline"
            onClick={() => {
              setMode('signup');
            }}
          >
            Signup!
          </button>
        </div>
        <br />
      </div>
    </div>
  );
};
