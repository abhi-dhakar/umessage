/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider ({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "password", type: "password"}
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect()
                try {
                  const user =  await UserModel.findOne({
                        $or:[{email: credentials.identifier},{username: credentials.identifier}]
                    })
                    if(!user){
                        throw new Error("no user found with this email")
                    }
                    if(!user.isVerified){
                        throw new Error("please Verify your account before login")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if(isPasswordCorrect){
                        return user
                    }else{
                        throw new Error("Incorrect password")
                    }
                    
                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],

    callbacks: {

        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString()
                token.username = user.username
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessage
            }
        
            return token
        },
         async session({ session, token }) {
            if(token){
              session.user._id = token._id 
              session.user.username = token.username 
              session.user.isVerified = token.isVerified 
              session.user.isAcceptingMessage = token.isAcceptingMessage 
            }
          return session
        }
    },

    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}