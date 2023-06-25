import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getMessages } from "../apis/getMessages";
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

type QueryFnType = typeof getMessages;

type UseFetchMessagesOptions = {
    config?: QueryConfig<QueryFnType>;
};

export const useFetchMessages = ({ config }: UseFetchMessagesOptions) => {
    const session = useSession();
    return useQuery<ExtractFnReturnType<QueryFnType>>({
        queryKey: ["messages", {userId: session.data?.user.uid}],
        queryFn: () => getMessages(session.data?.user.uid),
        ...config
    });
}