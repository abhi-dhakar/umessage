"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, LockKeyhole } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export default function VerifyAccount() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useParams<{ username: string }>();

  const form = useForm({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast("Success", {
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      setIsSubmitting(false);
      console.error("error in sign-up of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;

      toast("sign-up failed", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] px-4">
    
      <div className="fixed -top-20 -right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="fixed -bottom-20 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-[400px]">
      
        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-24">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
          </div>

          <div className="p-6 sm:p-8">
        
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-2xl font-bold text-white">
                Verify Your Account
              </h1>
              <p className="text-sm text-gray-400">
                Enter the verification code sent to your email
              </p>
            </div>

         
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* OTP Field */}
                <FormField
                  name="code"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm text-gray-300">
                        Verification Code
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            className="w-full bg-white/5 border-white/10 rounded-xl px-4 py-2.5
                                  text-white placeholder:text-gray-500 text-center text-lg tracking-[0.5em]
                                  focus:border-purple-500 focus:ring-1 focus:ring-purple-500
                                  transition-all duration-200"
                            maxLength={6}
                            placeholder="······"
                       />
                          <LockKeyhole className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

            
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white/10 
                        text-white font-medium py-2.5 rounded-xl
                        hover:bg-white/15 active:bg-white/10
                        transition-colors duration-200
                        disabled:bg-white/5 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    "Verify Code"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
