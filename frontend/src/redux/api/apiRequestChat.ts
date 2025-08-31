import { 
    createRoomChatFailure,
     createRoomChatStart, 
     createRoomChatSuccess,
     getHistoryChatUserFailure
    ,getHistoryChatUserStart
     ,getHistoryChatUserSuccess ,
     getHistoryChatReceiverFailure,
     getHistoryChatReceiverStart,
     getHistoryChatReceiverSuccess,
     createMessageFailure,
     createMessageStart,
     createMessageSuccess
    } from "../slice/chatSlice"
import axiosInstance from "../../axios/axios.interceptor";
export const createRoomChat = async (data: any,dispatch: any) => {
    dispatch(createRoomChatStart())
    try {
        console.log("dattamau",data)
        const res = await axiosInstance.post(`/chat/roomchat/`, data);
        console.log('datas', res.data)
        dispatch(createRoomChatSuccess(res.data));
    } catch (error) {
        console.error("error:", error);

        dispatch(createRoomChatFailure())
    }
}
export const getHistoryChatUser = async(data:any,dispatch:any)=>{
 dispatch(getHistoryChatUserStart())
    try {
        console.log("dattamau",data)
        const res = await axiosInstance.get(`/chat/message/`,{
            params:{
                room_id :data.room_id,
                user_id :data.user_id
            }
        } );
        console.log('datas', res.data)
        dispatch(getHistoryChatUserSuccess(res.data));
    } catch (error) {
        console.error("error:", error);

        dispatch(getHistoryChatUserFailure())
    }
}
export const getHistoryChatReceiver = async(data:any,dispatch:any)=>{
 dispatch(getHistoryChatReceiverStart())
    try {
        console.log("dattamau",data)
        const res = await axiosInstance.get(`/chat/historyreceiver/`,{
            params:{
                room_id :data.room_id,
                user_id :data.user_id
            }
        } );
        console.log('datasre', res.data)
        dispatch(getHistoryChatReceiverSuccess(res.data));
    } catch (error) {
        console.error("error:", error);

        dispatch(getHistoryChatReceiverFailure())
    }
}
export const createMessage = async (data: any,dispatch: any) => {
    dispatch(createMessageStart())
    try {
        const res = await axiosInstance.post(`/chat/message/`, data);
        dispatch(createMessageSuccess(res.data));
    } catch (error) {
        console.error("error:", error);

        dispatch(createMessageFailure())
    }
}