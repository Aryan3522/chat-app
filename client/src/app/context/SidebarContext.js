"use client"

let SidebarData = {}

import { API, baseURL } from "@/Utils/Utils";
import { createContext, useReducer } from "react"

export const SidebarContext = createContext()

async function getUserForSidebar(authData) {
    try {
        API.interceptors.request.clear();
        API.interceptors.request.use((req)=>{
            req.headers.authorization = `bearer ${authData.token}`
            return req
        })
        const responce = await API.get(`${baseURL}/auth/getUsers`)
        return responce?.data
    } catch (error) {
        console.log(error);
    }
}

async function SearchedUserForSidebar(authData,body) {
    try {
        API.interceptors.request.clear()
        API.interceptors.request.use((req)=>{
            req.headers.authorization = `bearer ${authData.token}`
            return req
        })

        const responce = await API.get(`${baseURL}/search/searchuser`,{
            params:{username:body.searchD}
        })
        return responce?.data
    } catch (error) {
        console.log(error);
    }
}

function reducer(state,action){
    switch (action.type) {
        case "Siderbar_Data":
         let SidebarState = {...action.payload} 
         return SidebarState
        default:
          state;
    }
}

export const SiderbarProvider = ({children})=>{
    const [state,Sidebardispatch] = useReducer(reducer,SidebarData)

    return(
        <SidebarContext.Provider value={{UserSidebarData:state,Sidebardispatch,getUserForSidebar,SearchedUserForSidebar}}>
            {children}
        </SidebarContext.Provider>
    )
}