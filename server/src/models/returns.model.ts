import mongoose, { Schema, Document } from "mongoose"

export enum Handler {
    Amazon = "Amazon",
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

export const ReturnsSchema: Schema<IReturn> = new Schema<IReturn>({
    userId: { type: String, required: true },
    handler: { type: String, required: true },
    startDate: { type: Date, required: true },
    deliveryDate: { type: Date, required: false },
    status: { type: String, required: true }
})
