"use client";

import { useState } from "react";
import {
    Settings, Image as ImageIcon, Globe, Key,
    Bell, CreditCard, Save, Upload, Plus,
    Lock, CheckCircle2, Mail
} from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Site Profile", icon: Settings },
        { id: "branding", label: "Branding", icon: ImageIcon },
        { id: "seo", label: "SEO & Meta", icon: Globe },
        { id: "integrations", label: "API Integrations", icon: Key },
        { id: "notifications", label: "Email & Alerts", icon: Bell },
        { id: "billing", label: "Payment Gateways", icon: CreditCard }
    ];

    return (
        <div className="space-y-6 max-w-6xl pb-12">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">General Settings</h1>
                    <p className="text-sm text-gray-400">Manage site configuration, API integrations, and SEO metadata.</p>
                </div>
                <div className="flex gap-3">
                    <button className="h-10 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg text-sm font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Custom Vertical Tabs */}
                <div className="md:col-span-1 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all group flex items-center gap-3
                                ${activeTab === tab.id
                                    ? 'bg-[#111623] text-blue-400 border border-white/10 shadow-lg'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-300'}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Settings Form Content */}
                <div className="md:col-span-3 space-y-6">

                    {activeTab === 'profile' && (
                        <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-blue-500" /> Site Profile
                            </h3>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-300 block">Organization Name</label>
                                        <input type="text" defaultValue="Webstack ICT Global" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-300 block">Contact Email</label>
                                        <input type="email" defaultValue="hello@webstackict.com" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-300 block">Support Phone</label>
                                    <input type="text" defaultValue="+234 800 123 4567" className="w-full md:w-1/2 bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-300 block">Headquarters Address</label>
                                    <textarea rows={3} defaultValue="123 Tech Avenue, Silicon Valley, CA 94025" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner resize-none"></textarea>
                                </div>

                                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-semibold text-white mb-1">Maintenance Mode</h4>
                                        <p className="text-xs text-gray-500">Temporarily disable public access to your site.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                    </label>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'branding' && (
                        <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-purple-500" /> Branding Assets
                            </h3>

                            <div className="space-y-8">
                                <div className="flex flex-col sm:flex-row gap-6 items-start">
                                    <div className="w-full sm:w-1/3">
                                        <h4 className="text-sm font-semibold text-white mb-1">Primary Logo</h4>
                                        <p className="text-xs text-gray-500">Used in main navigation and headers. Recommended size: 250x100px.</p>
                                    </div>
                                    <div className="w-full sm:w-2/3 flex items-center gap-4">
                                        <div className="w-32 h-16 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                                            <span className="text-xs font-bold text-gray-500">Current Logo</span>
                                        </div>
                                        <button className="px-4 py-2 bg-[#111623] border border-white/10 hover:bg-white/5 rounded-lg text-sm font-medium text-gray-300 transition-all flex items-center gap-2">
                                            <Upload className="w-4 h-4" /> Upload New
                                        </button>
                                    </div>
                                </div>
                                <hr className="border-white/5" />
                                <div className="flex flex-col sm:flex-row gap-6 items-start">
                                    <div className="w-full sm:w-1/3">
                                        <h4 className="text-sm font-semibold text-white mb-1">Favicon</h4>
                                        <p className="text-xs text-gray-500">Used in browser tabs. Must be a square image (32x32px).</p>
                                    </div>
                                    <div className="w-full sm:w-2/3 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                                            <span className="text-xs font-bold text-gray-500">ICON</span>
                                        </div>
                                        <button className="px-4 py-2 bg-[#111623] border border-white/10 hover:bg-white/5 rounded-lg text-sm font-medium text-gray-300 transition-all flex items-center gap-2">
                                            <Upload className="w-4 h-4" /> Upload New
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'seo' && (
                        <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-emerald-500" /> SEO Configuration
                            </h3>
                            <form className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-300 block">Global SEO Title</label>
                                    <input type="text" defaultValue="Webstack ICT Global - Premier Tech Training" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-300 block">Meta Description</label>
                                    <textarea rows={3} defaultValue="Empowering the next generation of tech leaders through immersive full-stack, data science, and cybersecurity training." className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner resize-none"></textarea>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-300 block">Keywords (Comma separated)</label>
                                    <input type="text" defaultValue="tech training, full stack, coding bootcamp, web development" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner" />
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Key className="w-5 h-5 text-amber-500" /> API Integrations
                            </h3>

                            <div className="space-y-4">
                                {/* Stripe Webhook */}
                                <div className="p-4 border border-white/10 bg-[#111623] rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:border-amber-500/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white flex items-center justify-center rounded-lg shadow-inner">
                                            {/* Stripe Logo Placeholder */}
                                            <span className="text-[#635BFF] font-bold text-xl">S</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white flex items-center gap-2">Stripe Payments <CheckCircle2 className="w-4 h-4 text-emerald-500" /></h4>
                                            <p className="text-xs text-gray-500">Connected to live environment</p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-semibold rounded-lg transition-colors">Configure</button>
                                </div>

                                {/* SendGrid API */}
                                <div className="p-4 border border-white/10 bg-[#111623] rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:border-amber-500/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center rounded-lg border border-blue-500/20 text-blue-400">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white flex items-center gap-2">SendGrid <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Needs Auth</span></h4>
                                            <p className="text-xs text-gray-500">Email delivery service</p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold rounded-lg transition-all shadow-md mt-2 sm:mt-0">Connect</button>
                                </div>

                                {/* Google Analytics */}
                                <div className="p-4 border border-white/10 bg-[#111623] rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:border-amber-500/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-orange-500/10 flex items-center justify-center rounded-lg border border-orange-500/20 text-orange-400">
                                            <span className="font-bold font-serif italic text-xl">G</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white flex items-center gap-2">Google Analytics <CheckCircle2 className="w-4 h-4 text-emerald-500" /></h4>
                                            <p className="text-xs text-gray-500">Tracking code embedded</p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-semibold rounded-lg transition-colors">Configure</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {(activeTab === 'notifications' || activeTab === 'billing') && (
                        <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-12 text-center shadow-2xl flex flex-col items-center justify-center">
                            <Lock className="w-12 h-12 text-gray-600 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Advanced Settings Locked</h3>
                            <p className="text-sm text-gray-400 max-w-sm">This settings pane requires Super Admin privileges. Please contact your system administrator to access these configurations.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
