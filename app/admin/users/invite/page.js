"use client";

import { inviteUser } from "@/actions/auth-actions";
import { useState } from "react";
import { toast } from "sonner";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import FormSubmitButton from "@/components/ui/form-submit-button";

const EmailIcon = iconsConfig["email"];
const UserPlusIcon = iconsConfig["userPlus"] || iconsConfig["security"];

export default function InviteUserPage() {
    const [loading, setLoading] = useState(false);

    async function handleInvite(e) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const email = formData.get("email");

        try {
            const res = await inviteUser(email);
            if (res.success) {
                toast.success(`Invitation sent to ${email}`);
                e.target.reset();
            }
        } catch (error) {
            toast.error(error.message || "Failed to send invitation");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-[#0a0e17] border border-white/5 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
                    <UserPlusIcon className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">Invite New User</h1>
                    <p className="text-sm text-gray-400">Send an invitation email to a new member.</p>
                </div>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                    <div className="relative">
                        <EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            placeholder="user@example.com"
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                <FormSubmitButton className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl font-bold transition-all" disabled={loading}>
                    {loading ? "Sending Invitation..." : "Send Invitation"}
                </FormSubmitButton>
            </form>
        </div>
    );
}
