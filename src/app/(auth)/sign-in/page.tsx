"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
import { Loader2, Lock, Mail } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

export default function SignInpage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  //zod implementation

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      setIsSubmitting(false);
      toast("Login faild", {
        description: "incorrect username or password",
      });
    }

    if (result?.url) {
      setIsSubmitting(false);
      router.replace("/dashboard");
    }
    setIsSubmitting(false);
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
              <h1
                className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
                        text-transparent bg-clip-text"
              >
                Welcome Back
              </h1>
              <p className="text-sm text-gray-400">
                Sign in to{" "}
                <span className="text-white font-medium">Umessage</span>
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  name="identifier"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-sm text-gray-300">
                        Email or Username
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            className="w-full bg-white/5 border-white/10 rounded-xl px-4 py-2.5
                                  text-white placeholder:text-gray-500
                                  focus:border-purple-500 focus:ring-1 focus:ring-purple-500
                                  transition-all duration-200"
                            placeholder="Enter your email or username"
                          />
                          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
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
                            placeholder="Enter your password"
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
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
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
            Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
