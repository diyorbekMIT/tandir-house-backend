import { ObjectId } from "mongoose";
import { ViewGroup } from "../enums/view.enum";

export interface View {
    _id: ObjectId;
    viewGroup: ViewGroup;
    memberId: ObjectId;
    viewRefId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    
    // Potential additional fields
    duration?: number;       // Time spent viewing
    ipAddress?: string;      // Source IP of the view
    deviceType?: string;     // Type of device used
}

export interface ViewInput {
    memberId: ObjectId;      // ID of the member creating the view
    viewRefId: ObjectId;     // ID of the entity being viewed
    viewGroup: ViewGroup;    // Categorization of the view
}