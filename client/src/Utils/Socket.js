import { AuthContext } from "@/app/context/AuthContext";
import { MessageContext } from "@/app/context/MessageContext";
import { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";

export const useSocket = () => {
  const { AuthData } = useContext(AuthContext); 
  const { msgdispatch, MessageData } = useContext(MessageContext);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (AuthData?.userId!=="") {
      const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8087", {
        query: {
          userId: AuthData.userId,
        },
      });

      setSocket(socketInstance);

      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
      return () => {
        socketInstance.disconnect();
      };
    }
  }, [AuthData?.userId]);

  return { socket, onlineUsers };
};
