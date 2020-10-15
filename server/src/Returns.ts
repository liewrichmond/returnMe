import {Document} from "mongoose";

export enum Handler {
    Amazon = "AMAZON",
    UPS = "UPS",
    USPS = "USPS"
}

export enum DeliveryStatus {
    InProgress = "In Progress",
    Complete = "Complete"
}

export interface IReturn extends Document {
    userId: string,
    handler: Handler,
    startDate: Date,
    deliveryDate: Date
    status: DeliveryStatus
}