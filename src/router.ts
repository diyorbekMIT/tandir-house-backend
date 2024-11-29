import express, {Request, Response} from "express";
import memberController from "./controllers/member.controller";
import restaurantController from "./controllers/restaurant.controller";
const router = express.Router();


router
  .post('/member/login', memberController.login);
router
  .post("/member/signup", memberController.signup);
router.get('/member/detail', memberController.verifyAuth, memberController.getMemberDetail)
router.post("/member/logout", memberController.verifyAuth, memberController.logout)

export default router;

