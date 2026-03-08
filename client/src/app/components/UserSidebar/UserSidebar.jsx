import { AuthContext } from "@/app/context/AuthContext";
import { MessageContext } from "@/app/context/MessageContext";
import { SidebarContext } from "@/app/context/SidebarContext";
import { useSocket } from "@/Utils/Socket";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { Loading } from "../Chat/Loading";
import '@/app/style.css';

export const UserSidebar = ({ setShowchats }) => {
  const { AuthData } = useContext(AuthContext);
  const { Sidebardispatch, UserSidebarData, getUserForSidebar, SearchedUserForSidebar } = useContext(SidebarContext);
  const { reciverdispatch, msgdispatch, GetMessage, MessageData, } =
    useContext(MessageContext);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [SearchData, SetSearchData] = useState({ searchD: '' })
  const { socket, onlineUsers } = useSocket();
  const [hover, Sethover] = useState()
  const router = useRouter()
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  async function UserForSidebar() {
    try {
      if (AuthData.token !== "") {
        const data = await getUserForSidebar(AuthData);
        if (data) {
          Sidebardispatch({
            type: "Siderbar_Data",
            payload: data,
          });
        }
        setIsDataLoaded(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function GETMESSAGES(authdata, val) {
    try {

      msgdispatch({
        type: "Get_Message",
        payload: "",
      });
      let data = await GetMessage(authdata, val);
      if (data) {
        msgdispatch({
          type: "Get_Message",
          payload: data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  function ReciverDataHandler(authdata, val, id) {
    try {
      Sethover(id)
      reciverdispatch({
        type: "Provider_Data",
        payload: val,
      });

      setShowchats(false)

      GETMESSAGES(authdata, val);
    } catch (error) {
      console.log(error);
    }
  }

  async function SearchUser(authdata, body) {
    try {
      const data = await SearchedUserForSidebar(authdata, body)
      Sidebardispatch({
        type: "Siderbar_Data",
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (SearchData.searchD.trim() !== "") {
      const handler = setTimeout(() => {
        SearchUser(AuthData, SearchData);
      }, 300);

      return () => {
        clearTimeout(handler);
      };
    } else {
      UserForSidebar();
    }
  }, [SearchData]);

  useEffect(() => {
    UserForSidebar();
  }, []);

  if (!mounted) {
    return (
      <div style={{ width: "25%", height: "100vh", backgroundColor: "#0f111a" }} />
    );
  }
  return (
    <div
      className="d-flex flex-column border border-dark"
      style={{
        width: "25%",
        height: "100vh",
        overflowY: "scroll",
        backgroundColor: "#0f111a",
        color: "white",
        scrollbarWidth: "none",
      }}
    >
      <div className="flex flex-col justify-content-between" style={{ padding: "1rem", backgroundColor: "#090e19" }}>
        <div className="flex justify-content-between"><h2 className="text-white font-medium" style={{ color: "#FFFFFF", fontSize: "35px" }}>Chats</h2>
          <img
            src={
              mounted && AuthData?.ProfilePicture
                ? AuthData.ProfilePicture
                : "https://via.placeholder.com/30"
            }
            alt="Profile"
            className="rounded-circle w-12 h-12"
            style={{ marginRight: "1rem", cursor: "pointer" }}
            onClick={() => {
              router.push("/pages/Profile")
            }}
          /></div>

        <div>
          <input
            className="mt-2 w-full p-2 rounded-md text-white border-none focus:outline-white"
            type="text"
            placeholder="Search users..."
            onChange={(e) => SetSearchData({ searchD: e.target.value })}
            style={{ backgroundColor: "black", caretColor: "white" }}
          />
        </div>
      </div>

      <div>
        {!isDataLoaded ?
          <div className="d-flex justify-content-center  align-items-center"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              backgroundColor: "transparent"
            }}>
            <Loading />
          </div>
          :
          (UserSidebarData?.filteredUser || UserSidebarData?.SearchedUser?.length > 0) ? (UserSidebarData?.filteredUser || UserSidebarData?.SearchedUser)?.map((user, id) => (
            <div
              key={id}
              className={`d-flex align-items-center p-3 mt-2 cursor-pointer w-[363px] mb-2 rounded-md
        ${hover === id ? 'bg-gray-800 shadow-lg border-2 border-black' : 'bg'} 
        hover:bg-gray-800 transition duration-300`}
              onClick={() => ReciverDataHandler(AuthData, user, id)}
            >
              <div className="position-relative">
                <img
                  src={
                    mounted && AuthData?.ProfilePicture
                      ? AuthData.ProfilePicture
                      : "https://via.placeholder.com/30"
                  }
                  alt="Profile"
                  className="rounded-circle w-12 h-12"
                  style={{ marginRight: "1rem" }}
                />
                {onlineUsers.includes(user?._id) && (
                  <span
                    className="position-absolute bg-success rounded-circle border border-white"
                    style={{
                      width: "12px",
                      height: "12px",
                      bottom: "0",
                      right: "15px",
                    }}
                  ></span>
                )}
              </div>

              <h4 className="text-white text-xl font-bold">{user.username}</h4>
            </div>
          )) : <p className="text-white text-center mt-4">No users found</p>}
      </div>
    </div>
  );
};
