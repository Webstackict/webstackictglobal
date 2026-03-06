'use client';

import { useState } from 'react';
import { submitScholarshipApplication } from '@/lib/db/submit-scholarship';
import classes from './scholarship-form.module.css';

export default function ScholarshipForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg("");

        const formData = new FormData(e.target);

        // Client-side file size validation (5MB) before sending to server
        const passport = formData.get('passportPhoto');
        const validId = formData.get('validId');
        const MAX_SIZE = 5 * 1024 * 1024;

        if (passport && passport.size > MAX_SIZE) {
            setErrorMsg("Your passport photograph must be less than 5MB.");
            setIsSubmitting(false);
            return;
        }

        if (validId && validId.size > MAX_SIZE) {
            setErrorMsg("Your valid ID must be less than 5MB.");
            setIsSubmitting(false);
            return;
        }

        try {
            const result = await submitScholarshipApplication(formData);
            if (result?.error) {
                setErrorMsg(result.error);
            } else if (result?.success) {
                setSuccess(true);
            }
        } catch (err) {
            setErrorMsg("A network error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className={classes.successMsg}>
                <h3>🎉 Application Received!</h3>
                <p>Your scholarship application has been successfully submitted.</p>
                <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Next Steps:</p>
                <p>Please check your email shortly. You will receive instructions on how to pay the ₦30,000 application processing fee.</p>
            </div>
        );
    }

    return (
        <form className={classes.form} onSubmit={handleSubmit}>
            {errorMsg && <div className={classes.errorMsg}>{errorMsg}</div>}

            <div className={classes.row}>
                <div className={classes.field}>
                    <label htmlFor="fullName">Full Name <span>*</span></label>
                    <input type="text" id="fullName" name="fullName" className={classes.input} required placeholder="John Doe" />
                </div>
                <div className={classes.field}>
                    <label htmlFor="email">Email Address <span>*</span></label>
                    <input type="email" id="email" name="email" className={classes.input} required placeholder="john@example.com" />
                </div>
            </div>

            <div className={classes.row}>
                <div className={classes.field}>
                    <label htmlFor="phone">Phone Number <span>*</span></label>
                    <input type="tel" id="phone" name="phone" className={classes.input} required placeholder="+234..." />
                </div>
                <div className={classes.field}>
                    <label htmlFor="age">Age <span>*</span></label>
                    <input type="number" id="age" name="age" className={classes.input} required min="16" max="99" placeholder="e.g. 22" />
                </div>
            </div>

            <div className={classes.row}>
                <div className={classes.field}>
                    <label htmlFor="state">State of Residence <span>*</span></label>
                    <input type="text" id="state" name="state" className={classes.input} required placeholder="e.g. Lagos" />
                </div>
                <div className={classes.field}>
                    <label htmlFor="program">Program of Interest <span>*</span></label>
                    <select id="program" name="program" className={classes.select} required defaultValue="">
                        <option value="" disabled>Select a Program...</option>
                        <option value="Data Analysis">Data Analysis</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="Forex Trading">Forex Trading</option>
                    </select>
                </div>
            </div>

            <div className={classes.field}>
                <label htmlFor="reason">Why do you want this scholarship? <span>*</span></label>
                <textarea
                    id="reason"
                    name="reason"
                    className={classes.textarea}
                    required
                    placeholder="Tell us why you are passionate about tech and how this scholarship will impact your life..."
                ></textarea>
            </div>

            <div className={classes.field}>
                <label htmlFor="hasLaptop">Do you have a laptop? <span>*</span></label>
                <select id="hasLaptop" name="hasLaptop" className={classes.select} required defaultValue="">
                    <option value="" disabled>Select Yes or No...</option>
                    <option value="yes">Yes, I have a laptop</option>
                    <option value="no">No, I do not have a laptop</option>
                </select>
            </div>

            <div className={classes.field}>
                <label htmlFor="passportPhoto">Upload Passport Photograph <span>*</span></label>
                <input
                    type="file"
                    id="passportPhoto"
                    name="passportPhoto"
                    className={classes.fileInput}
                    accept=".jpg,.jpeg,.png"
                    required
                />
                <p className={classes.fileHint}>Max size: 5MB. Formats: JPG, PNG.</p>
            </div>

            <div className={classes.field}>
                <label htmlFor="validId">Upload Valid ID (Optional)</label>
                <input
                    type="file"
                    id="validId"
                    name="validId"
                    className={classes.fileInput}
                    accept=".jpg,.jpeg,.png"
                />
                <p className={classes.fileHint}>NIN, Voter's Card, or Passport. Max size: 5MB.</p>
            </div>

            <button type="submit" className={classes.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting Application...' : 'Submit Scholarship Application'}
            </button>
        </form>
    );
}
