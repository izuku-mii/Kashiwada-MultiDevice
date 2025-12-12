import axios from "axios";

const api = new axios.create({
    baseURL: global?.apikey?.izumi,
    headers: {
       "Accept-Encoding": "gzip, deflate, br",
       "Accept": "application/json",
       "referer": global?.apikey?.izumi,
       "Content-Type": "application/json"
    }
});

export default api;
