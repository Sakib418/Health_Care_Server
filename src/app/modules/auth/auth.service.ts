import { UserStatus } from "@prisma/client";
import prisma from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { jwtHelpers } from "../../../helper/jwtHelper";
import config from '../../../config';



const login = async (payload: { email: string; password: string }) => {
    
    const user = await prisma.user.findUniqueOrThrow({
         where: {
            email: payload.email,
            status: UserStatus.ACTIVE
         }
    })
   
    const isPasswordMatched = await bcrypt.compare(payload.password,user.password);
    if(!isPasswordMatched){
        throw new Error("Password is incorrect");
    }

    const accessToken = jwtHelpers.generateToken({email: user.email, role: user.role}, config.jwt_secrate as string,"1h");

    const refreshToken = jwtHelpers.generateToken({email: user.email, role: user.role}, config.refreshToken_secrate as string,"90d");


    return { 
         accessToken,
         refreshToken,
         needPasswordChange: user.needPasswordChange
        };
}


export const AuthService= {
    login
}