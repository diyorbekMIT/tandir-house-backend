import ProductModel from "../schema/Product.model";
import { Product, ProductInput, ProductUpdateInput } from "../libs/types/product";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { shapeIntoMongooseObjectId } from "../libs/utils/config";
import { ProductStatus } from "../libs/enums/product.enum";

class ProductService {
    private readonly productModel;

    constructor() {
      this.productModel = ProductModel;
    }

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