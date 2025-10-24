"use server";
import { sendEmail } from "@/lib/nodemailer";
import xss from "xss";
export default async function submitInquiryAction(prevState, formData) {
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const tel = formData.get("tel");
  const companyName = formData.get("companyName");
  const inquiryType = formData.get("inquiryType");
  const message = xss(formData.get("message"));
  //   const privacyAgreement = Boolean(
  //     formData.getAll("privacyAgreement").length > 0
  //   );

  let errors = {};

  if (!firstName || firstName.trim().length < 3) {
    errors.firstName = "First name must be atleast 3 characters";
  }
  if (!lastName || lastName.trim().length < 3) {
    errors.lastName = "Last name must be atleast 3 characters";
  }

  if (!email || !email.includes("@")) {
    errors.email = "Please enter a valid email address";
  }

  if (!tel || tel.trim().length < 11) {
    errors.tel = "Phone numbers must be atleast 11 digits.";
  }

    if (companyName && companyName.trim().length < 3) {
      errors.companyName = "Company name must be atleast 3 characters";
    }
  if (!inquiryType) {
    errors.inquiryType = "Please select an inquiry type";
  }

  if (!message || message.trim().length < 3) {
    errors.message = "Message is too short";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  try {
    await sendEmail(
      firstName,
      lastName,
      email,
      tel,
      companyName,
      inquiryType,
      message
    );
  } catch (error) {
    throw Error("Error sending mail");
  }

  return { success: true };
}
