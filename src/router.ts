import express, {Request, Response} from "express";
import memberController from "./controllers/member.controller";
import restaurantController from "./controllers/restaurant.controller";
const router = express.Router();


router
  .post('/login', memberController.login);
router
  .post("/signup", memberController.signup);

export default router;

