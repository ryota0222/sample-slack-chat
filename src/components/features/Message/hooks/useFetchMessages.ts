import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getMessages } from "../apis/getMessages";

export const useFetchMessages = () => {
    const session = useSession();
    return useQuery({
        queryKey: ["messages", {userId: session.data?.user.uid}],
        queryFn: () => getMessages(session.data?.user.uid),
    });
}