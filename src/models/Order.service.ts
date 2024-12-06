import OrderItemModel from "../schema/OrderItem.model";
import { Member } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import mongoose, { ObjectId } from "mongoose";
import { OrderStatus } from "../libs/enums/order.enum";
import MemberService from "./Member.service";
import { OrderInquiry, OrderItemInput, OrderUpdateInput } from "../libs/types/order";
import { shapeIntoMongooseObjectId } from "../libs/utils/config";
import { Order } from "../libs/types/order";
import { OrderModel } from "../schema/Order.model";

class OrderService {
    private readonly orderModel;
    private readonly orderItemModel;
    private readonly memberService;

    constructor() {
        this.orderModel = OrderModel;
        this.orderItemModel = OrderItemModel;
        this.memberService = new MemberService();
    }

    public async createOrder(
        member: Member,
        input: OrderItemInput[]
    ): Promise<Order> {
        const memberId = shapeIntoMongooseObjectId(member._id);
        const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
            return accumulator + item.itemPrice * item.itemQuantity;
        }, 0);
        const delivery = amount < 100 ? 5 : 0;

        try {
            const newOrder = await this.orderModel.create({
                orderTotal: amount + delivery,
                orderDelivery: delivery,
                memberId: memberId,
                orderStatus: OrderStatus.PAUSE, // Ensure this matches your enum
            });
            const orderId = newOrder._id;
            await this.recordOrderItem(orderId, input);

            return newOrder.toObject() as Order; // Ensure we return a plain object
        } catch (err) {
            console.log("Error, model:createOrder:", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    private async recordOrderItem(
        orderId: ObjectId,
        input: OrderItemInput[]
    ): Promise<void> {
        const bulkOperations = input.map((item) => ({
            insertOne: {
                document: {
                    ...item,
                    orderId: orderId,
                    productId: shapeIntoMongooseObjectId(item.productId),
                },
            },
        }));

        if (bulkOperations.length > 0) {
            await this.orderItemModel.bulkWrite(bulkOperations);
        }
    }

    public async getMyOrders(member: Member, inquiry: OrderInquiry): Promise<Order[]> {
        const memberId = shapeIntoMongooseObjectId(member._id);
        const matches = { memberId: memberId, orderStatus: inquiry.orderStatus };

        const result = await this.orderModel.aggregate([
            { $match: matches },
            { $sort: { updatedAt: -1 } },
            { $skip: (inquiry.page - 1) * inquiry.limit },
            { $limit: inquiry.limit },
            {
                $lookup: {
                    from: "orderItems",
                    localField: "_id",
                    foreignField: "orderId",
                    as: "orderItems",
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "orderItems.productId",
                    foreignField: "_id",
                    as: "productData",
                },
            },
            {
                $project: {
                    orderTotal: 1,
                    orderDelivery: 1,
                    orderStatus: 1,
                    memberId: 1,
                    orderItems: 1,
                    productData: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]).exec();

        return result;
    }


    public async updateOrder(member: Member, input: OrderUpdateInput): Promise<Order> {
        const memberId = new mongoose.Types.ObjectId(member._id);
        const orderId = new mongoose.Types.ObjectId(input.orderId);
        const orderStatus = input.orderStatus;
    
        console.log("Attempting to update order with:");
        console.log("memberId:", memberId);
        console.log("orderId:", orderId);
        console.log("orderStatus:", orderStatus);
    
        const result = await this.orderModel
            .findOneAndUpdate(
                { memberId: memberId, _id: orderId },
                { orderStatus: orderStatus },
                { new: true }
            )
            .exec();
    
        if (!result) {
            console.log("No matching order found to update.");
            throw new Errors(HttpCode.NOT_FOUND, Message.ORDER_NOT_FOUND); // Custom error
        }
    
        if (orderStatus === OrderStatus.PROCESS) {
            await this.memberService.addUserPoint(member, 1);
        }
    
        return result as Order;
    }
    
}

export default OrderService;
