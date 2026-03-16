import { AuthContext } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import { Bounce, toast } from 'react-toastify';
import '@/app/style.css';


export const MyProfile = () => {
  const { AuthData, getprofile, deleteaccount, dispatch, profileupdate, Authdispatch } = useContext(AuthContext)
  const [userProfile, setUserProfile] = useState({});
  const [ProfileModal, setProfileModal] = useState(false);
  const [Updatedprofile, Updateprofile] = useState({})
  const router = useRouter()
  const UserData = AuthData
  async function getUserprofile(authData) {
    try {
      const data = await getprofile(authData)
      setUserProfile({ ...data.myprofile })
    } catch (error) {
      console.log(error);
    }

  }


  async function handelupdateprofile(authdata, data) {
    try {
      const status = await profileupdate(authdata, {
        username: data.username || userProfile.username,
        email: data.email || userProfile.email,
        ProfilePicture: data.ProfilePicture || userProfile.ProfilePicture
      })

      if (status == 200) {
        console.log("Status ok");

        await getUserprofile(authdata)

        dispatch({
          type: "UPDATE_PROFILE",
          payload: data.ProfilePicture
        })
      }

    } catch (error) {
      console.log(error);
    }
  }

  async function handeldelete(authdata) {
    try {
      const status = await deleteaccount(authdata)
      if (status == 200) {
        dispatch({
          type: "SIGN_OUT"
        })
        toast.info("logout successful", {
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
        router.push("/pages/auth")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserprofile(UserData)
  }, [])
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">

      {/* Profile Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 text-center">

        {/* Profile Image */}
        <img
          src={userProfile.ProfilePicture || "https://via.placeholder.com/200"}
          alt="Profile"
          className="w-40 h-40 mx-auto rounded-md object-cover shadow-md"
        />

        {/* User Info */}
        <h2 className="mt-6 text-2xl font-semibold text-gray-800">
          {userProfile.username}
        </h2>

        <p className="text-gray-500 mt-1">
          {userProfile.email}
        </p>

        {/* Primary Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">

          <button
            className="w-full py-2 rounded-lg bg-blue-600 text-black font-medium hover:bg-blue-700 transition border border-gray-300"
            onClick={() => setProfileModal(true)}
          >
            Update Profile
          </button>

          <button
            className="w-full py-2 rounded-lg bg-gray-700 text-black font-medium hover:bg-gray-400 transition border border-gray-300"
            onClick={() => router.push("/")}
          >
            Go to Home
          </button>

          <button
            className="w-full py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition border border-red-600"
            onClick={() => handeldelete(UserData)}
          >
            Delete Profile
          </button>

          <button
            className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
            onClick={() => {
              Authdispatch({ type: "SIGN_OUT" });
              router.push("/");
            }}
          >
            Log Out
          </button>

        </div>

      </div>

      {/* Update Modal */}
      {ProfileModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">

          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Update Profile
              </h3>

              <button
                onClick={() => setProfileModal(false)}
                className="text-gray-400 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">

              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  Updateprofile(prev => ({ ...prev, username: e.target.value }))
                }
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  Updateprofile(prev => ({ ...prev, email: e.target.value }))
                }
              />

              <input
                type="file"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                onChange={(e) => {
                  const reader = new FileReader();
                  reader.readAsDataURL(e.target.files[0]);
                  reader.onload = (e) =>
                    Updateprofile(prev => ({
                      ...prev,
                      ProfilePicture: e.target.result,
                    }));
                }}
              />

              {Updatedprofile.ProfilePicture && (
                <img
                  src={Updatedprofile.ProfilePicture}
                  alt="Preview"
                  className="w-24 h-24 mx-auto rounded-full object-cover border"
                />
              )}

            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end gap-3">

              <button
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                onClick={() => setProfileModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  handelupdateprofile(AuthData, Updatedprofile);
                  setProfileModal(false);
                }}
              >
                Save
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

