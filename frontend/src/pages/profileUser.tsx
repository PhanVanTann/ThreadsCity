import { useState, useEffect, useMemo, useRef } from 'react';
import Post from '../components/post';
import { mergeMediaToPosts } from '../components/postlist';
import { useDispatch, useSelector } from "react-redux";
import { getUserById, updateUser } from 'src/redux/api/apiRequestUser';
import { getFollowsByUserId, createFollowUser, getFollowerByUserId, isFriendUser } from 'src/redux/api/apiRequestFriend';
import { useParams, useNavigate } from "react-router-dom";
import { getPostValidById } from 'src/redux/api/apiRequestPost';
import ProfileEditModal from 'src/components/ProfileEditModal';
import { ProfileSkeleton } from 'src/components/ProfileSkeleton';
import toast from 'react-hot-toast';

export default function ProfileUser() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const isFriend = useSelector((state:any)=>state.friend.isFriendUser?.data?.is_friend);
  const { userId } = useParams<{ userId: string }>();
  const [openEdit, setOpenEdit] = useState(false);
  const currentUserId = useSelector((state: any) => state.auth.login.currentUser?.user_id) as string | undefined;
  const userData = useSelector((state:any)=>state.user.getUserById?.data?.data);
  const postlistByUserState = useSelector((state:any)=>state.post.getPostValidById?.data);
  const updating = useSelector((s:any) => s.user.update?.isFetching) || false;

  // --- Sửa: gate giữ skeleton tối thiểu 0.5s khi đang load ---
 const [minDelayDone, setMinDelayDone] = useState(false);
 const minDueRef = useRef<number>(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Điều hướng không đặt trong render
  useEffect(() => {
    if (!userId) navigate("/");
  }, [userId, navigate]);

  // Gọi API
  useEffect(() => {
    if (!userId) return;
    getUserById(userId, dispatch);
    getFollowsByUserId(userId, currentUserId as string, dispatch);
    getFollowerByUserId({ user_id: userId, my_id: currentUserId, follower: true }, dispatch);
    getPostValidById(userId, dispatch);
    if (currentUserId && currentUserId !== userId) {
      isFriendUser({ user_id: currentUserId, follower_id: userId }, dispatch);
    }
  }, [userId, currentUserId, dispatch]);

  // Skeleton gate 0.5s: khi userData trống -> bật timer 500ms;
  // nếu userData có sớm, vẫn giữ skeleton cho tới khi đủ 500ms để tránh flicker.
  useEffect(() => {
  // Đổi sang boolean để tránh rerender dư
  const hasData = !!userData;

  if (!hasData) {
    // Bước vào trạng thái loading
    minDueRef.current = Date.now() + 500; // 0.5s nữa mới được render
    setMinDelayDone(false);
    return; // KHÔNG setTimeout ở nhánh này
  }

  // Dữ liệu đã có
  const remaining = minDueRef.current - Date.now();

  if (remaining > 0) {
    const t = setTimeout(() => setMinDelayDone(true), remaining);
    return () => clearTimeout(t);
  } else {
    setMinDelayDone(true);
  }
}, [userData, userId]);

  // Dữ liệu bài viết
  const postlistByUser: any[] = Array.isArray(postlistByUserState?.data) ? postlistByUserState.data : [];
  mergeMediaToPosts(postlistByUser);

  const followersState = useSelector((s:any)=> s.friend.getFollowsByUserId?.data);
  const followers: any[] = Array.isArray(followersState?.flowers)
    ? followersState.flowers
    : Array.isArray(followersState?.data)
    ? followersState.data
    : [];

  const followerState = useSelector((s:any)=> s.friend.getFollowerByUserId?.data);
  const follower: any[] = Array.isArray(followerState?.flowers)
    ? followerState.flowers
    : Array.isArray(followerState?.data)
    ? followerState.data
    : [];

  const postsSorted = useMemo(() => {
    const arr = Array.isArray(postlistByUser) ? postlistByUser : [];
    return [...arr].sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [postlistByUser]);

  const handleClick = (index: number) => setSelectedIndex(index);

  const handleClickUser = (uid: string) => navigate(`/profile/${uid}`);

  const handleFollow = async (followee_id: string) => {
    const data = { follower_id: currentUserId, followee_id };
    await createFollowUser(data, dispatch);
    await getFollowerByUserId({ user_id: userId, my_id: currentUserId, follower: true }, dispatch);
    await getFollowsByUserId(userId as string, currentUserId as string, dispatch);
    await isFriendUser({ user_id: currentUserId, follower_id: followee_id }, dispatch);
  };

  const handleSubmitEdit = async (data: FormData) => {
    if (!currentUserId) return;
    await updateUser(currentUserId, data, dispatch);
    toast.success("Cập nhật thành công")
    await getUserById(currentUserId,dispatch)
    
    await getPostValidById(currentUserId,dispatch)
    setOpenEdit(false);

  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [userId, selectedIndex]);

  // --- Early return: chỉ render khi đã có data và đã qua gate 0.5s ---
  if (!userData || !minDelayDone) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="w-[700px] mt-5 flex flex-col border border-[#3d3d3d] rounded-[20px] bg-gray-100 dark:bg-[#000]  ">
      <div className="flex h-[200px] rounded-[20px] bg-black justify-between w-full items-start p-2">
        <img
          src={userData?.avatar || "https://i.pravatar.cc/150?img=1"}
          alt="avatar"
          className="object-cover rounded-full w-[100px] h-[100px] mt-5 ml-5"
        />

        <div className="w-[380px] h-[100px] flex flex-col items-start justify-center mt-5">
          <div className="flex gap-5 h-[35px]">
            <span className="text-white text-xl font-bold ">
              {`${userData?.last_name ?? ""} ${userData?.first_name ?? ""}`}
            </span>

            {userId !== currentUserId && (
              <div>
                {isFriend === "friend" || isFriend === "follower" ? (
                  <button
                    onClick={() => handleFollow(userId as string)}
                    className="cursor-pointer text-[14px] px-2 py-1 rounded-lg bg-black border-3 text-white border-[#3d3d3d] hover:bg-[#1d1d1d]"
                  >
                    Hủy Theo Dõi
                  </button>
                ) : isFriend === "following" ? (
                  <button
                    onClick={() => handleFollow(userId as string)}
                    className="cursor-pointer text-[14px] px-2 py-1 rounded-lg bg-white text-black hover:bg-white/90"
                  >
                    Theo Dõi Lại
                  </button>
                ) : (
                  <button
                    onClick={() => handleFollow(userId as string)}
                    className="cursor-pointer text-[14px] px-2 py-1 rounded-lg bg-white text-black hover:bg-white/90"
                  >
                    Theo Dõi
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mt-3 flex gap-5 text-gray-300 text-sm">
            <span onClick={() => handleClick(0)} className="cursor-pointer w-[100px]">
              {postlistByUser.length} post
            </span>
            <span onClick={() => handleClick(1)} className="cursor-pointer w-[120px]">
              {followers.length} đang theo dõi
            </span>
            <span onClick={() => handleClick(2)} className="cursor-pointer w-[120px]">
              {follower.length} người theo dõi
            </span>
          </div>
          <div className="text-white text-sm  mb-3 whitespace-pre-wrap break-words">{userData?.introduce}</div>

        </div>

        {userId === currentUserId ? (
          <div className='mt-5'>
            <button className="border rounded-lg px-3 py-2" onClick={() => setOpenEdit(true)}>
              chỉnh sửa
            </button>
            <ProfileEditModal
              open={openEdit}
              onClose={() => setOpenEdit(false)}
              initial={userData}
              onSubmit={handleSubmitEdit}
              loading={updating}
            />
          </div>
        ) : (
          <div className="border rounded-lg px-3 py-2 invisible">placeholder</div>
        )}
  
      </div>
 
      <div className="flex sticky top-0 bg-black z-30">
        <div
          className={`w-1/2 cursor-pointer text-white flex items-center justify-center p-4 border-b ${
            selectedIndex === 0 ? 'border-b-1 border-white' : 'border-[#3d3d3d]'
          }`}
          onClick={() => handleClick(0)}
        >
          Post
        </div>
        <div
          className={`w-1/2 cursor-pointer text-white flex items-center justify-center p-4 border-b ${
            selectedIndex === 1 ? 'border-b-1 border-white' : 'border-[#3d3d3d]'
          }`}
          onClick={() => handleClick(1)}
        >
          Đang Theo Dõi
        </div>
        <div
          className={`w-1/2 cursor-pointer text-white flex items-center justify-center p-4 border-b ${
            selectedIndex === 2 ? 'border-b-1 border-white' : 'border-[#3d3d3d]'
          }`}
          onClick={() => handleClick(2)}
        >
          Người Theo Dõi
        </div>
      </div>

      <div>
        {selectedIndex === 0 ? (
          <div>
            {postsSorted.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        ) : selectedIndex === 1 ? (
          <div>
            {followers.map((user) => (
              <div key={user.id} className="relative flex items-center p-5 border-b border-[#3d3d3d]">
                <div onClick={() => handleClickUser(user.id)} className="flex items-center cursor-pointer">
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="object-cover rounded-full w-[40px] h-[40px] mr-2"
                  />
                  <div className="flex-grow">
                    <span className="text-white font-bold">{user.last_name} {user.first_name}</span>
                  </div>
                </div>

                {currentUserId !== user.id && (
                  <div className="absolute border border-[#3d3d3d] rounded-full px-4 py-1 text-sm text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-[#3d3d3d] transition-colors right-10">
                    <button className="cursor-pointer" onClick={() => handleFollow(user.id)}>
                      Huỷ Theo Dõi
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : selectedIndex === 2 ? (
          <div>
            {follower.map((user) => (
              <div key={user.id} className="relative flex items-center p-5 border-b border-[#3d3d3d]">
                <div onClick={() => handleClickUser(user.id)} className="flex items-center cursor-pointer">
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="object-cover rounded-full w-[40px] h-[40px] mr-2"
                  />
                  <div className="flex-grow">
                    <span className="text-white font-bold">{user.last_name} {user.first_name}</span>
                  </div>
                </div>

                {currentUserId !== user.id && (
                  <div className="absolute border border-[#3d3d3d] rounded-full px-4 py-1 text-sm text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-[#3d3d3d] transition-colors right-10">
                    {user.is_friend ? (
                      <button className="cursor-pointer">Bạn bè</button>
                    ) : (
                      <button className="cursor-pointer" onClick={() => handleFollow(user.id)}>Theo Dõi Lại</button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-300">Chọn một tab để xem nội dung</div>
        )}
      </div>
    </div>
  );
}
