"use client";

import MessageCard from "@/components/myui/MessageCard";
import { Button } from "@/components/ui/button";

import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessage");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get("/api/accept-messages");

      setValue("acceptMessage", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast("Error", {
        description:
          axiosError.response?.data.message ||
          "faild to fetch message settings",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);

    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);

      if (refresh) {
        toast("refresh Mesages", {
          description: "Showing latest messages",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast("Error", {
        description:
          axiosError.response?.data.message ||
          "faild to fetch message settings",
      });
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  const handelSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessage: !acceptMessages,
      });

      setValue("acceptMessage", !acceptMessages);
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast("Error", {
        description:
          axiosError.response?.data.message ||
          "faild to fetch message settings",
      });
    }
  };

  if (!session || !session.user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 ">
        <div className="w-full max-w-[400px]">
          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            <div className="p-6 sm:p-8 text-center">
              <div className="space-y-2 mb-6">
                <h2
                  className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 
                            text-transparent bg-clip-text"
                >
                  Please Sign In
                </h2>
                <p className="text-gray-400 text-sm">
                  Sign in to access your dashboard
                </p>
              </div>

              <Link href="/sign-in">
                <button
                  className="w-full bg-white/10 hover:bg-white/15 
                                text-white font-medium py-2.5 rounded-xl
                                border border-white/10 transition-colors duration-200"
                >
                  Sign in to continue
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/to/${username}`;

  const copyToClipboard = () => {
    if (!profileUrl) return;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(profileUrl)
        .then(() => {
          toast("URL Copied!", {
            description: "Profile URL has been copied to clipboard.",
          });
        })
        .catch(() => {
          fallbackCopy(profileUrl);
        });
    } else {
      fallbackCopy(profileUrl);
    }
  };

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed"; // Prevent scrolling
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        toast("URL Copied!", {
          description: "Profile URL has been copied to clipboard.",
        });
      } else {
        toast("Copy failed", {
          description: "Please copy manually.",
        });
      }
    } catch {
      toast("Copy failed", {
        description: "Please copy manually.",
      });
    }

    document.body.removeChild(textarea);
  };

  return (
    <div className="min-h-screen bg-[#111827] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-indigo-400 text-transparent bg-clip-text">
                Dashboard Overview
              </span>
            </h1>
            <p className="text-gray-400">Manage your profile and messages</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-xl border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Profile Link</p>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="text"
                      value={profileUrl}
                      disabled
                      className="bg-gray-900/50 rounded-lg px-4 py-2 text-sm text-gray-300 w-full"
                    />
                    <Button
                      onClick={copyToClipboard}
                      className="bg-indigo-500 hover:bg-indigo-600 rounded-lg px-4 py-2"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-xl border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-gray-400">Message Settings</p>
                  <div className="flex items-center gap-4">
                    <Switch
                      {...register("acceptMessage")}
                      checked={acceptMessages}
                      onCheckedChange={handelSwitchChange}
                      disabled={isSwitchLoading}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                    <span className="text-gray-300">
                      {acceptMessages
                        ? "Accepting Messages"
                        : "Messages Disabled"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-xl border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-gray-400">Refresh Messages</p>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      fetchMessages(true);
                    }}
                    className="bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2 w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <RefreshCcw className="h-5 w-5" />
                        <span>Sync</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-3xl p-8 backdrop-blur-xl border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-gray-200">
              Recent Messages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={String(message._id)}
                    className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-all duration-300"
                  >
                    <MessageCard
                      message={message}
                      onMessageDelete={handleDeleteMessage}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400">No messages available</p>
                  <p className="text-sm text-gray-500 mt-2">
                    New messages will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
