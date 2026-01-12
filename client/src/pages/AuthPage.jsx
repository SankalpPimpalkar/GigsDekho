import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContextProvider";

export default function AuthPage() {
    const { refetchUser } = useAuth()
    const [mode, setMode] = useState("login");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const isLogin = mode === "login";

    const registerMutation = useMutation({
        mutationFn: authAPI.register,
        onSuccess: (data) => {
            console.log("Registered:", data);
            toast.success(data.message)
            setMode("login")
        },
        onError: (err) => {
            console.error(err);
            toast.success(err.message)
        }
    });

    const loginMutation = useMutation({
        mutationFn: authAPI.login,
        onSuccess: (data) => {
            console.log("Logged in:", data);
            toast.success(data.message)
            refetchUser()
        },
        onError: (err) => {
            console.error(err);
            toast.success(data.message)
        }
    });


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            loginMutation.mutate({
                email: formData.email,
                password: formData.password
            });
        } else {
            registerMutation.mutate(formData);
        }
    };

    const isLoading =
        loginMutation.isPending || registerMutation.isPending;

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
            <div className="card bg-base-100 shadow-sm w-full max-w-lg rounded-md">
                <div className="card-body p-6 space-y-5">

                    <div className="space-y-1">
                        <h1 className="text-2xl font-extrabold">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="text-sm text-base-content/60">
                            {isLogin
                                ? "Login to continue"
                                : "Register to get started"}
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>

                        {!isLogin && (
                            <input
                                name="name"
                                type="text"
                                placeholder="Full Name"
                                className="input input-bordered w-full"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        )}

                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="input input-bordered w-full"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="input input-bordered w-full"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <button
                            type="submit"
                            className="btn btn-neutral w-full"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Please wait..."
                                : isLogin
                                    ? "Login"
                                    : "Register"}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="text-center text-sm text-base-content/60">
                        {isLogin ? (
                            <>
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    className="link link-primary"
                                    onClick={() => setMode("register")}
                                >
                                    Register
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    className="link link-primary"
                                    onClick={() => setMode("login")}
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
