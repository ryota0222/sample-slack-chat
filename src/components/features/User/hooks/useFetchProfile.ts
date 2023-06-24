import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getProfile } from "../apis/getProfile";

export const useFetchProfile = () => {
    const session = useSession();
    return useQuery({
        queryKey: ["users", session.data?.user.uid],
        queryFn: () => getProfile(session.data?.user.uid),
    });
}