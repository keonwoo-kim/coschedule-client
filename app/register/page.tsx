'use client';

import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import axios from "@/lib/api";

type RegisterForm = {
  userId: string;
  userName: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<RegisterForm>();

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await axios.post("/account/register", {
        userid: data.userId,
        username: data.userName,
        password: data.password,
        confirmPassword: data.confirmPassword
      });
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to create an account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 space-y-4">
      <div>
        <label className="block mb-1 font-medium">ID</label>
        <input
          {...register("userId", { required: "ID is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.userId && <p className="text-red-500 text-sm mt-1">{errors.userId.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Username</label>
        <input
          {...register("userName", { required: "User name is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.userName && (
          <p className="text-red-500 text-sm mt-1">{errors.userName.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          {...register("password", { required: "Password is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Confirm Password</label>
        <input
          type="password"
          {...register("confirmPassword", {
            required: "Please confirm password",
            validate: (value) => value === password || "Passwords do not match"
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded text-white font-medium transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
