"use client";

import { useActionState, use, useState } from "react";

import { UserContext } from "@/store/user-context";

import classes from "./name-change-form.module.css";
import { updatePassword } from "@/actions/update-password";
import { toast } from "sonner";
import FormSubmitButton from "../ui/form-submit-button";
import { useRouter } from "next/navigation";

function PasswordChangeForm() {
  const router = useRouter();
  const { user } = use(UserContext);
  const { id: userId, authProviders } = user;

  const [inputs, setInputs] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [formState, formAction] = useActionState(
    async (prevState, formData) => {
      try {
        const res = await updatePassword(userId, prevState, formData);
        // console.log("res", res);

        if (!res.errors) {
          toast.success("Password updated successfully, please login again");
          router.refresh();
          return;
        }

        setErrors((prev) => {
          const newErrors = { ...prev, ...res.errors };
          return newErrors;
        });
        return;
      } catch (error) {
        toast.error("Password update failed, please try again");
      }
    },
    {}
  );

  function handleInputChange(e, field) {
    setInputs((prev) => {
      const newInputs = {
        ...prev,
        [field]: e.target.value,
      };

      return newInputs;
    });
  }

  function handleInputFocus(field) {
    setErrors((prev) => {
      const newErrors = { ...prev, [field]: "" };
      return newErrors;
    });
  }

  return (
    <form
      className={classes.accountForm}
      action={formAction}
      style={{ marginTop: "2rem" }}
    >
      <fieldset className={classes.passwordSection}>
        <legend>
          {authProviders.includes("email") ? "Change Password" : "Set Password"}
        </legend>

        <div className={classes.field}>
          <label htmlFor="newPassword">New password</label>
          <input
            className={`${errors?.newPassword && "error-background"}`}
            type="password"
            id="newPassword"
            name="newPassword"
            value={inputs.newPassword}
            onChange={(e) => {
              handleInputChange(e, "newPassword");
            }}
            onFocus={() => {
              handleInputFocus("newPassword");
            }}
          />
          {errors.newPassword && (
            <p className="error-message">{errors?.newPassword}</p>
          )}
        </div>
        <div className={classes.field}>
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            className={`${errors?.confirmPassword && "error-background"}`}
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={inputs.confirmPassword}
            onChange={(e) => {
              handleInputChange(e, "confirmPassword");
            }}
            onFocus={() => {
              handleInputFocus("confirmPassword");
            }}
          />
          {errors.confirmPassword && (
            <p className="error-message">{errors?.confirmPassword}</p>
          )}
        </div>
      </fieldset>

      <FormSubmitButton className={classes.saveButton} icon="save">
        Save New Password
      </FormSubmitButton>
    </form>
  );
}

export default PasswordChangeForm;
