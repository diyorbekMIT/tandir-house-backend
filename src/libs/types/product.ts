import { ProductCollection, ProductSize, ProductStatus, ProductVolume } from "../enums/product.enum";
import {ObjectId} from "mongoose";

export interface Product {
    _id: ObjectId;
    productStatus: ProductStatus;
    productCollection: ProductCollection;
    productName: string;
    productPrice: number;
    productLeftCount: number;
    productSize : ProductSize;
    productVolume?:ProductVolume;
    productDesc: String;
    productImages: string[];
    productViews: number;
    createdAt: Date;
    updatedAt: Date;

}

export interface ProductInput {
    productStatus?: ProductStatus;
    productCollection: ProductCollection;
    productName: string;
    productPrice: number;
    productLeftCount: number;
    productSize?: ProductSize;
    productVolume?:ProductVolume;
    productDesc: String;
    productImages?: string[];
    productViews?: number;

}

export interface ProductUpdateInput {
    productStatus?: ProductSize;
    productCollection?: ProductCollection;
    productName?: string;
    productPrice?: number;
    productLeftCount?: number;
    productSize?: ProductSize;
    productVolume?:ProductVolume;
    productDesc?: String;
    productImages?: string[];
    productViews?: number;

}

export interface ProductInquiry {
    order: string;
    page: number;
    limit: number;
    productCollection?: ProductCollection;
    search?: string;

} 