"use client";
import { motion } from "framer-motion";
import classes from "./contact-form.module.css";
import { useActionState, useEffect, useState } from "react";
import FormSubmitButton from "../ui/form-submit-button";
import submitInquiryAction from "@/actions/submit-inquiry-action";
import { toast } from "sonner";
import { iconsConfig } from "@/lib/icons/iconsConfig";

const AngleDown = iconsConfig["angleDown"];

export default function ContactForm() {
  const [formInputs, setFormInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    tel: "",
    companyName: "",
    inquiryType: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const [formState, formAction] = useActionState(
    async (prevState, formData) => {
      try {
        const res = await submitInquiryAction(prevState, formData);
        if (!res.errors) {
          setFormInputs({
            firstName: "",
            lastName: "",
            email: "",
            tel: "",
            companyName: "",
            inquiryType: "",
            message: "",
          });
          toast.success(
            "Your message was sent successfully! You will recieve a response via the email provided shortly"
          );
          return {};
        }
        const errors = res.errors;
        setErrors(errors);
        return {};
      } catch (error) {
        console.log(error.message);
        toast.error("Failed to send message, try again");
      }
    },
    {}
  );

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        element.classList.add("highlight-section");
        setTimeout(() => element.classList.remove("highlight-section"), 5000);
      }
    }
  }, []);

  function handleChange(e) {
    const isError = errors[e.target.name];
    if (isError) {
      setErrors((prev) => {
        return {
          ...prev,
          [e.target.name]: "",
        };
      });
    }
    setFormInputs((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }
  return (
    <motion.div
      className={classes.wrapper}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
      }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <form className={classes.form} action={formAction}>
        {/* First Row */}
        <div className={classes.row}>
          <div className={classes.inputGroup}>
            <label className={classes.label}>First Name *</label>
            <input
              className={` ${errors?.firstName && "error-background"} ${
                classes.input
              }`}
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Enter your first name"
              onChange={handleChange}
              value={formInputs.firstName}
            />
            {errors?.firstName && (
              <p className="error-message ">{errors.firstName}</p>
            )}
          </div>
          <div className={classes.inputGroup}>
            <label className={classes.label}>Last Name *</label>
            <input
              className={` ${errors?.firstName && "error-background"} ${
                classes.input
              }`}
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Enter your last name"
              onChange={handleChange}
              value={formInputs.lastName}
            />
            {errors?.lastName && (
              <p className="error-message ">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Second Row */}
        <div className={classes.row}>
          <div className={classes.inputGroup}>
            <label className={classes.label}>Email Address *</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              className={` ${errors?.firstName && "error-background"} ${
                classes.input
              }`}
              onChange={handleChange}
              value={formInputs.email}
            />
            {errors?.email && <p className="error-message ">{errors.email}</p>}
          </div>
          <div className={classes.inputGroup}>
            <label className={classes.label}>Phone Number</label>
            <input
              className={` ${errors?.firstName && "error-background"} ${
                classes.input
              }`}
              id="tel"
              name="tel"
              type="tel"
              placeholder="+234 xxx xxx xxxx"
              onChange={handleChange}
              value={formInputs.tel}
            />
            {errors?.tel && <p className="error-message ">{errors.tel}</p>}
          </div>
        </div>

        {/* Third Row */}
        <div className={classes.row}>
          <div className={classes.inputGroup}>
            <label className={classes.label}>Company/Organization</label>
            <input
              className={classes.input}
              id="tel"
              name="companyName"
              type="text"
              placeholder="Your company name"
              onChange={handleChange}
              value={formInputs.companyName}
            />
            {errors?.companyName && (
              <p className="error-message ">{errors.companyName}</p>
            )}
          </div>
          <div className={classes.inputGroup}>
            <label className={classes.label}>Inquiry Type *</label>
            <div className={classes.selectWrapper}>
              <select
                className={classes.select}
                id="inquiryType"
                name="inquiryType"
                onChange={handleChange}
                value={formInputs.inquiryType}
              >
                <option value="">Select inquiry type</option>
                <option value="general">General Inquiry</option>
                <option value="visit">Book a Visit</option>
                <option value="partnership">Partnership</option>
                <option value="training">Training Programs</option>
                <option value="coworking">Coworking Space</option>
                <option value="incubation">Startup Incubation</option>
                <option value="outsourcing">Project Outsourcing</option>
              </select>

              {errors?.inquiryType && (
                <p className="error-message ">{errors.inquiryType}</p>
              )}
            </div>
          </div>
        </div>

        {/* Message */}
        <div className={classes.inputGroup}>
          <label className={classes.label}>Message *</label>
          <textarea
            rows="6"
            placeholder="Tell us more about your inquiry, project, or how we can help you..."
            className={` ${errors?.firstName && "error-background"} ${
              classes.textarea
            }`}
            id="message"
            name="message"
            onChange={handleChange}
            value={formInputs.message}
          ></textarea>
          {errors?.message && (
            <p className="error-message ">{errors.message}</p>
          )}
        </div>

        {/* Privacy Policy */}
        {/* <div className={classes.checkboxRow}>
          <input
            className={classes.checkbox}
            type="checkbox"
            id="privacyAgreement"
            name="privacyAgreement"
          />
          <label htmlFor="privacyAgreement" className={classes.privacyLabel}>
            I agree to the <span className={classes.link}>Privacy Policy</span>{" "}
            and <span className={classes.link}>Terms of Service</span>
          </label>
        </div> */}

        {/* Button */}
        <div className={classes.buttonWrapper}>
          <FormSubmitButton className={classes.submitButton} icon="send">
            Send Message
          </FormSubmitButton>
        </div>
      </form>
    </motion.div>
  );
}
