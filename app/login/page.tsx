"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Password Visibility State
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userRole", data.user.role || "student");

        if (data.user.role === "admin") {
          router.push("/admin");
        } else {
          // 👇 CHANGE IS HERE: Ab ye seedha Dashboard (Overview) par jayega
          router.push("/dashboard");
        }

      } else {
        setError(data.error || "Invalid Credentials");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          image: user.photoURL,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userRole", data.user.role || "student");

        if (data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(data.error || "Google Auth Failed");
      }
    } catch (err) {
      console.error(err);
      setError("Google sign-in popup closed or failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">

      {/* Left Side - Image Section */}
      <div className="md:w-1/2 bg-blue-900 relative overflow-hidden hidden md:flex flex-col justify-between p-10 text-white text-center md:text-left">
        <div className="absolute inset-0 bg-cover bg-center z-0 opacity-40 hover:scale-105 transition-transform duration-700" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-900/70 to-transparent z-10"></div>
        <div className="relative  z-20 mt-10">
          <div className="relative flex z-20 mt-10">
            <div><img src="/images/img1.png" alt="Course Image" className="w-10 h-10 rounded-lg" /></div>
            <h1 className="text-4xl font-extrabold tracking-tight">VSP</h1>
          </div>
          <p className="text-blue-200 tracking-wider uppercase text-sm">Virtual Solutions Path</p>
        </div>
        <div className="relative z-20 mb-20">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">Welcome back!</h2>
          <p className="text-blue-100 mt-4 text-lg">Sign in to continue your learning journey.</p>
        </div>
        <p className="relative z-20 text-xs text-blue-300">© 2024 VSP. All rights reserved.</p>
      </div>

      {/* Right Side - Form Section */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24 bg-gray-50 relative">

        {/* Back Button */}
        <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-blue-800 transition-colors">
          <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-bold hidden sm:block">Back to Home</span>
        </Link>

        <div className="w-full max-w-md space-y-8 mt-8 md:mt-0">

          <div className="text-center md:text-left">
            <h2 className="md:hidden text-3xl font-extrabold text-blue-900 mb-2">VSP</h2>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 tracking-tight">Sign In</h2>
            <p className="mt-2 text-sm text-gray-600">Access your account.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium border border-red-200 text-center">
              {error}
            </div>
          )}

          {/* Google Auth Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="relative mt-8 mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-gray-50 text-gray-500 font-medium">Or log in with email</span>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">

              <div className="relative">
                <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 mt-1 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm transition-all"
                  placeholder="name@work.com"
                />
              </div>

              {/* Password Input with Eye */}
              <div className="relative">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <Link href="/forgot-password" className="text-xs font-medium text-blue-800 hover:text-blue-600">
                    Forgot password?
                  </Link>
                </div>

                <div className="relative mt-1">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm transition-all pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    )}
                  </button>
                </div>
              </div>

            </div>

            <div>
              <button type="submit" disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors shadow-sm hover:shadow-md disabled:bg-blue-400">
                {loading ? <Loader2 className="animate-spin" /> : "Sign In ->"}
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-blue-800 hover:text-blue-600 transition-colors">
                Create free account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}