import express, {Request, Response} from "express";
import memberController from "./controllers/member.controller";
import restaurantController from "./controllers/restaurant.controller";
import makeUploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
const routerAdmin = express.Router();


routerAdmin.get('/', restaurantController.goHome); //EJS
routerAdmin
  .get('/login', restaurantController.getLogin)
  .post('/login', restaurantController.processLogin);
routerAdmin
  .get('/signup', restaurantController.getSignup)
  .post("/signup",makeUploader("members").single("memberImage") , restaurantController.processSignup);

routerAdmin.get('/check-auth', restaurantController.checkAuth);

routerAdmin.get('/logout', restaurantController.logout);

//PRODUCT

routerAdmin.get("/product/all", restaurantController.verifyRestaurant,
     productController.getAllProducts);

     routerAdmin.post('/product/create',
     restaurantController.verifyRestaurant,
     makeUploader('products').array('productImages', 5),
     productController.createNewProduct);
 
 routerAdmin.post("/product/:id",
          restaurantController.verifyRestaurant, 
          productController.updateChoosenProduct);

//USERS

routerAdmin.get("/user/all",restaurantController.verifyRestaurant, restaurantController.getUsers);

routerAdmin.post("/user/edit", restaurantController.verifyRestaurant, restaurantController.updateChoosenUser);


export default routerAdmin;

