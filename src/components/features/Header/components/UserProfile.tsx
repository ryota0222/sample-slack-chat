import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { memo } from "react";
import { getProfile } from "../../User/apis/getProfile";

export const UserProfile: React.FC = memo(() => {
  const session = useSession();
  const { data } = useQuery({
    queryKey: ["users", session.data?.user.uid],
    queryFn: () => getProfile(session.data?.user.uid),
  });
  if (data?.data) {
    return (
      <img
        src={data.data.avatar}
        alt={data.data.name}
        className="w-8 h-8 rounded-full"
      />
    );
  }
});
