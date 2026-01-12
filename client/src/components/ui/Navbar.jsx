import { Link } from "react-router";
import { authAPI } from "../../api/axios";
import { useAuth } from "../../context/AuthContextProvider";

export default function Navbar() {

    const { refetchUser } = useAuth()

    async function handleLogout() {
        await authAPI.logout()
        await refetchUser()
    }

    return (
        <nav className="w-full border-b border-base-200 sticky top-0 z-50">
            <div className="navbar bg-base-100 w-full max-w-5xl mx-auto px-5 sm:px-0">

                <div className="navbar-start">
                    <Link to="/" className="text-xl font-extrabold">
                        GigFlow
                    </Link>
                </div>

                <div className="navbar-end">
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="avatar cursor-pointer"
                        >
                            <div className="w-8 rounded-full">
                                <img
                                    src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
                                    alt="Profile"
                                />
                            </div>
                        </div>

                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box w-52 shadow"
                        >
                            <Link to={'/my-applications'} className="bg-base-100 hover:bg-base-200 px-3 py-2">
                                My Applications
                            </Link>
                            <Link to={'/my-gigs'} className="bg-base-100 hover:bg-base-200 px-3 py-2">
                                My Gigs
                            </Link>
                            <li onClick={handleLogout} className="bg-base-100 hover:bg-base-200 px-3 py-2 text-error">
                                Logout
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}
