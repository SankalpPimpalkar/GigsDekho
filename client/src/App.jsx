import { Route, Routes } from 'react-router'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import GigDetails from './pages/GigDetails'
import MainLayout from './layouts/MainLayout'
import MyApplications from './pages/MyApplications'
import MyGigs from './pages/MyGigs'

export default function App() {
  return (
    <Routes>
      <Route path='/auth' element={<AuthPage />} />
      <Route path='/' element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path='/gig/:gigId' element={<GigDetails />} />
        <Route path='/my-applications' element={<MyApplications />} />
        <Route path='/my-gigs' element={<MyGigs />} />
      </Route>
    </Routes>
  )
}
