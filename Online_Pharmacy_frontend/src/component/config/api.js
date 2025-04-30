import axios from "axios"

export const API_URL="http://localhost:5454"

//export const API_URL="https://fastmeds-online.onrender.com"

export const api=axios.create({
    baseURL:API_URL,
    headers:{
        "Content-Type":"application/json"
    }
})