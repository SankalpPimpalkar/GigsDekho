import Navbar from '../components/ui/Navbar'
import { Outlet } from 'react-router'

export default function MainLayout() {
    return (
        <div>
            <Navbar />
            <div className='w-full max-w-5xl mx-auto px-3 pt-4'>
                <Outlet />
            </div>
        </div>
    )
}
