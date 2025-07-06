"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";
import { toast } from "sonner";



export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;


  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast(response.data.message);
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error", {
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] px-4 py-12">
      {/* Background Effects */}
      <div className="fixed -top-20 -right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="fixed -bottom-20 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-[400px]">
       
        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          <div className="p-6 sm:p-8">
           
            <div className="text-center space-y-2 mb-8">
              <h1
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
                        text-transparent bg-clip-text"
              >
                Send Anonymous Message
              </h1>
              <p className="text-sm text-gray-400">
                Send your thoughts anonymously to{" "}
                <span className="text-purple-400 font-medium">@{username}</span>
              </p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm text-gray-300">
                        Your Message
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Write your anonymous message here..."
                            className="w-full bg-white/5 border-white/10 rounded-xl px-4 py-3 
                                  text-white placeholder:text-gray-500
                                  focus:border-purple-500 focus:ring-1 focus:ring-purple-500
                                  transition-all duration-200 min-h-[120px] resize-none"
                            {...field}
                          />
                          <MessageSquare className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

             
                <Button
                  type="submit"
                  disabled={isLoading || !messageContent}
                  className="w-full bg-white/10 
                        text-white font-medium py-2.5 rounded-xl
                        hover:bg-white/15 active:bg-white/10
                        transition-colors duration-200
                        disabled:bg-white/5 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </Form>

           
            <div className="flex items-center gap-2 my-6">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-sm text-gray-500">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

          
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-400">
                Want to receive anonymous messages?
              </p>
              <Link href="/sign-up" className="block">
                <button
                  className="w-full bg-white/5 hover:bg-white/10 
                             text-gray-300 hover:text-white
                             font-medium py-2.5 rounded-xl
                             border border-white/10 
                             transition-colors duration-200"
                >
                  Create Your Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
