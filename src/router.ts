import express, {Request, Response} from "express";
import memberController from "./controllers/member.controller";
import restaurantController from "./controllers/restaurant.controller";
import uploader from "./libs/utils/uploader";
const router = express.Router();


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

export default router;

