"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

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
import { Loader2, Lock, Mail, User } from "lucide-react";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();

  //zod implementation

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const res = await axios.get(
            `/api/check-username-unique?username=${username}`
          );

          setUsernameMessage(res.data.message);
        } catch (error) {
          const AxiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            AxiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast("success", {
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("error in sign-up of user", error);
      const AxiosError = error as AxiosError<ApiResponse>;
      const errorMessage = AxiosError.response?.data.message;

      toast("sign-up failed", {
        description: errorMessage,
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A]">
      <div className="w-full max-w-[400px] mx-auto px-4">
        <div className="fixed -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="fixed -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          <div className="p-6 sm:p-8">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Create Account
              </h1>
              <p className="text-sm text-gray-400">
                Join <span className="text-white font-medium">Umessage</span>{" "}
                today
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
              
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-300">
                        Username
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            className="w-full bg-white/5 border-white/10 rounded-xl px-4 py-2.5
                                 text-white placeholder:text-gray-500
                                 focus:border-purple-500 focus:ring-1 focus:ring-purple-500
                                 transition-all duration-200"
                            placeholder="Choose a username"
                            onChange={(e) => {
                              field.onChange(e);
                              debounced(e.target.value);
                            }}
                          />
                          <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        </div>
                      </FormControl>
                      {isCheckingUsername && (
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Checking availability...
                        </div>
                      )}
                      {!isCheckingUsername && usernameMessage && (
                        <p
                          className={`text-xs mt-1 ${
                            usernameMessage === "username is unique"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {usernameMessage}
                        </p>
                      )}
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

              
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-300">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            className="w-full bg-white/5 border-white/10 rounded-xl px-4 py-2.5
                                 text-white placeholder:text-gray-500
                                 focus:border-purple-500 focus:ring-1 focus:ring-purple-500
                                 transition-all duration-200"
                            placeholder="Enter your email"
                          />
                          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        </div>
                      </FormControl>
                      <p className="text-gray-500 text-xs mt-1">
                        We will send you a verification code
                      </p>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

              
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-300">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="password"
                            {...field}
                            className="w-full bg-white/5 border-white/10 rounded-xl px-4 py-2.5
                                 text-white placeholder:text-gray-500
                                 focus:border-purple-500 focus:ring-1 focus:ring-purple-500
                                 transition-all duration-200"
                            placeholder="Create a password"
                          />
                          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
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
                       hover:bg-white/20 active:bg-white/15
                       transition-colors duration-200
                       disabled:bg-white/5 disabled:cursor-not-allowed
                       mt-6"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>

            <div className="flex items-center gap-2 my-6">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-sm text-gray-500">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
