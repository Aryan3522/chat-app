"use client"

import { socket } from "@/Utils/Socket"
import { API, baseURL } from "@/Utils/Utils"
import { Children, createContext, useReducer } from "react"

let reciverData = {}
let MessageData = {};

export const MessageContext = createContext()

async function SendMessage(authData,body) {
    try {
        API.interceptors.request.clear();
        API.interceptors.request.use((req)=>{
            req.headers.authorization = `bearer ${authData.token}`
            return req
        })
        const responce = await API.post(`${baseURL}/message/SendMessage/${body.reciverId}`,body)
    return responce?.data
    } catch (error) {
        console.log(error);
    }
}

async function GetMessage(authData,body) {
    try {
        API.interceptors.request.clear();
        API.interceptors.request.use((req)=>{
            req.headers.authorization = `bearer ${authData.token}`
            return req
        })
        const responce = await API.get(`${baseURL}/message/GetMessage/${body._id}`,body)
    return responce?.data
    } catch (error) {
        console.log(error);
    }
}

async function UpdateMsgStatus(authData,body) {
    try {
        API.interceptors.request.clear();
        API.interceptors.request.use((req)=>{
            req.headers.authorization = `bearer ${authData.token}`
            return req
        })
        const responce = await API.put(`${baseURL}/message/UpdateMsgStatus`,body)
        return responce?.status
    } catch (error) {
        console.log(error);
    }
}

function reducer(state,action){
    switch (action.type) {
        case "Provider_Data":
            let NewState = {...action.payload}
            return NewState
        default:
            state;
    }
}

function msgreducer(msgstate, action) {
    switch (action.type) {
      case "Get_Message":
        let newState = {...action.payload}
        return newState

        case "Get_Socket_Message":
        return {
            ...msgstate,
            messages: [
              ...(msgstate.messages || []), 
              action.payload,
            ],
          };
      default:
        return msgstate;
    }
  }
  

export const MessageProvider =({children})=>{
   const [state,reciverdispatch] = useReducer(reducer,reciverData)
   const [msgstate,msgdispatch] = useReducer(msgreducer,MessageData)
    return(
        <MessageContext.Provider value={{SendMessage,GetMessage,reciverdispatch,reciverData:state,MessageData:msgstate,msgdispatch,UpdateMsgStatus}}>
            {children}
        </MessageContext.Provider>
    )
}