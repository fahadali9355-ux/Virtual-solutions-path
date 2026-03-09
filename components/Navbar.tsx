"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/#courses-section" },
    { label: "Blogs", href: "/blogs" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        if (email) setIsLoggedIn(true);

        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav
                className={`fixed w-full z-50 transition-all duration-300 ${scrolled
                        ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-slate-100"
                        : "bg-white/90 backdrop-blur-xl border-b border-slate-100"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between py-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-[#082F49]">
                        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
                            <img src="/images/img1.png" alt="VSP Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="hidden sm:block">Virtual Solution Path</span>
                        <span className="sm:hidden font-extrabold text-[#082F49]">VSP</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex gap-7 text-sm font-semibold text-slate-600">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`hover:text-blue-600 transition-colors relative pb-1 ${pathname === link.href
                                        ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full"
                                        : ""
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth + Hamburger */}
                    <div className="flex items-center gap-3">
                        {isLoggedIn ? (
                            <Link href="/dashboard/courses" className="hidden md:flex">
                                <button className="bg-[#082F49] text-white px-5 py-2.5 rounded-full font-bold shadow-lg hover:bg-[#0C4A6E] transition-all text-sm flex items-center gap-2">
                                    <LayoutDashboard size={16} />
                                    Dashboard
                                </button>
                            </Link>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-5 py-2.5 text-[#082F49] font-bold hover:bg-slate-50 rounded-full transition-all text-sm"
                                >
                                    Log In
                                </Link>
                                <Link href="/signup">
                                    <button className="bg-[#0284C7] text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-blue-500/25 hover:bg-[#0369A1] hover:-translate-y-0.5 transition-all text-sm">
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        )}

                        {/* Hamburger */}
                        <button
                            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-0 top-[73px] z-40 bg-white/97 backdrop-blur-2xl shadow-2xl border-b border-slate-100 md:hidden"
                    >
                        <div className="flex flex-col px-6 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-base font-bold py-2 transition-colors ${pathname === link.href ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                                {isLoggedIn ? (
                                    <Link
                                        href="/dashboard/courses"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full bg-[#082F49] text-white py-3 rounded-xl shadow font-bold flex items-center justify-center gap-2"
                                    >
                                        <LayoutDashboard size={18} /> Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-center font-bold text-[#082F49] py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-center font-bold bg-[#0284C7] text-white py-3 rounded-xl shadow-lg shadow-blue-500/25 hover:bg-[#0369A1] transition-colors"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
