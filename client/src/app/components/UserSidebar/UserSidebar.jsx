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
      <div style={{ width: "25%", height: "100vh", backgroundColor: "#0f111a" }} >Please try again!</div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "fit-content",
        minWidth: "15%",
        maxWidth: "25%",
        height: "100vh",
        overflowY: "scroll",
        overflowX: "hidden",
        backgroundColor: "#0f111a",
        color: "white",
        scrollbarWidth: "none",
        borderRight: "1px solid #1e2235",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#090e19",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 500, margin: 0 }}>
            Chats
          </h2>
          <img
            src={
              mounted && AuthData?.ProfilePicture
                ? AuthData.ProfilePicture
                : "https://api.dicebear.com/7.x/thumbs/svg?seed=default"
            }
            alt="Profile"
            style={{
              width: "48px",
              height: "48px",
              minWidth: "48px",
              minHeight: "48px",
              borderRadius: "50%",
              objectFit: "cover",
              cursor: "pointer",
              backgroundColor: "#1e2235",
              border: "1px solid #2a3050",
            }}
            onClick={() => router.push("/pages/profile")}
          />
        </div>

        <input
          type="text"
          placeholder="Search users..."
          onChange={(e) => SetSearchData({ searchD: e.target.value })}
          style={{
            marginTop: "0.75rem",
            width: "100%",
            padding: "0.5rem 0.75rem",
            borderRadius: "6px",
            backgroundColor: "#0a0c15",
            border: "1px solid #1e2235",
            color: "white",
            caretColor: "white",
            outline: "none",
            boxSizing: "border-box",
            fontSize: "14px",
          }}
        />
      </div>

      {/* User List */}
      <div style={{ padding: "0.5rem 0.75rem", flexGrow: 1 }}>
        {!isDataLoaded ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "2rem 0" }}>
            <Loading />
          </div>
        ) : (UserSidebarData?.filteredUser || UserSidebarData?.SearchedUser?.length > 0) ? (
          (UserSidebarData?.filteredUser || UserSidebarData?.SearchedUser)?.map((user, id) => (
            <div
              key={id}
              onClick={() => ReciverDataHandler(AuthData, user, id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.6rem 0.75rem",
                marginBottom: "0.4rem",
                borderRadius: "8px",
                border: "1px solid #f5f5f510",
                cursor: "pointer",
                backgroundColor: hover === id ? "#1a1f2e" : "transparent",
                transition: "background-color 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1a1f2e"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = hover === id ? "#1a1f2e" : "transparent"}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <img
                  src={
                    mounted && user?.ProfilePicture
                      ? user.ProfilePicture
                      : "https://via.placeholder.com/40"
                  }
                  alt="Profile"
                  style={{ width: 40, height: 40, borderRadius: "50%", display: "block", backgroundColor: "#f5f5f540" }}
                />
                {onlineUsers.includes(user?._id) && (
                  <span
                    style={{
                      position: "absolute",
                      width: 10,
                      height: 10,
                      backgroundColor: "#22c55e",
                      borderRadius: "50%",
                      border: "2px solid #0f111a",
                      bottom: 0,
                      right: 0,
                    }}
                  />
                )}
              </div>
              <span style={{ color: "white", fontSize: "15px", fontWeight: 600 }}>
                {user.username}
              </span>
            </div>
          ))
        ) : (
          <p style={{ color: "#aaa", textAlign: "center", marginTop: "2rem", fontSize: "14px" }}>
            No users found
          </p>
        )}
      </div>
    </div>
  );
};
