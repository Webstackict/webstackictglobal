"use client";

import { useActionState, use, useState, useEffect } from "react";
import classes from "../dashboard/name-change-form.module.css";
import { toast } from "sonner";
import FormSubmitButton from "../ui/form-submit-button";
import { UserContext } from "@/store/user-context";
import { updateNames } from "@/actions/update-names";

export default function MyProfileForm({ affiliateData }) {
    const { user, setUser } = use(UserContext);
    const { displayName, fullName, phone, email, photoUrl } = user;

    const [inputs, setInputs] = useState({
        fullName: fullName || "",
        displayName: displayName || "",
        phone: phone || "",
        photoUrl: photoUrl || "",
    });

    const [errors, setErrors] = useState({
        fullName: "",
        displayName: "",
        phone: "",
    });

    useEffect(() => {
        setInputs({
            fullName: fullName || "",
            displayName: displayName || "",
            phone: phone || "",
            photoUrl: photoUrl || "",
        });
    }, [fullName, displayName, phone, photoUrl]);

    const [formState, formAction] = useActionState(
        async (prevState, formData) => {
            try {
                const res = await updateNames(prevState, formData);

                if (!res.errors) {
                    setUser((prev) => ({
                        ...prev,
                        fullName: res.user.full_name,
                        displayName: res.user.display_name,
                        phone: res.user.phone,
                        photoUrl: res.user.photo_url
                    }));
                    toast.success(res.message);
                    return {};
                }
                setErrors((prev) => ({ ...prev, ...res.errors }));
                return {};
            } catch (error) {
                toast.error("Failed to update account details, please try again");
                return {};
            }
        },
        {}
    );

    function handleInputChange(e, field) {
        setInputs((prev) => ({ ...prev, [field]: e.target.value }));
    }

    function handleInputFocus(field) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    return (
        <form className={classes.accountForm} action={formAction}>
            <div className={classes.row}>
                <div className={classes.field}>
                    <label htmlFor="fullName">Full name *</label>
                    <input
                        className={`${errors?.fullName && "error-background"}`}
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={inputs.fullName}
                        onChange={(e) => handleInputChange(e, "fullName")}
                        onFocus={() => handleInputFocus("fullName")}
                    />
                    {errors.fullName && <p className="error-message">{errors.fullName}</p>}
                </div>
                <div className={classes.field}>
                    <label htmlFor="displayName">Display name *</label>
                    <input
                        className={`${errors?.displayName && "error-background"}`}
                        type="text"
                        id="displayName"
                        name="displayName"
                        value={inputs.displayName}
                        placeholder="Enter a display name"
                        onChange={(e) => handleInputChange(e, "displayName")}
                        onFocus={() => handleInputFocus("displayName")}
                    />
                    {errors.displayName && <p className="error-message">{errors.displayName}</p>}
                </div>
            </div>

            <div className={classes.row}>
                <div className={classes.field}>
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                        className={`${errors?.phone && "error-background"}`}
                        type="tel"
                        id="phone"
                        name="phone"
                        value={inputs.phone}
                        placeholder="Enter your phone number"
                        onChange={(e) => handleInputChange(e, "phone")}
                        onFocus={() => handleInputFocus("phone")}
                    />
                    {errors.phone && <p className="error-message">{errors.phone}</p>}
                </div>
                <div className={classes.field}>
                    <label htmlFor="photoUrl">Profile Photo URL</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: '#1f2937', overflow: 'hidden', flexShrink: 0 }}>
                            {inputs.photoUrl ? <img src={inputs.photoUrl} alt="Preview" style={{ width: '100%', height: '100%', objectCover: 'cover' }} /> : null}
                        </div>
                        <input
                            type="text"
                            id="photoUrl"
                            name="photoUrl"
                            value={inputs.photoUrl}
                            placeholder="https://example.com/photo.jpg"
                            onChange={(e) => handleInputChange(e, "photoUrl")}
                            style={{ flex: 1 }}
                        />
                    </div>
                    <small className={classes.note}>Provide a link to your profile picture </small>
                </div>
            </div>

            <div className={classes.field}>
                <label htmlFor="email">Email *</label>
                <input
                    className={classes.email}
                    type="text"
                    id="email"
                    name="email"
                    value={email || ""}
                    disabled={true}
                />
                <small className={classes.note}>Email cannot be changed.</small>
            </div>

            {/* Payout Details - If approved */}
            {affiliateData?.affiliate_status === 'approved' ? (
                <div style={{ marginTop: '2rem', borderTop: '1px solid #1f2937', paddingTop: '2rem' }}>
                    <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Affiliate Payout Details</h3>
                    <div className={classes.row}>
                        <div className={classes.field}>
                            <label htmlFor="accountName">Account Name</label>
                            <input type="text" id="accountName" name="accountName" placeholder="Enter account name" defaultValue={affiliateData.account_name} />
                        </div>
                        <div className={classes.field}>
                            <label htmlFor="bankName">Bank Name</label>
                            <input type="text" id="bankName" name="bankName" placeholder="Enter bank name" defaultValue={affiliateData.bank_name} />
                        </div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.field}>
                            <label htmlFor="accountNumber">Account Number</label>
                            <input type="text" id="accountNumber" name="accountNumber" placeholder="Enter account number" defaultValue={affiliateData.account_number} />
                        </div>
                        <div className={classes.field}>
                            <label htmlFor="payoutMethod">Preferred Payment Method</label>
                            <select id="payoutMethod" name="payoutMethod" defaultValue={affiliateData.payout_method || "Bank Transfer"} style={{ background: '#0a0e17', color: '#fff', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #1f2937', width: '100%' }}>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Crypto Wallet">Crypto Wallet</option>
                            </select>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ marginTop: '2rem', padding: '1rem', border: '1px dashed #3b82f6', borderRadius: '0.5rem', color: '#60a5fa', textAlign: 'center' }}>
                    Your affiliate account must be approved before you can add payout details.
                </div>
            )}

            <FormSubmitButton className={classes.saveButton} icon="save" style={{ marginTop: '2rem' }}>
                Save Profile
            </FormSubmitButton>
        </form>
    );
}
