"use client";

import { API, baseURL } from "@/Utils/Utils";
import axios from "axios";

let initialState = {};

if (typeof window !== "undefined") {
  initialState = JSON.parse(localStorage.getItem("UserData")) || {
    token: "",
    userId: "",
  };
} else {
  initialState = {
    token: "",
    userId: "",
  };
}

const { createContext, useReducer } = require("react");

async function UserSignUp(body) {
  try {
    const response = await API.post(`${baseURL}/auth/signup`, body);

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.log(error);

    return {
      status: error?.response?.status,
      data: error?.response?.data,
    };
  }
}

async function UserSignIn(body) {
  try {
    const response = await API.post(`${baseURL}/auth/signin`, body);

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.log(error);

    return {
      status: error?.response?.status,
      data: error?.response?.data,
    };
  }
}

async function getprofile(authData) {
  try {
    const response = await API.get(
      `${baseURL}/profile/getprofile/${authData.userId}`,
    );
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}

async function findAccount(body) {
  try {
    const response = await API.get(`${baseURL}/auth/FindAccount/${body.email}`);
    return response?.data;
  } catch (error) {
    console.log(error);
    return error?.response?.status;
  }
}

async function SENDOTP(body) {
  try {
    const response = await API.post(`${baseURL}/otp/sentOTP`, body);
    return response?.data;
  } catch (error) {
    console.log(error);
    return error?.response?.status;
  }
}

async function VERIFYOTP(body) {
  try {
    const response = await API.post(`${baseURL}/otp/verifyOTP`, body);
    return response?.data;
  } catch (error) {
    console.log(error);
    return error?.response?.status;
  }
}

async function PasswordUpdate(body) {
  try {
    const response = await API.put(`${baseURL}/profile/updatepassword/`, body);
    return response?.status;
  } catch (error) {
    console.log(error);
  }
}

async function deleteaccount(authData) {
  try {
    const response = await API.delete(
      `${baseURL}/profile/deleteprofile/${authData.userId}`,
    );
    return response?.status;
  } catch (error) {
    console.log(error);
  }
}

async function profileupdate(authData, body) {
  try {
    const response = await API.put(
      `${baseURL}/profile/updateprofile/${authData.userId}`,
      body,
    );
    return response?.status;
  } catch (error) {
    console.log(error);
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "SIGN_IN":
      const singinState = { ...action.payload };
      localStorage.setItem("UserData", JSON.stringify(singinState));
      return singinState;

    case "UPDATE_PROFILE":
      const updatedState = { ...state, profilepic: action.payload };
      localStorage.setItem("UserData", JSON.stringify(updatedState));
      return updatedState;

    case "SIGN_OUT":
      const signoutstate = { token: "", userId: "" };
      localStorage.setItem("UserData", JSON.stringify(signoutstate));
      return signoutstate;

    default:
      state;
  }
}

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, Authdispatch] = useReducer(reducer, initialState);
  return (
    <AuthContext.Provider
      value={{
        AuthData: state,
        Authdispatch,
        UserSignUp,
        UserSignIn,
        getprofile,
        deleteaccount,
        profileupdate,
        findAccount,
        SENDOTP,
        VERIFYOTP,
        PasswordUpdate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
