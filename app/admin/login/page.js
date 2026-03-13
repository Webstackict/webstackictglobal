"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, LayoutDashboard, Users, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                // Show error message from API
                alert(data.error || 'Login failed');
                return;
            }

            // Success!
            router.push("/admin/dashboard");
        } catch (error) {
            console.error('Login error:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#06080d] flex font-sans selection:bg-blue-500/30">
            {/* Left Hemisphere - Branding & Features (Hidden on Mobile) */}
            <div className="hidden lg:flex flex-col justify-between w-[45%] max-w-[600px] p-12 relative overflow-hidden border-r border-white/5 bg-[#0a0e17]">
                {/* Glowing Orbs for ambient background */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen" />
                    <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen" />
                </div>

                <div className="relative z-10">
                    <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-12 backdrop-blur-md">
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="text-xs font-semibold tracking-wider text-blue-200 uppercase">System Operational</span>
                    </div>

                    <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
                        Enterprise <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            Management Portal
                        </span>
                    </h1>

                    <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                        The centralized command center for Webstack ICT Global. Oversee cohorts, manage applications, and track global operations.
                    </p>
                </div>

                <div className="relative z-10 space-y-8 mt-12 flex-1 flex flex-col justify-center">
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                                <LayoutDashboard className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Unified Dashboard</h3>
                                <p className="text-sm text-gray-500">Real-time metrics, revenue tracking, and cohort performance all in one place.</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Admissions Control</h3>
                                <p className="text-sm text-gray-500">Seamlessly process thousands of student applications and scholarship requests.</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Enterprise Security</h3>
                                <p className="text-sm text-gray-500">Bank-grade encryption, role-based access control, and detailed activity logging.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mt-auto">
                    <div className="text-xs text-gray-600 uppercase tracking-widest font-semibold">
                        © {new Date().getFullYear()} Webstack ICT Global
                    </div>
                </div>
            </div>

            {/* Right Hemisphere - Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-hidden">
                {/* Subtle grid background for the form side */}
                <div
                    className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                <div className="w-full max-w-[420px] relative z-10">
                    <div className="lg:hidden text-center mb-10">
                        <span className="inline-block p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 mb-4 shadow-lg">
                            <ShieldCheck className="w-8 h-8 text-blue-400" />
                        </span>
                        <h2 className="text-2xl font-bold text-white mb-2">Webstack Admin</h2>
                        <p className="text-gray-400 text-sm">Sign in to access the command center</p>
                    </div>

                    <div className="bg-[#0b0f19]/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 rounded-2xl p-8 sm:p-10 relative group">
                        {/* Shimmer top border line */}
                        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent group-hover:via-blue-400 transition-all duration-500"></div>

                        <div className="mb-8 hidden lg:block">
                            <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">Welcome back</h2>
                            <p className="text-gray-400 text-sm">Enter your credentials to securely access your account.</p>
                        </div>

                        <form className="space-y-5" onSubmit={handleLogin}>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-300 ml-1">
                                    Work Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/80 transition-all text-sm shadow-inner"
                                    placeholder="admin@webstackict.com"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Password
                                    </label>
                                    <a href="#" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                        Recover password
                                    </a>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/80 transition-all text-sm shadow-inner"
                                    placeholder="••••••••••••"
                                />
                            </div>

                            <div className="flex items-center pt-2">
                                <div className="relative flex items-start">
                                    <div className="flex h-5 items-center">
                                        <input
                                            id="remember"
                                            name="remember"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-700 bg-[#111623] text-blue-500 focus:ring-blue-500/50"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="font-medium text-gray-400">Keep me logged in</label>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 border border-blue-400/20 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                                >
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000"></div>
                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Authenticating...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <span>Sign In</span>
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    <p className="text-center text-xs text-gray-600 mt-8 font-medium">
                        Secure Enterprise Portal. All access attempts are logged.
                    </p>
                </div>
            </div>
        </div>
    );
}
