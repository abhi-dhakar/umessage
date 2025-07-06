"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ArrowRight, Mail } from "lucide-react";
import React from "react";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ColourfulText } from "@/components/ui/colourful-text";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F1A] text-gray-100 font-sans tracking-wide relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed -top-20 -right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="fixed -bottom-20 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      <BackgroundBeams />

      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 space-y-16 relative">
        <section className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
            <ColourfulText text="Express  Yourself  Openly" />
          </h1>
          <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
            Umessage — Where Words Matter, Not Identities..
          </p>
        </section>

        <section className="w-full max-w-2xl">
          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {/* Accent Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-24">
              <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
            </div>

            <div className="p-6 sm:p-8">
              <Carousel plugins={[Autoplay({ delay: 2500 })]} className="group">
                <CarouselContent>
                  {messages.map((message, index) => (
                    <CarouselItem key={index} className="p-3">
                      <Card
                        className="rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 
                                  hover:scale-[1.02] transition-all duration-300"
                      >
                        <CardHeader>
                          <CardTitle
                            className="text-xl font-semibold bg-gradient-to-r 
                                          from-blue-400 to-purple-400 text-transparent bg-clip-text"
                          >
                            {message.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-white/5">
                            <Mail className="text-purple-400 animate-bounce-slow w-6 h-6" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-base text-gray-200">
                              {message.content}
                            </p>
                            <p className="text-xs text-gray-500">
                              {message.received}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </section>

        <div className="flex justify-center">
          <Link href="/dashboard" passHref>
            <HoverBorderGradient
              containerClassName="rounded-xl p-[1px]"
              as="button"
              className="relative px-6 py-2.5 bg-[#0B0F1A] text-white font-medium
                      hover:bg-white/5 transition-colors duration-200"
            >
              <span className="flex items-center gap-2">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </span>
            </HoverBorderGradient>
          </Link>
        </div>
      </main>

      <footer className="relative border-t border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto py-4 px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Umessage. All rights reserved. Designed and developed by Abhishek Nagar
        </div>
      </footer>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
