import React, { useContext, useEffect, useRef, useState } from "react";
import { socket, useSocket } from "@/Utils/Socket";
import { MessageContext } from "@/app/context/MessageContext";
import { AuthContext } from "@/app/context/AuthContext";
import { Loading } from "./Loading";
import { Bounce, toast } from "react-toastify";
import "@/app/components/Css/style.css";
import { IoSendOutline } from "react-icons/io5";
import "@/app/style.css";
import EmojiPicker from "emoji-picker-react";

export const Chat = () => {
  const [connected, Setconnected] = useState(false);
  const [Data, SetData] = useState({});
  const {
    SendMessage,
    MessageData,
    reciverData,
    msgdispatch,
    UpdateMsgStatus,
  } = useContext(MessageContext);
  const [loading, Setloading] = useState(true);
  const { AuthData } = useContext(AuthContext);
  const { socket, onlineUsers } = useSocket();
  const [chosenEmoji, setChosenEmoji] = useState(false);
  const [ShowImage, SetShowImage] = useState(false);
  const isUserOnline = onlineUsers.includes(reciverData?._id);
  const reciverIdRef = useRef(reciverData._id);
  // console.log(MessageData.messages);

  async function SendMessageHandler() {
    console.log(Data);
    
    try {
      if (Data.text !== "" && Data.image !== "") {
        const reciverstatus = onlineUsers.includes(reciverIdRef.current);
        if (reciverstatus) {
          Data.MsgStatus = "Received";
        }
        const data = await SendMessage(AuthData, Data);
        msgdispatch({
          type: "Get_Socket_Message",
          payload: data.NewMessage,
        });
        Data.text = "";
      } else {
        alert("Message Field is empty");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // const onEmojiClick = (event, emojiObject) => {
  //   // console.log(emojiObject.srcElement.src);

  //   SetData(prev=>({...prev,text:Data.text+emojiObject}))
  //   console.log(Data);

  // };

  async function MsgStatus(AuthData, body) {
    try {
      const status = await UpdateMsgStatus(AuthData, body);
      // console.log(status);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    reciverIdRef.current = reciverData._id;
  }, [reciverData._id]);

  const lastMsgRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      if (lastMsgRef.current) {
        lastMsgRef.current.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 200);
    MsgStatus(AuthData, {
      sendby: AuthData.userId,
      status: "seen",
      reciveby: reciverIdRef.current,
    });
  }, [MessageData]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (data) => {
        toast.info(`You have New Message From ${data.Name}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          transition: Bounce,
          zIndex: 9999,
        });

        const notification = new Audio("/notification.mp3");
        notification.play();

        if (data.Msg.senderId === reciverIdRef.current) {
          msgdispatch({
            type: "Get_Socket_Message",
            payload: data.Msg,
          });
        }
      });

      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket, msgdispatch]);

  useEffect(() => {
    SetData((prev) => ({ ...prev, reciverId: reciverData._id }));
  }, [reciverData]);

  useEffect(() => {
    if (MessageData.messages) {
      Setloading(false);
    } else {
      Setloading(true);
    }
  }, [MessageData]);

  return (
    <>
      <div
        className="flex flex-col"
        style={{
          width: "80%",
          height: "100vh",
          backgroundColor: "#0b101d",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <section
          className="header d-flex align-items-center"
          style={{
            width: "100%",
            height: "75px",
            backgroundColor: "#090e19",
            padding: "0 1rem",
          }}
        >
          <div
            className="d-flex align-items-center"
            style={{
              borderRadius: "10px",
              cursor: "pointer",
              width: "370px",
            }}
          >
            <img
              src={
                reciverData?.ProfilePicture || "https://via.placeholder.com/30"
              }
              alt="Profile"
              className="rounded-circle w-12 h-12"
              style={{ marginRight: "1rem" }}
            />
            <div>
              <h4
                className="flex flex-col justify-items-center items-center text-white text-xl font-bold"
                style={{ color: "white" }}
              >
                {reciverData?.username}
                <span className="text-white text-sm font-normal">
                  {isUserOnline == true ? "Online" : "Offline"}
                </span>
              </h4>
            </div>
          </div>
        </section>

        {
          <div
            className=""
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              backgroundColor: "#0f172a",
              scrollbarWidth: "none",
            }}
          >
            {loading ? (
              <Loading />
            ) : MessageData.messages !== undefined &&
              MessageData.messages.length > 0 ? (
              MessageData?.messages?.map((ele, i) => {
                const currentDate = new Date(ele.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  }
                );

                const previousDate =
                  i > 0
                    ? new Date(
                        MessageData.messages[i - 1].createdAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      })
                    : null;

                const isNewDay = currentDate !== previousDate;
                return (
                  <div key={i} ref={lastMsgRef}>
                    {isNewDay && (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ color: "white", margin: "10px 0" }}
                      >
                        <p
                          style={{
                            width: "80px",
                            backgroundColor: "rgba(0, 0, 0, 0.28)",
                            borderRadius: "4px",
                            padding: "10px 10px 8px",
                          }}
                        >
                          {currentDate ===
                          new Date().toLocaleDateString("en-US")
                            ? "Today"
                            : currentDate ===
                              new Date(
                                Date.now() - 86400000
                              ).toLocaleDateString("en-US")
                            ? "Yesterday"
                            : currentDate}
                        </p>
                      </div>
                    )}

                    <div
                      className={`d-flex ${
                        ele.senderId === reciverData._id
                          ? "justify-content-start"
                          : "justify-content-end"
                      }`}
                      style={{ padding: "0px 50px 10px 50px" }}
                    >
                      <img
                        src={`${
                          (ele.senderId === reciverData._id
                            ? reciverData.ProfilePicture
                            : AuthData.ProfilePicture) ||
                          "https://via.placeholder.com/30"
                        }`}
                        alt="Profile"
                        className="rounded-circle w-12 h-12"
                        style={{ marginRight: "1rem" }}
                      />

                      <div
                        className="flex flex-col items-start"
                        style={{
                          color: "white",
                          padding: "10px 10px 0px",
                          borderRadius: "12px",
                          maxWidth: "350px",
                          fontFamily: "'Roboto', sans-serif",
                          wordBreak: "break-word",
                          alignSelf:
                            ele.senderId === reciverData._id
                              ? "flex-end"
                              : "flex-start",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                          backgroundColor:
                            ele.senderId === reciverData._id
                              ? "#b87fed"
                              : "#5f9fe0",
                        }}
                      >
                        {ele.image && (
                          <img
                            src={ele.image}
                            alt="Sent"
                            className="rounded"
                            style={{
                              maxWidth: "300px",
                              borderRadius: "8px",
                              marginBottom: "5px",
                            }}
                          />
                        )}

                        {ele.text && (
                          <p
                            style={{
                              fontSize: "18px",
                              margin: 0,
                              lineHeight: "1.5",
                            }}
                          >
                            {ele.text}
                          </p>
                        )}

                        <div className="flex self-end">
                          <span
                            className="ms-5 text-muted"
                            style={{
                              fontSize: "10px",
                              alignSelf: "flex-end",
                            }}
                          >
                            {new Date(ele.createdAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </span>
                          <span className="ms-2">
                            {ele.senderId !== reciverData._id ? (
                              ele.MsgStatus === "Received" ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-check2-all"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0" />
                                  <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708" />
                                </svg>
                              ) : ele.MsgStatus === "seen" ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="blue"
                                  className="bi bi-check2-all"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0" />
                                  <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-check-lg"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                </svg>
                              )
                            ) : (
                              ""
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <h1 className="text-gray-700 font-medium text-center text-4xl">{`Start Chatting With ${reciverData?.username}`}</h1>
            )}
          </div>
        }

        <section
          className="card-footer d-flex align-items-center justify-content-evenly"
          style={{
            width: "100%",
            height: "50px",
            backgroundColor: "#1F1F1F",
          }}
        >
          {/* {chosenEmoji && (
            <div
              style={{ position: "absolute", bottom: "70px", zIndex: "1000" }}
            >
              <EmojiPicker />
              <button
                style={{
                  marginTop: "10px",
                  padding: "5px 10px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
                onClick={() => {
                  setChosenEmoji(false);
                }}
              >
                Close
              </button>
            </div>
          )} */}

          <div className=" cursor-pointer w-10 h-11 d-flex align-items-center justify-content-center rounded-sm  hover:bg-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="white"
              className="bi bi-emoji-smile"
              viewBox="0 0 16 16"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setChosenEmoji(true);
              }}
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
            </svg>
          </div>
          <div className=" cursor-pointer w-10 h-11 d-flex align-items-center justify-content-center rounded-sm  hover:bg-black">
            <label htmlFor="file-upload" className="custom-file-upload">
              <svg
              style={{cursor:"pointer"}}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="18"
                fill="white"
                className="bi bi-paperclip"
                viewBox="0 0 16 16"
              >
                <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z" />
              </svg>
            </label>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files.length > 0) {
                const fileReader = new FileReader();
                fileReader.onload = (event) =>
                  SetData((prev) => ({ ...prev, image: event.target.result }));
                fileReader.readAsDataURL(e.target.files[0]);
                SetShowImage(true);
              }
            }}
          />
          {ShowImage && (
             <div
             style={{
               position: "absolute",
               bottom: "60px",
               left: "35%",
               transform: "translateX(-50%)",
               backgroundColor: "#202c33",
               padding: "10px",
               borderRadius: "10px",
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
               boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
             }}
           >
             <img
               src={Data.image}
               alt="Sent"
               style={{
                 maxWidth: "250px",
                 borderRadius: "8px",
               }}
             />
              <textarea
            className="bg-neutral-800 mt-2 hover:bg-neutral-700"
            value={Data.text}
            placeholder="Caption (Optional)"
            style={{
              width: "100%",
              height: "40px",
              paddingLeft: "20px",
              paddingTop: "8px",
              color: "white",
              scrollbarWidth: "none",
              border: "none",
              outline: "none",
            }}
            onChange={(e) => {
              SetData((prev) => ({ ...prev, text: e.target.value }));
              
            }}
          ></textarea>
             <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginTop: "5px" }}>
               <button
                 style={{
                   padding: "6px 12px",
                   backgroundColor: "#ff3b30",
                   color: "white",
                   border: "none",
                   cursor: "pointer",
                   borderRadius: "5px",
                   display: "flex",
                   alignItems: "center",
                   gap: "5px",
                 }}
                 onClick={() => {
                   SetData((prev) => ({ ...prev, image: "" }));
                   SetShowImage(false);
                 }}
               >
                  Cancel
               </button>
               <IoSendOutline
            className="d-flex justify-content-center align-items-center"
            style={{
              color: "white",
              fontSize: "24px",
              cursor: "pointer",
              width: "50px",
              height: "35px",
              borderRadius: "8px",
              transition: "background-color 0.3s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.65)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "scale(1)";
            }}
            onClick={()=>{
              SendMessageHandler()
              SetShowImage(false)
            }}
          />
             </div>
           </div>
          )}
          <textarea
            className="bg-neutral-800 hover:bg-neutral-700"
            value={Data.text}
            placeholder="Type a message"
            style={{
              width: "80%",
              height: "40px",
              // backgroundColor: "#1F1F1F",
              paddingLeft: "20px",
              paddingTop: "8px",
              color: "white",
              scrollbarWidth: "none",
              border: "none",
              outline: "none",
            }}
            onChange={(e) => {
              SetData((prev) => ({ ...prev, text: e.target.value }));
            }}
          ></textarea>
          <IoSendOutline
            className="d-flex justify-content-center align-items-center"
            style={{
              color: "white",
              fontSize: "24px",
              cursor: "pointer",
              width: "50px",
              height: "35px",
              borderRadius: "8px",
              transition: "background-color 0.3s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.65)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "scale(1)";
            }}
            onClick={SendMessageHandler}
          />
        </section>
      </div>
    </>
  );
};
