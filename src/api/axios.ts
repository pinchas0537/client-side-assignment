import axios from "axios";

export const api = axios.create({
  baseURL: "https://server-side-assignment-c9gx.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});
