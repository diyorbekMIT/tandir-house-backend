import { T } from "../libs/types/common";
import express, { NextFunction, Request, Response } from "express";
import MemberService from "../models/Member.service"
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import { InputType } from "zlib";
import Errors, { HttpCode, Message } from "../libs/Errors";

const memberService =  new MemberService();
const restaurantController: T = {};

restaurantController.goHome = (req: Request, res: Response) => {
    try {
      console.log("goHome");
       res.render("home")
    } catch(err) {
       console.log("getSignup", err)
    }
    
}

restaurantController.getLogin = (req: Request, res: Response) => {
    try {
      console.log("getLogin");
       res.render("login")
    } catch(err) {
       console.log("getLogin", err)
    }
    
}

restaurantController.getSignup = (req: Request, res: Response) => {
   try {
     console.log("getSignup");
      res.render("signup")
   } catch(err) {
      console.log("getSignup", err)
   }
   
}


restaurantController.processSignup = async (req: AdminRequest, res: Response) => {
	try {
		console.log("processSignup!");
        const file = req.file;
        if (!file) throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);
        
		const newMember: MemberInput = req.body;
        newMember.memberImage = file?.path;
		newMember.memberType = MemberType.RESTAURTANT;

		const memberService = new MemberService();
		const result = await memberService.processSignup(newMember);
  
        req.session.member = result;
        req.session.save(function() {
           res.redirect("/admin/product/all")
        });

        
    } catch (err) {
        console.log("Error, processLogin", err);
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(
            `<script> alert("${message}"); window.location.replace('/admin/signup') </script>`
        );
	}
};



restaurantController.processLogin = async (req: AdminRequest, res: Response) => {
   try {
      const newMember: LoginInput = req.body;
      const result =  await memberService.processLogin(newMember);
     console.log("processLogin");

     req.session.member = result;
     req.session.save(function () {
      res.redirect("/admin/product/all")
     })
   } catch(err) {
      console.log("processLogin", err);
      const message = err instanceof Errors ? err.message : Message.NO_MEMBER_NICK;
      res.send(
          `<script> alert("${message}"); window.location.replace('/admin/login') </script>`
      );
   }
}

restaurantController.checkAuth = async (req: AdminRequest, res: Response) => {
   try {
     if(req.session?.member) res.send(`   Hi ${req.session.member.memberNick}`)
     else res.send(Message.NOT_AUTHENTICATED);
   } catch(err) {
      console.log("processLogin", err);
      res.send(err);
   }
}

restaurantController.logout = async (req: AdminRequest, res: Response) => {
   try {
      console.log("logout");
      req.session.destroy(function() {
      res.redirect("/admin")
     })
   } catch(err) {
      console.log("errorLogout", err);
      res.send(err);
   }
}


restaurantController.getUsers = async (req: AdminRequest, res: Response) => {
   try {
     console.log("getUsers");

     const data = await memberService.getUsers();

      res.render("users", { users: data });
   } catch(err) {
      console.log("getUsers", err)
   }
   
}

restaurantController.updateChoosenUser = async (req: AdminRequest, res: Response) => {
   try {
      console.log("updateChoosenUers");
      
 
      const data = await memberService.updateChoosenUser(req.body);
 
       res.status(HttpCode.OK).json({data: data})
    } catch(err) {
       console.log("getUsers", err);
       res.send(err);
    }
    
}



restaurantController.verifyRestaurant = (req: AdminRequest, res: Response, next: NextFunction) => {
   if (req.session?.member?.memberType === MemberType.RESTAURTANT){
       req.member = req.session.member;
       next();
   }
   else {
   const message = Message.NOT_AUTHENTICATED;
       res.send(`<script> alert("${message}"); window.location.replace('/admin/login');</script>`);
   }
}



export default restaurantController ;