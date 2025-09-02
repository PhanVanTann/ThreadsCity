import { Suspense } from 'react'
import { Route, Routes,Navigate } from 'react-router-dom'
import Login from './auth/login'
import Home from './pages/home'
import Profile from './pages/profileUser'
import DefaultLayout from '../src/pages/layout'
import Search from './pages/search'
import PostComment from './pages/postcomment'
import Notifications from './pages/notifications'
import AdmintLayout from './admin/layout'
import ProtectedRoute from './middleware/protectedRouteProps'
import PostProcessing from './admin/ApprovedPostsPage'
import DashBoard from './admin/PendingModerationPage'
import Loading from './components/loading'
import Register from './auth/register'
import {Toaster} from 'react-hot-toast'
import LoadingPost from './pages/loadingPost/LoadingPost'
import { useEffect } from "react";
import { addNotificationRealtime } from './redux/slice/notificationSlice'
import { connectNotificationWS } from "./lib/sw";
import { useDispatch, useSelector } from "react-redux";
import PendingModerationPage from './admin/PendingModerationPage'
import ApprovedPostsPage from './admin/ApprovedPostsPage'



function App() {
  const currentUser = useSelector((s: any) => s.auth.login.currentUser);
   const dispatch = useDispatch();
   useEffect(() => {
    if (!currentUser) return;

    const ws = connectNotificationWS({
      onMessage: (data) => {
        dispatch(addNotificationRealtime(data));
        
      },
      onError: (e) => console.log("WS error", e),
      onClose: () => console.log("WS closed"),
    });

    return () => ws.close();
  }, [currentUser]);
  return (
    <Suspense fallback={<Loading />}>
      
      <Routes>
         <Route element={<ProtectedRoute allowedRoles={['user','admin']}/>} >
        <Route element={<DefaultLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Navigate to="/" replace/>} />
          <Route path='/profile/:userId' element={<Profile />} />
          <Route path='/search' element={<Search />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/loadingpost' element={<LoadingPost />} />
          <Route path='/postcomment/:post_id' element={<PostComment />} />

          </Route>
        </Route>
        
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

    
 <Route element={<ProtectedRoute allowedRoles={['admin']}/>} >
       <Route element={<AdmintLayout />}>
         
            <Route path="/moderation/pending" element={<PendingModerationPage />} />
            <Route path="/moderation/approved" element={<ApprovedPostsPage />} />
       </Route>
      </Route>
        {/* <Route path='*' element={<NotFound />} /> */}
      </Routes>
      
    </Suspense>
  )
}

export default App
