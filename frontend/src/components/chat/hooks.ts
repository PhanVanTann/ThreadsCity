import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getlistFriend } from "../../redux/api/apiRequestFriend";
import type { ObjectId, UserLite } from "./types";

export const useAuth = () => {
  const user = useSelector((s: any) => s.auth.login.currentUser?.user_id) as string | undefined;
  return { user };
};

export const useRoomId = () => {
  const room_id = useSelector((s: any) => s.chat.createRoomChat.data?.room_id) as string | undefined;
  return room_id;
};

export const useFriends = (user_id?: ObjectId) => {
  const dispatch = useDispatch();
  const apiData = useSelector((s: any) => s.friend.getlistFriend.data) as { success: boolean; data: any[] } | undefined;
  const [friends, setFriends] = useState<UserLite[]>([]);

  useEffect(() => {
    if (!user_id) return;
    getlistFriend(user_id, dispatch);
  }, [user_id, dispatch]);

  useEffect(() => {
    const raw = apiData?.data ?? [];
    setFriends(
      raw.map((f: any) => ({
        _id: f.id,
        name: [f.last_name, f.first_name].filter(Boolean).join(" ").trim() || f.id,
        avatar: f.avatar ?? null,
      }))
    );
  }, [apiData]);

  return friends;
};