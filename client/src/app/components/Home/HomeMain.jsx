import React, { useContext, useEffect, useState } from 'react'
import { UserSidebar } from '../UserSidebar/UserSidebar'
import { Chat } from '../Chat/Chat'
import { AuthContext } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { io } from 'socket.io-client'
import { MessageContext } from '@/app/context/MessageContext'
import { useSocket } from '@/Utils/Socket'

export const HomeMain = () => {
  const {AuthData} = useContext(AuthContext)
  const {SendMessage,MessageData,reciverData,UpdateMsgStatus} = useContext(MessageContext)
  const [Showchats,setShowchats] = useState(true)
  const router = useRouter()  
  useSocket()
  useEffect(()=>{
    if(!AuthData.token){
      router.push("/pages/Auth")
    }

  },[AuthData])

    async function MsgStatus(AuthData,body) {
        try {
          if(AuthData.token!==""){
            const status = await UpdateMsgStatus(AuthData,body)
          }
          
        } catch (error) {
          console.log(error);
        }
      }
      
      useEffect(()=>{
          MsgStatus(AuthData,{sendby:AuthData.userId,status:"Received"})
      },[])

  return (
   <>
   <div className='d-flex'>
   <UserSidebar setShowchats={setShowchats}/>
   {Showchats?<div
   className="d-flex flex-column"
   style={{ width: "80%", height: "100vh", backgroundColor: "#121212" }}
 ></div>:<Chat/>}
   </div>
   </>
  )
}
