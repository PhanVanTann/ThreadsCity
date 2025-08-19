import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Home from './pages/home'
import Profile from './pages/profileUser'
import DefaultLayout from '../src/pages/layout'
import Search from './pages/search'
import Notifications from './pages/notifications'
import AdmintLayout from './admin/layout'
import ProtectedRoute from './middleware/protectedRouteProps'
import PostProcessing from './admin/postprocessing'
import DashBoard from './admin/dashboard'
import Loading from './components/loading'
function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/search' element={<Search />} />
          <Route path='/notifications' element={<Notifications />} />


        </Route>
        
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

      {/* <Route element={<ProtectedRoute allowedRoles={['user','admin']}/>} > */}
       <Route element={<AdmintLayout />}>
        <Route path='/dashboard' element={<DashBoard />} />
        <Route path='/postprocessing' element={<PostProcessing />} />


       </Route>
      {/* </Route> */}
        {/* <Route path='*' element={<NotFound />} /> */}
      </Routes>
    </Suspense>
  )
}

export default App
