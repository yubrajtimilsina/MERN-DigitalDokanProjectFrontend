import axios from "axios";

export const API = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

export const APIWITHTOKEN = axios.create({
    baseURL: "http://localhost:3000/api", 
    headers: {
        "Content-Type": "application/json", 
        "Accept": "application/json", 
        "Authorization": localStorage.getItem("token") || "" // Ensure it's a string
    }
});
