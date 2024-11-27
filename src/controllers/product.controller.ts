import ProductService from "../models/Product.service";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import express, { Request, Response } from "express";
import { AdminRequest } from "../libs/types/member";
import { ProductInput } from "../libs/types/product";

const productService = new ProductService;

const productController: T = {};

productController.getAllProducts = async (req: Request, res: Response) => {
    try {
        console.log("getAllProducts")
        res.render("products")
    } catch(err) {
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)
    }
        
}

productController.createNewProduct = async (req: AdminRequest, res: Response) => {
    try {
        console.log("createNewProduct");

        if (!req.files.length) throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED)

        const data: ProductInput = req.body;
        data.productImages = req.files.map(ele => {
            return ele.path;
        });

        await productService.createNewProduct(data);

        res.send(`
        <script>
          alert('Successful Creation');
          window.location.href = '/admin/product/all';
        </script>
      `);
          } catch(err) {
            res.send(`
            <script>
              alert('Creation Failed');
              window.location.href = '/admin/product/all';
            </script>
          `);
          


    }
        
}

productController.updateChoosenProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        
        const result = await productService.updateChoosenProduct(id, req.body);
        console.log("updateChoosenProduct")
        console.log("req.body", req.body)
        res.status(HttpCode.OK).json({data : result});
    } catch(err) {
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)
    }
        
}


productController.getAllProducts = async (req: AdminRequest, res: Response) => {
    try{
        console.log("getAllProducts");

       const data =  await productService.getAllProducts();

       res.render("products",{products: data});

    } catch(err){
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)
    }

}

export default productController;