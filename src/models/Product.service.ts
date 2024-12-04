import ProductModel from "../schema/Product.model";
import { Product, ProductInput, ProductInquiry, ProductUpdateInput } from "../libs/types/product";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { shapeIntoMongooseObjectId } from "../libs/utils/config";
import { ProductStatus } from "../libs/enums/product.enum";
import { T } from "../libs/types/common";
import { ObjectId, Types } from "mongoose";

class ProductService {
    private readonly productModel;

    constructor() {
      this.productModel = ProductModel;
    } 

    /* SPA */

    public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
      console.log("inquiry",inquiry);
      
      const match: T = {productStatus: ProductStatus.PROCESS};

      if(inquiry.productCollection) match.productCollection = inquiry.productCollection;

      if(inquiry.search) match.productName = { $regex: new RegExp(inquiry.search, "i")};

      const sort: T = 
          inquiry.order === "productPrice"
           ?{[inquiry.order]: 1}
           :{[inquiry.order]: -1};

      const result = await this.productModel.aggregate([
          
            {$match: match}, 
            {$sort: sort},
            {$skip: (inquiry.page * 1 - 1) * inquiry.limit},
            {$limit: inquiry.limit * 1}
          
      ]).exec();
      if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
      
      return result;
  }

  // Update service method signature
public async getProduct(memberId: string | Types.ObjectId | null, id: string): Promise<Product> {
  const productId = shapeIntoMongooseObjectId(id);
  
  let result = await this.productModel.findOne({
      _id: productId,
      productStatus: ProductStatus.PROCESS,
      ...(memberId ? { memberId } : {}) // Optional member filtering
  }).exec();

  if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

  return result.toObject() as Product;
}



    /*SSR */

    public async createNewProduct(input: ProductInput): Promise<Product> {
        try {
            const createdProduct = (await this.productModel.create(input));

            const result: Product = createdProduct.toObject()
            return result;
        } catch (err) {
            console.error("Error, model:createNewProduct:", err); 
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    public async updateChoosenProduct(id: string, input: ProductUpdateInput): Promise<Product> {
      id = shapeIntoMongooseObjectId(id);
      const result = await this.productModel.findOneAndUpdate({_id: id}, input, {new: true}).exec();

      if(!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

      console.log("Result", input);

      return result.toObject();
      
  }

    public async getAllProducts(): Promise<Product[]> {

      const result = await this.productModel.find().exec();
      if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

      return result as unknown as Product[];
    }

}


export default ProductService;