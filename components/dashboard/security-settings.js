"use client";

import { useState } from "react";
import { reauthenticate, changeEmail, updatePassword } from "@/actions/auth-actions";
import { toast } from "sonner";
import FormSubmitButton from "@/components/ui/form-submit-button";

export default function SecuritySettings() {
    const [showReauth, setShowReauth] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // { type: 'email' | 'password', data: any }
    const [loading, setLoading] = useState(false);

    async function handleReauth(e) {
        e.preventDefault();
        setLoading(true);
        const password = new FormData(e.target).get("password");

        const res = await reauthenticate(password);
        if (res.success) {
            setShowReauth(false);
            if (pendingAction.type === 'email') {
                const emailRes = await changeEmail(pendingAction.data.newEmail);
                if (emailRes.success) {
                    toast.success(emailRes.message);
                } else {
                    toast.error(emailRes.error);
                }
            } else if (pendingAction.type === 'password') {
                // Password update usually doesn't need reauth if done right after login, 
                // but for sensitive changes we do it.
                const formData = new FormData();
                formData.append("password", pendingAction.data.password);
                formData.append("confirmPassword", pendingAction.data.confirmPassword);
                const passRes = await updatePassword(null, formData);
                if (passRes.success) {
                    toast.success("Password updated successfully");
                } else {
                    toast.error(Object.values(passRes.errors)[0]);
                }
            }
            setPendingAction(null);
        } else {
            toast.error(res.error || "Incorrect password");
        }
        setLoading(false);
    }

    function triggerEmailChange(e) {
        e.preventDefault();
        const newEmail = new FormData(e.target).get("newEmail");
        setPendingAction({ type: 'email', data: { newEmail } });
        setShowReauth(true);
    }

    function triggerPasswordChange(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const password = formData.get("newPassword");
        const confirmPassword = formData.get("confirmPassword");
        setPendingAction({ type: 'password', data: { password, confirmPassword } });
        setShowReauth(true);
    }

    return (
        <div className="space-y-6">
            {/* Email Change Section */}
            <div className="p-6 bg-[#0a0e17] border border-white/5 rounded-2xl">
                <h3 className="text-lg font-semibold text-white mb-4">Change Email Address</h3>
                <form onSubmit={triggerEmailChange} className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-xs text-gray-400">New Email Address</label>
                        <input
                            type="email"
                            name="newEmail"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl text-white font-semibold transition-all">
                        Update Email
                    </button>
                </form>
            </div>

            {/* Password Change Section */}
            <div className="p-6 bg-[#0a0e17] border border-white/5 rounded-2xl">
                <h3 className="text-lg font-semibold text-white mb-4">Update Password</h3>
                <form onSubmit={triggerPasswordChange} className="grid grid-cols-2 gap-4 items-end">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                        />
                    </div>
                    <button className="col-span-2 bg-blue-600 hover:bg-blue-500 py-2 rounded-xl text-white font-semibold transition-all">
                        Update Password
                    </button>
                </form>
            </div>

            {/* Reauthentication Modal */}
            {showReauth && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl">
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-bold text-white mb-2">Verify it&apos;s you</h2>
                            <p className="text-gray-400 text-sm">Please enter your current password to continue with this sensitive action.</p>
                        </div>
                        <form onSubmit={handleReauth} className="space-y-4">
                            <input
                                type="password"
                                name="password"
                                required
                                autoFocus
                                placeholder="Current Password"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowReauth(false)}
                                    className="py-3 px-6 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all font-semibold"
                                >
                                    Cancel
                                </button>
                                <FormSubmitButton className="bg-blue-600 hover:bg-blue-500 py-3 px-6 rounded-xl font-bold">
                                    {loading ? "Verifying..." : "Confirm"}
                                </FormSubmitButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
