import React, { memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { usePostMessage } from "../Message/hooks/usePostMessage";

export const MessageForm: React.FC = memo(() => {
  const mutation = usePostMessage({});
  const session = useSession();
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, getValues } = useForm();
  const onSubmit = (data: any) => {
    if (data.message.length) {
      let toastId: string | null = toast.loading("処理中");
      mutation.mutate(
        {
          uid: session.data?.user.uid,
          text: data.message,
        },
        {
          onSuccess: () => {
            if (toastId) toast.dismiss(toastId);
            setValue("message", "");
            queryClient.invalidateQueries([
              "messages",
              { userId: session.data?.user.uid },
            ]);
          },
          onError: () => {
            if (toastId) toast.dismiss(toastId);
          },
        }
      );
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      onSubmit(getValues());
    }
  };
  return (
    <div className="w-full py-12">
      <h2 className="mb-4 text-xl font-bold"># メッセージ送信</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-end">
          <textarea
            id="message"
            {...register("message")}
            className="w-full p-2 rounded-md bg-gray-800 resize-y"
            placeholder="⌘+Enter または Ctrl+Enter で送信"
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            className="inline-flex ml-4 justify-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 text-white w-20"
            disabled={mutation.isLoading}
          >
            送信
          </button>
        </div>
      </form>
    </div>
  );
});
