import React, { memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFetchProfile } from "../User/hooks/useFetchProfile";
import { usePutWebhook } from "../User/hooks/usePutWebhook";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const WebhookForm: React.FC = memo(() => {
  const mutation = usePutWebhook({});
  const session = useSession();
  const queryClient = useQueryClient();
  const { data } = useFetchProfile();
  const { register, handleSubmit, setValue } = useForm();
  useEffect(() => {
    if (data && data.data.webhook) {
      setValue("webhook", data.data.webhook);
    }
  }, [data]);
  const onSubmit = (data: any) => {
    if (data.webhook.length) {
      let toastId: string | null = toast.loading("処理中");
      mutation.mutate(
        {
          uid: session.data?.user.uid,
          webhook: data.webhook,
        },
        {
          onSuccess: () => {
            toast.success("更新しました", {
              id: toastId as string,
            });
            queryClient.invalidateQueries(["users", session.data?.user.uid]);
          },
          onError: () => {
            if (toastId) toast.dismiss(toastId);
          },
        }
      );
    }
  };
  return (
    <div className="w-full py-12">
      <h2 className="mb-4 text-xl font-bold"># Webhookの設定</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4">
          <input
            id="webhook"
            type="url"
            {...register("webhook")}
            className="w-full p-2 rounded-md bg-gray-800"
          />
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 text-white w-20"
            disabled={mutation.isLoading}
          >
            更新
          </button>
        </div>
      </form>
    </div>
  );
});
