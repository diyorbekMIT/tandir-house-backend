import mongoose from "mongoose";
import { Order } from "../libs/types/order";

const OrderSchema = new mongoose.Schema(
    {
        orderTotal: { type: Number, required: true },
        orderDelivery: { type: Number, required: true },
        orderStatus: { type: String, default: 'Pending' },
        memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
        orderItems: [
            {
                itemPrice: { type: Number, required: true },
                itemQuantity: { type: Number, required: true },
            },
        ],
        productData: [{ type: mongoose.Schema.Types.Mixed }],
    },
    { timestamps: true }
);

export const OrderModel = mongoose.model<Order>('Order', OrderSchema);
