"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle, Mail } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function SignupPage() {
  const router = useRouter();

  // --- STATES ---
  const [step, setStep] = useState(1); // 1 = Form, 2 = Verification
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+92");

  // Form Data
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  // Verification Code
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- LOGIC ---

  // Email Regex
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle Input Changes
  const handleChange = (e: any) => {
    if (e.target.name === "phone") {
      const numericValue = e.target.value.replace(/[^0-9]/g, "");
      if (numericValue.length <= 10) {
        setForm({ ...form, phone: numericValue });
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // STEP 1: SIGNUP (Send Code)
  const handleSignup = async (e: any) => {
    e.preventDefault();

    // Validation
    if (!isValidEmail(form.email)) return alert("Invalid Email");
    if (form.phone.length !== 10) return alert("Phone must be 10 digits");
    if (form.password.length < 8) return alert("Password must be 8+ chars");
    if (form.password !== form.confirmPassword) return alert("Passwords do not match");

    setLoading(true);

    const fullPhoneNumber = `${countryCode}${form.phone}`;

    try {
      // 👇 Old '/api/register' ki jagah new '/api/auth/signup' use karein
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: fullPhoneNumber // Agar backend main phone add kia hai to ye save hoga
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(2); // 👇 Go to Verification Step
        alert("Verification Code Sent to Email! 📧");
      } else {
        alert(data.error || "Signup Failed");
      }
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: VERIFY CODE
  const handleVerify = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code: otp }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account Verified Successfully! 🎉");
        router.push("/login");
      } else {
        alert(data.error || "Invalid Code");
      }
    } catch (error) {
      alert("Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
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

        alert("Account Created & Verified with Google! 🎉");
        router.push("/dashboard");
      } else {
        alert(data.error || "Google Signup Failed");
      }
    } catch (err) {
      console.error(err);
      alert("Google sign-up popup closed or failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">

      {/* Left Side (Image) - Same as before */}
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
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">Start your journey into the future.</h2>
          <p className="text-blue-100 mt-4 text-lg">Join our community and unlock endless possibilities.</p>
        </div>
        <p className="relative z-20 text-xs text-blue-300">© 2024 VSP. All rights reserved.</p>
      </div>

      {/* Right Side (Dynamic Form) */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24 bg-gray-50 relative">

        {/* Back Button */}
        {step === 1 && (
          <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-blue-800 transition-colors">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="text-sm font-bold hidden sm:block">Back to Home</span>
          </Link>
        )}

        <div className="w-full max-w-md space-y-8 mt-8 md:mt-0">

          <div className="text-center md:text-left">
            <h2 className="md:hidden text-3xl font-extrabold text-blue-900 mb-2">VSP</h2>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 tracking-tight">
              {step === 1 ? "Create Account" : "Verify Email"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === 1 ? "Get started in a few clicks." : `Enter the 6-digit code sent to ${form.email}`}
            </p>
          </div>

          {/* --- STEP 1: SIGNUP FORM --- */}
          {step === 1 && (
            <>
              {/* Google Auth Button */}
              <button
                onClick={handleGoogleSignup}
                disabled={loading}
                type="button"
                className="mt-8 w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>

              <div className="relative mt-8 mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-gray-50 text-gray-500 font-medium">Or sign up with email</span>
                </div>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                <div className="space-y-4">

                  {/* Name */}
                  <div className="relative">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                    <input name="name" type="text" required onChange={handleChange}
                      className="appearance-none relative block w-full px-4 py-3 mt-1 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm transition-all" placeholder="Fahad Ali" />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                    <input name="email" type="email" required onChange={handleChange}
                      className="appearance-none relative block w-full px-4 py-3 mt-1 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm transition-all" placeholder="name@work.com" />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                    <div className="flex mt-1">
                      <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}
                        className="h-[46px] px-3 border border-r-0 border-gray-300 bg-gray-100 rounded-l-md text-gray-600 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600">
                        <option value="+92">🇵🇰 +92</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+971">🇦🇪 +971</option>
                      </select>
                      <input name="phone" type="tel" required value={form.phone} onChange={handleChange}
                        className="appearance-none flex-1 block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm transition-all"
                        placeholder="3001234567" />
                    </div>
                  </div>

                  {/* Passwords */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                      <div className="relative mt-1">
                        <input name="password" type={showPassword ? "text" : "password"} required onChange={handleChange}
                          className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm transition-all pr-10" placeholder="Min 8 chars" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                          {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Confirm</label>
                      <div className="relative mt-1">
                        <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required onChange={handleChange}
                          className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm transition-all pr-10" placeholder="Min 8 chars" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                          {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <button type="submit" disabled={loading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors shadow-sm hover:shadow-md disabled:bg-blue-400">
                    {loading ? <Loader2 className="animate-spin" /> : "Sign Up & Verify ->"}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* --- STEP 2: VERIFICATION FORM --- */}
          {step === 2 && (
            <form className="mt-8 space-y-6" onSubmit={handleVerify}>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                  <Mail size={24} />
                </div>
                <p className="text-sm text-blue-800 mb-4 font-medium">
                  We've sent a 6-digit code to <br /> <span className="font-bold">{form.email}</span>
                </p>

                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center text-3xl font-bold tracking-widest py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 bg-white"
                />
              </div>

              <button type="submit" disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm hover:shadow-md disabled:bg-green-400">
                {loading ? <Loader2 className="animate-spin" /> : <>Verify & Create Account <CheckCircle className="ml-2" size={18} /></>}
              </button>

              <div className="text-center">
                <button type="button" onClick={() => setStep(1)} className="text-sm text-slate-500 hover:text-blue-600 underline">
                  Change Email / Back
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-blue-800 hover:text-blue-600 transition-colors">
                  Sign in instead
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}