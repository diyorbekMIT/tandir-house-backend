import express, {Request, Response} from "express";
import memberController from "./controllers/member.controller";
import restaurantController from "./controllers/restaurant.controller";
import uploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";
const router = express.Router();

router.get("/member/restaurant", memberController.getRestaurant);
router
  .post('/member/login', memberController.login);
router
  .post("/member/signup", memberController.signup);
router.get('/member/detail', memberController.verifyAuth, memberController.getMemberDetail)
router.post("/member/logout", memberController.verifyAuth, memberController.logout)
router.post("/member/update", 
   memberController.verifyAuth, 
   uploader("members").single("memberImage"),
   memberController.updateMember);

   router.get("/member/top-users", memberController.getTopUsers)

//PRODUCTS
router.get("/product/all", productController.getProducts);
router.get("/product/:id", memberController.retrieveAuth, productController.getProduct); 


/** Order */

router.post("/order/create", memberController.verifyAuth,orderController.createOrder);
router.get("/order/all", memberController.verifyAuth, orderController.getMyOrders);


router.post("/order/update", memberController.verifyAuth, orderController.updateOrder)

export default router;

