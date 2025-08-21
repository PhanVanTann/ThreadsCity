export type ObjectId = string;

export type UserLite = {
  _id: ObjectId;
  name: string;
  avatar?: string | null;
};

export type MessageDoc = {
  id: ObjectId;
  user_id: ObjectId;
  send_user_id: ObjectId;
  receive_user_id: ObjectId;
  text?: string;
  image?: string;
  video?: string;
  created_at: string;
};