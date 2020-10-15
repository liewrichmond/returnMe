import axios, { AxiosResponse } from "axios"

export enum Handler {
    Amazon = "Amazon",
    UPS = "UPS",
    USPS = "USPS"
}

export enum DeliveryStatus {
    InProgress = "In Progress",
    Complete = "Complete"
}


export interface IReturn {
    userId: string,
    handler: Handler,
    startDate: Date,
    status: DeliveryStatus
    deliveryDate?: Date,
    _id?: string,
}

export class Controller {
    public async getReturns(userId: string): Promise<IReturn[]> {
        const response: AxiosResponse<IReturn[]> = await axios.get(`/returns/user/${userId}`)
        return response.data
    }

    public async createReturn(newReturn: IReturn): Promise<string> {
        const response: AxiosResponse<string> = await axios.put(`/returns/user/${newReturn.userId}`, newReturn);
        return response.data
    }
    
    public async deleteReturn(toBeRemoved: IReturn): Promise<void> {
        await axios.delete(`/user/${toBeRemoved.userId}/returns/${toBeRemoved._id}`)
    }
}
