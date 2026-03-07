'use client';

import { useState } from 'react';
import { submitScholarshipApplication } from '@/lib/db/submit-scholarship';
import classes from './scholarship-form.module.css';

export default function ScholarshipForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const departmentList = [
        { id: "8434defa-ba23-49e8-b04c-d74f07b91cdf", name: "Software Engineering" },
        { id: "0656a900-ec27-43e1-a43c-db6154b6cf8b", name: "Web Development" }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg("");

        const formData = new FormData(e.target);

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
                <p>Your scholarship application has been successfully submitted and is being processed.</p>
                <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Next Steps:</p>
                <p>Please check your email for a confirmation and further instructions regarding the admission process.</p>
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
                    <label htmlFor="country">Country</label>
                    <input type="text" id="country" name="country" className={classes.input} placeholder="e.g. Nigeria" defaultValue="Nigeria" />
                </div>
            </div>

            <div className={classes.row}>
                <div className={classes.field}>
                    <label htmlFor="state">State of Residence <span>*</span></label>
                    <input type="text" id="state" name="state" className={classes.input} required placeholder="e.g. Lagos" />
                </div>
                <div className={classes.field}>
                    <label htmlFor="departmentId">Department of Interest <span>*</span></label>
                    <select id="departmentId" name="departmentId" className={classes.select} required defaultValue="">
                        <option value="" disabled>Select a Department...</option>
                        {departmentList.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={classes.row}>
                <div className={classes.field}>
                    <label htmlFor="experienceLevel">Experience Level <span>*</span></label>
                    <select id="experienceLevel" name="experienceLevel" className={classes.select} required defaultValue="">
                        <option value="" disabled>Select your level...</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
                <div className={classes.field}>
                    <label htmlFor="linkedinUrl">LinkedIn Profile (URL)</label>
                    <input type="url" id="linkedinUrl" name="linkedinUrl" className={classes.input} placeholder="https://linkedin.com/in/..." />
                </div>
            </div>

            <div className={classes.field}>
                <label htmlFor="portfolioUrl">Portfolio Website (URL)</label>
                <input type="url" id="portfolioUrl" name="portfolioUrl" className={classes.input} placeholder="https://..." />
            </div>

            <div className={classes.field}>
                <label htmlFor="motivation">Motivation for Scholarship <span>*</span></label>
                <textarea
                    id="motivation"
                    name="motivation"
                    className={classes.textarea}
                    required
                    placeholder="Tell us why you are passionate about tech and how this scholarship will impact your life..."
                ></textarea>
            </div>

            <button type="submit" className={classes.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting Application...' : 'Submit Scholarship Application'}
            </button>
        </form>
    );
}
