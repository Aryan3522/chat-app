import axios from "axios";
import { useContext } from "react";
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8087";
const API = axios.create({ baseURL: baseURL });

export { axios, API, baseURL };
