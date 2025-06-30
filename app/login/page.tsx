'use client';

import axios from "@/lib/api";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { useUserStore } from "@/store/useUserStore";
import toast from 'react-hot-toast'
import type { LoginResponseModel } from "@/types/dtos";
import Link from "next/link";

type LoginRequest = {
  userId: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginRequest>();
  const router = useRouter();
  const setToken = useUserStore((state) => state.setToken);
  const setUser = useUserStore((state) => state.setUser);

  const onSubmit = async (data: LoginRequest) => {
    try {
      const res = await axios.post<LoginResponseModel>("/account/login", data);

      if (res.data.isSuccess && res.data.jwtToken) {
        setToken(res.data.jwtToken);

        const profile = res.data.userProfile;
        setUser(profile.id, profile.userId, profile.userName);
        toast.success(
          <div>
            <div>Login Success!</div>
            <div>Welcome, <b>{profile.userName}!</b></div>
          </div>);
        router.push("/");
      } else {
        toast.error(res.data.msg || "Login failed");
      }
      // eslint-disable-next-line
    } catch (err: any) {
      console.error("Login error", err);
      if (err.response?.status === 400) {
        alert("Invalid credentials. Please check your User ID and password.");
      } else {
        alert("Server error. Please try again later.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 space-y-4">
      <div>
        <label className="block mb-1 font-medium">User ID</label>
        <input
          {...register("userId", { required: "User ID is required" })}
          className="form-input"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          {...register("password", { required: "Password is required" })}
          className="form-input"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
      >
        Login
      </button>
      <div className="form-footer">
        Don’t have an account?{' '}
        <Link href="/register" className="form-link font-medium">
          Sign up
        </Link>
      </div>
    </form>
  );
}
  