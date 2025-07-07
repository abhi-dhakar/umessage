"use client";

import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Clock, Trash2 } from "lucide-react";
import { Message } from "@/model/User";
import { toast } from "sonner";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { format } from "date-fns";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const formattedDate = format(new Date(message.createdAt), "PPP p");
  console.log("date", formattedDate);
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast(response.data.message);
      onMessageDelete(message._id as string);
    } catch (error) {
      toast("Failed to delete message");
      console.error(error)
    }
  };

  return (
    <div className="relative group -mx-4 sm:mx-0">
      <CardHeader className="space-y-4 px-4 sm:px-0">
        <div className="flex items-start">
          {/* Message Content */}
          <div className="flex-1 space-y-2 pr-12">
            <div className="flex gap-3">
              <div className="h-2 w-2 mt-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <CardTitle className="text-base font-medium text-gray-200 break-words">
                {message.content}
              </CardTitle>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Delete Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 p-1.5
                           text-gray-400 hover:text-red-400
                           transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-xl p-6 max-w-md mx-4 sm:mx-0">
              <AlertDialogHeader className="space-y-3">
                <AlertDialogTitle className="text-xl font-semibold text-gray-100">
                  Delete Message
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  <div className="space-y-2">
                    <p>Are you sure you want to delete this message?</p>
                    <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 mt-2">
                      <p className="text-sm text-gray-300 italic">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
                <AlertDialogCancel
                  className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 
                            text-gray-300 border-gray-700 rounded-lg 
                            px-4 py-2 text-sm"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="w-full sm:w-auto bg-red-500/10 hover:bg-red-500/20 
                            text-red-400 border border-red-500/20 rounded-lg 
                            px-4 py-2 text-sm transition-colors duration-200"
                >
                  Delete Message
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
    </div>
  );
};

export default MessageCard;
