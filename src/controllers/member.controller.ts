import { T } from "../libs/types/common";
import express, { Request, Response } from "express";
import MemberService from "../models/Member.service"
import { LoginInput, Member } from "../libs/types/member";
import { MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors from "../libs/Errors";

const memberService =  new MemberService();
const memberController: T = {};


memberController.login = async (req: Request, res: Response) => {
   try {
      const input: LoginInput = req.body;
   
      const result: Member =  await memberService.login(input);
     console.log("login");
      res.json({member: result});
   } catch(err) {
      console.log("login", err);
      ///res.json();
   }
}

memberController.signup = async (req: Request, res: Response) => {
   try {
     console.log("signup");
     const input: MemberInput = req.body, 
        result =  await memberService.signup(input);
     console.log(result);
     res.json({member: result});
   } catch(err) {
      console.log("signup", err);
      if (err instanceof Errors) res.status(err.code).json(err);
      else res.status(Errors.standard.code).json(Errors.standard)
   }
   
}
export default memberController;