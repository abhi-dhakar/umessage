import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){

    await dbConnect();

//localhost:3000/api/check-username-unique?username=abhishek
    try {

        const{searchParams} = new URL(request.url)
        const queryParam = {username: searchParams.get('username')}
        
        //validation by zod

        const result = UsernameQuerySchema.safeParse(queryParam)

        // console.log("zod result", result)

        if(!result.success){
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                 success: false,
                 message: usernameError?.length >0 ? usernameError.join(', ') : "Invalid query parameter"
            },{
                status: 400
            })
        }

         const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})

        if(existingVerifiedUser){
            return Response.json(
                {
                    success: false,
                    message: "username is already taken"
                },
                {
                    status: 400
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "username is unique"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.error("Error checking username", error)

        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {
                status: 500
            }
        )
    }

}