import React, { memo } from "react";
import { useFetchMessages } from "../Message/hooks/useFetchMessages";
import { Loader } from "@/components/ui/Loader";
import dayjs from "@/lib/dayjs";

export const MessageContent: React.FC = memo(() => {
  const { data, isLoading } = useFetchMessages({
    config: {
      refetchOnWindowFocus: true,
      staleTime: 10000,
    },
  });
  return (
    <div className="w-full py-12">
      <h2 className="mb-4 text-xl font-bold"># メッセージ内容</h2>
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : (
        <>
          {data?.data.length ? (
            <div className="grid grid-cols-1 divide-y divide-slate-600">
              {data.data.map((message, idx) => (
                <div key={`message-${idx}`} className="flex gap-4 py-4">
                  <img
                    src={message.from.avatar}
                    alt="profile image"
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{message.from.name}</span>
                      <span className="text-sm text-slate-400">
                        {dayjs(message.createdAt).format("YYYY/MM/DD HH:mm")}
                      </span>
                    </div>
                    <div className="mt-2">{message.text}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              メッセージはありません
            </div>
          )}
        </>
      )}
    </div>
  );
});
