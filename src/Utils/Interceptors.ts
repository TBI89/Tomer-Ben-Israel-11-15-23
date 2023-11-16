import axios from "axios";

class Interceptors {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    public create(): void {
        axios.interceptors.request.use(requestObj => {
            requestObj.headers["Authorization"] = `Bearer ${this.apiKey}`
            return requestObj;
        });
    }
}

const apiKey = "wTmR0iYDHQ2uxZQlgIOKyLpQBX8tZj38";
const interceptors = new Interceptors(apiKey);
interceptors.create();

export default interceptors;
