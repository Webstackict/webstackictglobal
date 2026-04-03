"use client";

import { useState, useEffect } from "react";
import {
    Settings, Image as ImageIcon, Globe, Key,
    Bell, CreditCard, Save, Upload, Plus,
    Lock, CheckCircle2, Mail, Landmark, Loader2, Link2, EyeOff, Eye
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [formData, setFormData] = useState({
        org_name: "", support_email: "", support_phone: "", address: "",
        bank_name: "", bank_account_name: "", bank_account_number: "",
        primary_logo_url: "", favicon_url: "",
        seo_title: "", seo_description: "", og_image_url: "",
        flutterwave_public_key: "", flutterwave_secret_key: "", flutterwave_secret_hash: "", sendgrid_api_key: "",
        admin_notification_emails: "", enable_registration_emails: true,
        enable_flutterwave: true, enable_bank_transfer: true, maintenance_mode: false
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showKeys, setShowKeys] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/admin/settings");
                const data = await res.json();
                if (data.settings) {
                    setFormData(prev => ({ ...prev, ...data.settings }));
                }
            } catch (err) {
                toast.error("Failed to load settings");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Settings saved successfully!");
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            toast.error("Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: "profile", label: "Profile & Bank", icon: Settings },
        { id: "branding", label: "Branding", icon: ImageIcon },
        { id: "seo", label: "SEO & Meta", icon: Globe },
        { id: "integrations", label: "API Integrations", icon: Key },
        { id: "notifications", label: "Email & Alerts", icon: Bell },
        { id: "billing", label: "Payment Gateways", icon: CreditCard }
    ];

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl pb-12">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">General Settings</h1>
                    <p className="text-sm text-gray-400">Manage site configuration, bank details, and SEO metadata.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-10 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg text-sm font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving ? "Saving..." : "Save Changes"}
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

                    {/* PROFILE & BANK */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl animate-in fade-in duration-300">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-blue-500" /> Site Profile
                                </h3>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-300 block">Organization Name</label>
                                            <input type="text" name="org_name" value={formData.org_name || ''} onChange={handleChange} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-300 block">Contact Email</label>
                                            <input type="email" name="support_email" value={formData.support_email || ''} onChange={handleChange} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-300 block">Support Phone</label>
                                        <input type="text" name="support_phone" value={formData.support_phone || ''} onChange={handleChange} className="w-full md:w-1/2 bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-300 block">Headquarters Address</label>
                                        <textarea name="address" rows={3} value={formData.address || ''} onChange={handleChange} className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner resize-none"></textarea>
                                    </div>

                                    <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-semibold text-white mb-1">Maintenance Mode</h4>
                                            <p className="text-xs text-gray-500">Temporarily disable public access to your site.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" name="maintenance_mode" checked={formData.maintenance_mode || false} onChange={handleChange} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl animate-in fade-in duration-300 delay-75">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Landmark className="w-5 h-5 text-emerald-500" /> Company Bank Details
                                </h3>
                                <p className="text-sm text-gray-400 mb-6">These details will be displayed to students globally on the checkout page for Direct Bank Transfers.</p>

                                <div className="space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-300 block">Bank Name</label>
                                        <input type="text" name="bank_name" value={formData.bank_name || ''} onChange={handleChange} placeholder="e.g. KUDA BANK" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-300 block">Account Name</label>
                                            <input type="text" name="bank_account_name" value={formData.bank_account_name || ''} onChange={handleChange} placeholder="e.g. WEBSTACK ICT GLOBAL" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-300 block">Account Number</label>
                                            <input type="text" name="bank_account_number" value={formData.bank_account_number || ''} onChange={handleChange} placeholder="e.g. 2044813585" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BRANDING */}
                    {activeTab === 'branding' && (
                        <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl animate-in fade-in duration-300">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-purple-500" /> Branding Assets
                            </h3>

                            <div className="space-y-8">
                                <div className="flex flex-col sm:flex-row gap-6 items-start">
                                    <div className="w-full sm:w-1/3">
                                        <h4 className="text-sm font-semibold text-white mb-1">Primary Logo URL</h4>
                                        <p className="text-xs text-gray-500">Provide an absolute URL to your primary transparent logo. Recommened 250x100px.</p>
                                    </div>
                                    <div className="w-full sm:w-2/3 space-y-3">
                                        <input type="text" name="primary_logo_url" value={formData.primary_logo_url || ''} onChange={handleChange} placeholder="https://example.com/logo.png" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50 transition-all shadow-inner" />
                                        {formData.primary_logo_url && (
                                            <div className="w-32 h-16 bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-center">
                                                <img src={formData.primary_logo_url} alt="Logo Preview" className="max-w-full max-h-full object-contain" onError={(e) => { e.target.style.display = 'none' }} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-6 items-start pt-6 border-t border-white/5">
                                    <div className="w-full sm:w-1/3">
                                        <h4 className="text-sm font-semibold text-white mb-1">Favicon URL</h4>
                                        <p className="text-xs text-gray-500">The small icon shown in browser tabs.</p>
                                    </div>
                                    <div className="w-full sm:w-2/3">
                                        <input type="text" name="favicon_url" value={formData.favicon_url || ''} onChange={handleChange} placeholder="https://example.com/favicon.ico" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-purple-500/50 transition-all shadow-inner" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SEO & META */}
                    {activeTab === 'seo' && (
                        <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl animate-in fade-in duration-300">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-emerald-500" /> SEO Configuration
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-300 block flex justify-between">
                                        Global Meta Title
                                        <span className={`text-xs ${formData.seo_title?.length > 60 ? 'text-rose-400' : 'text-gray-500'}`}>{formData.seo_title?.length || 0}/60 Recommended</span>
                                    </label>
                                    <input type="text" name="seo_title" value={formData.seo_title || ''} onChange={handleChange} placeholder="e.g. Webstack ICT Global | Tech Academy" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-300 block flex justify-between">
                                        Global Meta Description
                                        <span className={`text-xs ${formData.seo_description?.length > 160 ? 'text-rose-400' : 'text-gray-500'}`}>{formData.seo_description?.length || 0}/160 Recommended</span>
                                    </label>
                                    <textarea rows={3} name="seo_description" value={formData.seo_description || ''} onChange={handleChange} placeholder="A short description of your platform for Google Search..." className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner resize-none"></textarea>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-300 block">OG Social Share Image URL</label>
                                    <input type="text" name="og_image_url" value={formData.og_image_url || ''} onChange={handleChange} placeholder="https://example.com/social-preview.jpg" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner" />
                                    <p className="text-xs text-gray-500 mt-1">This image appears when your website is shared on Twitter, Facebook, or WhatsApp. Recommended 1200x630px.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* API INTEGRATIONS */}
                    {activeTab === 'integrations' && (
                        <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl animate-in fade-in duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Key className="w-5 h-5 text-amber-500" /> External APIs
                                </h3>
                                <button onClick={() => setShowKeys(!showKeys)} className="text-xs flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors bg-white/5 py-1.5 px-3 rounded-lg border border-white/10">
                                    {showKeys ? <><EyeOff className="w-3.5 h-3.5" /> Hide Keys</> : <><Eye className="w-3.5 h-3.5" /> Reveal Keys</>}
                                </button>
                            </div>

                            <div className="space-y-8">
                                {/* Flutterwave Settings */}
                                <div>
                                    <div className="flex items-center gap-3 mb-4 bg-[#111623] border border-white/5 p-3 rounded-xl">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-[#f5a623] shadow-inner text-xl">F</div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">Flutterwave Initialization</h4>
                                            <p className="text-xs text-gray-500">Connect your African payment gateway.</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Public Key</label>
                                            <input type={showKeys ? "text" : "password"} name="flutterwave_public_key" value={formData.flutterwave_public_key || ''} onChange={handleChange} placeholder="FLWPUBK_TEST-xxxx" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-amber-500/50 transition-all font-mono shadow-inner" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Secret Key</label>
                                            <input type={showKeys ? "text" : "password"} name="flutterwave_secret_key" value={formData.flutterwave_secret_key || ''} onChange={handleChange} placeholder="FLWSECK_TEST-xxxx" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-amber-500/50 transition-all font-mono shadow-inner" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Secret Hash</label>
                                            <input type={showKeys ? "text" : "password"} name="flutterwave_secret_hash" value={formData.flutterwave_secret_hash || ''} onChange={handleChange} placeholder="Your Custom Webhook Hash" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-amber-500/50 transition-all font-mono shadow-inner" />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-white/5 my-4"></div>

                                {/* SendGrid Settings */}
                                <div>
                                    <div className="flex items-center gap-3 mb-4 bg-[#111623] border border-white/5 p-3 rounded-xl">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-[#1a82e2] shadow-inner">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">SendGrid Delivery</h4>
                                            <p className="text-xs text-gray-500">Power automated email receipts and enrollment notifications.</p>
                                        </div>
                                    </div>
                                    <div className="pl-2">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">API Key</label>
                                            <input type={showKeys ? "text" : "password"} name="sendgrid_api_key" value={formData.sendgrid_api_key || ''} onChange={handleChange} placeholder="SG.xxxx" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-amber-500/50 transition-all font-mono shadow-inner" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* EMAIL & ALERTS */}
                    {activeTab === 'notifications' && (
                        <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl animate-in fade-in duration-300">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-rose-500" /> Email & Automated Alerts
                            </h3>

                            <div className="space-y-8">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-300 block">Admin Notification Emails</label>
                                    <textarea rows={2} name="admin_notification_emails" value={formData.admin_notification_emails || ''} onChange={handleChange} placeholder="admin1@example.com, admin2@example.com" className="w-full bg-[#111623] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-rose-500/50 transition-all shadow-inner resize-none"></textarea>
                                    <p className="text-xs text-gray-500 mt-1">Comma-separated list of emails that will receive alerts when a new student enrolls or registers.</p>
                                </div>

                                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-semibold text-white mb-1">Registration Confirmation Emails</h4>
                                        <p className="text-xs text-gray-500">Automatically send a welcome/confirmation email to new students.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" name="enable_registration_emails" checked={formData.enable_registration_emails !== false} onChange={handleChange} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PAYMENT GATEWAYS */}
                    {activeTab === 'billing' && (
                        <div className="bg-[#0a0e17]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl animate-in fade-in duration-300">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-blue-500" /> Active Payment Routes
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-[#111623] border border-white/5 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-[#f5a623] shadow-inner text-xl">F</div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white mb-0.5">Flutterwave Checkout</h4>
                                            <p className="text-xs text-gray-500">Accept automated Cards, Bank Transfers, and USSD via the frontend popup.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" name="enable_flutterwave" checked={formData.enable_flutterwave !== false} onChange={handleChange} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-[#111623] border border-white/5 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-white border border-white/10 shadow-inner">
                                            <Landmark className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white mb-0.5">Manual Bank Transfer</h4>
                                            <p className="text-xs text-gray-500">Display your company bank accounts and require manual admin approval.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" name="enable_bank_transfer" checked={formData.enable_bank_transfer !== false} onChange={handleChange} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
