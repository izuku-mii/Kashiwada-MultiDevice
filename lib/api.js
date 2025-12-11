import axios from "axios";

const api = new axios.create({
    baseURL: global?.apikey?.izumi,
    timeout: 15000,
    headers: {
       "Accept": "application/json",
       "Content-Type": "application/json"
    }
});

export default api;
