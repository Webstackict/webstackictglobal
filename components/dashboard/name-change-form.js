"use client";

import { useActionState, use, useState } from "react";

import classes from "./name-change-form.module.css";
import { toast } from "sonner";
import FormSubmitButton from "../ui/form-submit-button";
import { UserContext } from "@/store/user-context";
import { updateNames } from "@/actions/update-names";

export default function NameChangeForm() {
  const { user, setUser } = use(UserContext);
  const { id: userId, displayName, fullName, phone, email } = user;

  const [inputs, setInputs] = useState({
    fullName: fullName,
    displayName: displayName,
    phone: phone,
  });

  const [errors, setErrors] = useState({
    fullName: "",
    displayName: "",
    phone: "",
  });

  const [formState, formAction] = useActionState(
    async (prevState, formData) => {
      try {
        const res = await updateNames(userId, prevState, formData);

        if (!res.errors) {
          setUser((prev) => ({
            ...prev,
            fullName: res.user.full_name,
            displayName: res.user.display_name,
            phone: res.user.phone,
          }));
          toast.success(res.message);
          return {};
        }
        setErrors((prev) => {
          const newErrors = { ...prev, ...res.errors };
          return newErrors;
        });
        return {};
      } catch (error) {
        toast.error("Failed to update account details, please try again");
        return;
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
            onChange={(e) => {
              handleInputChange(e, "fullName");
            }}
            onFocus={() => {
              handleInputFocus("fullName");
            }}
            // required
          />
          {errors.fullName && (
            <p className="error-message">{errors.fullName}</p>
          )}
        </div>
      </div>

      <div className={classes.row}>
        <div className={classes.field}>
          <label htmlFor="displayName">Display name *</label>
          <input
            className={`${errors?.displayName && "error-background"}`}
            type="text"
            id="displayName"
            name="displayName"
            value={inputs.displayName}
            placeholder="Enter a display name"
            onChange={(e) => {
              handleInputChange(e, "displayName");
            }}
            onFocus={() => {
              handleInputFocus("displayName");
            }}
          />
          {errors.displayName && (
            <p className="error-message">{errors.displayName}</p>
          )}
          <small className={classes.note}>
            This will be how your name will be displayed in the account section
            and in reviews
          </small>
        </div>

        <div className={classes.field}>
          <label htmlFor="phone">Phone Number *</label>
          <input
            className={`${errors?.phone && "error-background"}`}
            type="tel"
            id="phone"
            name="phone"
            value={inputs.phone}
            placeholder="Enter your new phone number"
            onChange={(e) => {
              handleInputChange(e, "phone");
            }}
            onFocus={() => {
              handleInputFocus("phone");
            }}
          />
          {errors.phone && <p className="error-message">{errors.phone}</p>}
          <small className={classes.note}>
            This will be where you will be contacted on whatsapp
          </small>
        </div>
      </div>

      <div className={classes.field}>
        <label htmlFor="email">Email *</label>
        <input
          className={`${classes.email}`}
          type="text"
          id="email"
          name="email"
          value={user.email}
          placeholder="Enter your new email"
          disabled={true}
          onChange={(e) => {
            toast.error("Email cannot be changed at this time.");
          }}
        />
      </div>

      <FormSubmitButton className={classes.saveButton} icon="save">
        Save
      </FormSubmitButton>
    </form>
  );
}
