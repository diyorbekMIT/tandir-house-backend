import MemberModel from "../schema/Member.model";
import { LoginInput, Member, MemberInput, MemberUpdateInput } from "../libs/types/member";
import Errors, { HttpCode } from "../libs/Errors";
import { Message } from "../libs/Errors";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import * as bcrypt from "bcryptjs"
import { shapeIntoMongooseObjectId } from "../libs/utils/config";

class MemberService {
    private readonly memberModel;
    constructor( ) {
        this.memberModel = MemberModel;
    }

    /** SPA */

    public async signup(input: MemberInput): Promise<Member> {
          const salt = await bcrypt.genSalt();
          input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
    
        try {
            const result = await this.memberModel.create(input);
            result.memberPassword = "";
            return result.toJSON() as Member;
        } catch (err) {
            console.log("ERROR, model:signup", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }


    public async login(input: LoginInput): Promise<Member> {
        const member = await this.memberModel
          .findOne({memberNick: input.memberNick,
            memberStatus:{ $ne: MemberStatus.DELETE}}, {memberNick: 1, memberStatus: 1, memberPassword: 1})
          .exec();
        if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

        else if (member.memberStatus === MemberStatus.BLOCKED) {
            throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER);
        }

        const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);

        if (!isMatch) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
        }
        return await this.memberModel.findById(member._id).lean().exec() as Member;
    }



    /** SSR */
    public async processSignup(input: MemberInput): Promise<Member> {
        const exist = await this.memberModel.findOne({ memberType: MemberType.RESTAURTANT }).exec();

        if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

        const salt = await bcrypt.genSalt();
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

        try {
            const result = await this.memberModel.create(input);
            return result;
        } catch (err) {
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    public async processLogin(input: LoginInput): Promise<Member> {
        const member = await this.memberModel
          .findOne({memberNick: input.memberNick}, {memberNick: 1, memberPassword: 1})
          .exec();
        if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

        const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);

        if (!isMatch) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
        }
        return await this.memberModel.findById(member._id).exec() as Member;
    }


    public async getUsers(): Promise<Member[]> {

      const result =  await this.memberModel.find({memberType: MemberType.USER}).exec();
      console.log("users ", result);
      return result;

    }

    public async updateChoosenUser(input: MemberUpdateInput ): Promise<Member> {
        const memberId = shapeIntoMongooseObjectId(input._id);
        const result = await this.memberModel.findOneAndUpdate({_id: memberId}, input, {new: true}).exec();
  
        if(!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
  
        console.log("Result", input);
        return result.toObject();
        
    }
}

export default MemberService;