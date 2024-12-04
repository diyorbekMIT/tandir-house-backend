import Errors, { Message, HttpCode } from "../libs/Errors";
import { View, ViewInput } from "../libs/types/view";
import ViewModel from "../schema/View.model";
import mongoose from 'mongoose';

class ViewService {
    private readonly viewModel;

    constructor() {
        this.viewModel = ViewModel;
    }

    public async checkViewExistence(input: ViewInput): Promise<View | null> {
        const existingView = await this.viewModel
            .findOne({ memberId: input.memberId, viewRefId: input.viewRefId })
            .exec();

        // Convert Mongoose document to plain object if exists
        return existingView ? existingView.toObject() : null;
    }

    public async insertMemberView(input: ViewInput): Promise<View> {
        try {
            // Create the view and immediately convert to a plain object
            const createdView = await this.viewModel.create(input);
            return createdView.toObject();
        } catch (err) {
            console.log("ERROR, model:insertMemberView:", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }
}

export default ViewService;