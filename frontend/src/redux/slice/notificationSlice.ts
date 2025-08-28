// src/redux/slice/notificationSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type NotificationType = "comment" | "like" | "follow" | "message";
type ResourceType = "post" | "comment" | "message" | "user";

export interface Notification {
  id: string;         
  user_id: string;
  actor: { actor_id: string; name: string; avatar: string };
  type: NotificationType;
  resource_type: ResourceType;
  resource_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const mapApiItem = (data: any): Notification => ({
  id: data._id || data.id,
  user_id: data.user_id,
  actor: {
    actor_id: data.actor?.actor_id,
    name: data.actor?.name,
    avatar: data.actor?.avatar,
  },
  type: data.type,
  resource_type: data.resource_type,
  resource_id: data.resource_id,
  message: data.message,
  is_read: !!data.is_read,
  created_at: data.created_at,
});

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    getListNotification: {
      data: [] as Notification[],
      unread: 0,
      isFetching: false,
      error: false,
      success: false,
    },
    getListNotificationWs:{
        data: [] as Notification[],
        isFetching: false,
        error: false,
        success: false,
    },
    markAsReadNotification: {
      data: null as any,
      isFetching: false,
      error: false,
      success: false,   
    },
  },
  reducers: {
    getListNotificationStart: (state) => {
      state.getListNotification.isFetching = true;
      state.getListNotification.error = false;
      state.getListNotification.success = false;
     
      state.getListNotification.data = [];
      state.getListNotification.unread = 0;
    },
    
    getListNotificationSuccess: (state, action: PayloadAction<{data:any[]; unread:number}>) => {
      state.getListNotification.data = (action.payload.data || []).map(mapApiItem);
      state.getListNotification.unread = action.payload.unread ?? 0;
      state.getListNotification.isFetching = false;
      state.getListNotification.error = false;
      state.getListNotification.success = true;
    },
    getListNotificationFailure: (state) => {
      state.getListNotification.isFetching = false;
      state.getListNotification.error = true;
      state.getListNotification.success = false;
      state.getListNotification.data = [];
      state.getListNotification.unread = 0;
    },
    addNotificationRealtime: (state, action: PayloadAction<{data:any[]}>) => {
    console.log('action',action.payload.data);
      const n = mapApiItem(action.payload.data);
      console.log('new noti',n);
      const exists = state.getListNotification.data.some((x) => x.id === n.id);
      if (!exists) {
        state.getListNotification.data.unshift(n);
        if (!n.is_read) state.getListNotification.unread += 1;
      }
    },
    markAsReadNotificationStart: (state) => {
      state.markAsReadNotification.data = null;
      state.markAsReadNotification.isFetching = true;
      state.markAsReadNotification.error = false;
      state.markAsReadNotification.success = false;
    },
    markAsReadNotificationSuccess: (state, action) => {
      state.markAsReadNotification.data = action.payload;
      state.markAsReadNotification.isFetching = false;
      state.markAsReadNotification.error = false;
      state.markAsReadNotification.success = true;
    },
    markAsReadNotificationFailure: (state) => {
      state.markAsReadNotification.data = null;
      state.markAsReadNotification.isFetching = false;
      state.markAsReadNotification.error = true;
      state.markAsReadNotification.success = false;
    },
  },
});

export const {
  getListNotificationStart,
  getListNotificationSuccess,
  getListNotificationFailure,
  addNotificationRealtime,
  markAsReadNotificationStart,
  markAsReadNotificationSuccess,
  markAsReadNotificationFailure,  
} = notificationSlice.actions;

export default notificationSlice.reducer;