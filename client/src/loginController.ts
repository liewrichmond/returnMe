import axios, { AxiosResponse, AxiosError } from "axios"

interface SerializedUser {
    id:string
}

export interface User {
    username: string,
    password: string,
    name?: ""
}

export class Controller {
    public async login(username: string, password: string): Promise<boolean> {
        const data = {
            username: username,
            password: password
        }
        return axios.post("/api/login", data).then((res: AxiosResponse<string>) => {
            return true
        }).catch((err: AxiosError<string>) => {
            return false
        })
    }

    public async logOut(): Promise<void> {
        return axios.post("/api/logout")
    }

    public async getUser(): Promise<string> {
        const response: AxiosResponse<SerializedUser> = await axios.get("/api/users")
        return response.data.id
    }

    public async createUser(user: User): Promise<boolean> {
        return axios.post("/api/signup", user).then((res: AxiosResponse<string>) => {
            return true
        }).catch((error: AxiosError<string>) => {
            return false
        })
    }
}