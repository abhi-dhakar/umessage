import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";


export async function POST(request: Request){
    await dbConnect();

    try {

        const{username , code} = await request.json()

        const decodedusername = decodeURIComponent(username)

        const user = await UserModel.findOne({username: decodedusername})

      if(!user){
        return Response.json(
            {
                success: false,
                message: "user not found"
            },
            {
                status: 500
            }
        )
      }

      const isCodeValid = user.verifyCode === code
      const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

    //   console.log(user.verifyCode)
    //   console.log(code)
    //   console.log("isvalid",isCodeValid)
    //   console.log("iscodenotexpired",isCodeNotExpired)

      if(isCodeValid && isCodeNotExpired){
        user.isVerified = true
        await user.save()

        return Response.json(
            {
                success: true,
                message: "account verified successful"
            },
            {
                status: 200
            }
        )
      } else if(!isCodeNotExpired){
        return Response.json(
            {
                success: false,
                message: "otp is expired"
            },
            {
                status: 400
            }
        )
      } else {
        return Response.json(
            {
                success: false,
                message: "Incorrect verification code"
            },
            {
                status: 400
            }
        )
      }


        
    } catch (error) {
        console.error("Error verify user", error)

        return Response.json(
            {
                success: false,
                message: "Error verify user"
            },
            {
                status: 500
            }
        )
    }
}