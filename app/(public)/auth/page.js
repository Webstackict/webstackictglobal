"use client";
import { svgConfig } from "@/lib/icons/SVG/svgConfig";
import { iconsConfig } from "@/lib/icons/iconsConfig";
import classes from "./page.module.css";
import { useActionState, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signup, signin } from "@/actions/auth-actions";
import { toast } from "sonner";
import FormSubmitButton from "@/components/ui/form-submit-button";
import { signInWithGoogle } from "@/lib/db/supabaseGoogleOauthServer";

const googleIcon = svgConfig["google"];
const SecurityIcon = iconsConfig["security"];
const EyeIcon = iconsConfig["eye"];
const EmailIcon = iconsConfig["email"];
const LockIcon = iconsConfig["lock"];
const EyeOffIcon = iconsConfig["eyeOff"];

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") || "login";

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  let authAction = signin;

  if (mode !== "login") {
    authAction = signup;
  }

  function handleInputChange(e) {
    const inputName = e.target.name;
    const inputValue = e.target.value;

    if (errors[inputName]) {
      setErrors((prev) => ({ ...prev, [inputName]: "" }));
    }

    setInputs((prev) => ({
      ...prev,
      [inputName]: inputValue,
    }));
  }

  const [formState, formAction] = useActionState(
    async (prevState, formData) => {
      try {
        const res = await authAction(prevState, formData);

        if (!res.errors) {
          if (mode === "signup") {
            router.push(`/auth/email-verify?email=${inputs.email}`);
            toast.success(res.message);
          } else {
            router.replace("/dashboard");
            toast.success(res.message);
          }

          return {};
        }

        setErrors((prev) => {
          const newErrors = { ...prev, ...res.errors };
          return newErrors;
        });
      } catch (error) {
        if (error.message === "User already registered") {
          toast.error(`${error.message}! Sign in instead`);
          router.push("/auth");
          return;
        }
        if (error.message === "Invalid login credentials") {
          toast.error(`${"Invalid email or password"}`);
          return;
        }
        if (error.message === "Email not confirmed") {
          toast.error(
            `${error.message} yet! Please confirm your email address to proceed`
          );
          return;
        }
        if (mode === "login") {
          toast.error("Login failed, please try again");
        } else {
          toast.error("Failed to create account, please try again");
        }

        console.log(error);
      }
    },
    {}
  );

  async function handleSigninWithGoogleClick() {
    const url = await signInWithGoogle();

    if (url) window.location.href = url;
  }
  return (
    <section id="login-main" className={classes.authSection}>
      <div className={classes.wrapper}>
        <div id="login-card" className={classes.card}>
          <div className={classes.glowBar}></div>

          <div id="login-header" className={classes.header}>
            <div className={classes.iconBox}>
              <SecurityIcon />
            </div>
            {mode === "login" ? (
              <>
                <h1>Welcome Back 👋</h1>
                <p>Login to continue your learning journey with WEBSTACK.</p>
              </>
            ) : (
              <>
                <h1>We Are Glad To Have You</h1>
                <p>Sign up to kickstart your learning journey with WEBSTACK.</p>
              </>
            )}
          </div>

          <div id="social-login" className={classes.socialLogin}>
            <button
              className={classes.socialBtn}
              onClick={handleSigninWithGoogleClick}
            >
              {googleIcon}
              {mode === "login" ? (
                <span>Continue with Google</span>
              ) : (
                <span>Sign up with Google</span>
              )}
            </button>
          </div>

          <div id="divider" className={classes.divider}>
            <span>or</span>
          </div>

          <form className={classes.form} action={formAction}>
            <div id="email-field" className={classes.field}>
              <label htmlFor="email">
                <EmailIcon />
                <span>Email Address</span>
              </label>
              <div className={classes.inputWrapper}>
                <input
                  type="email"
                  id="email"
                  placeholder="your.email@example.com"
                  name="email"
                  value={inputs.email}
                  onChange={handleInputChange}
                  className={errors?.email ? "error-background" : undefined}
                />
              </div>
              {errors?.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div id="password-field" className={classes.field}>
              <label htmlFor="password">
                <LockIcon />
                <span>Password</span>
              </label>
              <div className={classes.inputWrapper}>
                <input
                  type={!showPassword ? "password" : "text"}
                  id="password"
                  placeholder="Enter your password"
                  name="password"
                  value={inputs.password}
                  onChange={handleInputChange}
                  className={errors?.password ? "error-background" : undefined}
                />
                <button type="button" className={classes.eyeButton}>
                  {!showPassword ? (
                    <EyeIcon
                      className={classes.eyeButton}
                      onClick={() => setShowPassword(true)}
                    />
                  ) : (
                    <EyeOffIcon
                      className={classes.eyeButton}
                      onClick={() => setShowPassword(false)}
                    />
                  )}
                </button>
              </div>
              {errors?.password && (
                <p className="error-message">{errors.password}</p>
              )}
              {mode === "login" && (
                <div className={classes.fieldFooter}>
                  <label className={classes.checkboxLabel}>
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#">Forgot Password?</a>
                </div>
              )}
            </div>
            {mode !== "login" && (
              <div id="confirm-password-field" className={classes.field}>
                <label htmlFor="confirm-password">
                  <LockIcon />
                  <span>Confirm-Password</span>
                </label>
                <div className={classes.inputWrapper}>
                  <input
                    type="password"
                    id="confirm-password"
                    placeholder="Re-enter password"
                    name="confirmPassword"
                    value={inputs.confirmPassword}
                    onChange={handleInputChange}
                    className={
                      errors?.confirmPassword ? "error-background" : undefined
                    }
                  />
                </div>
                {errors?.confirmPassword && (
                  <p className="error-message">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <FormSubmitButton className={classes.submitBtn} icon="rightArrow">
              {mode === "login" ? "Login to Dashboard" : "Sign Up"}
            </FormSubmitButton>
          </form>

          <div id="signup-redirect" className={classes.signupRedirect}>
            {mode === "login" ? (
              <p>
                Don’t have an account?
                <Link href="/auth/?mode=signup">Sign Up</Link>
              </p>
            ) : (
              <p>
                Already have an account?
                <Link href="/auth/?mode=login">Sign In</Link>
              </p>
            )}
          </div>
        </div>

        <div id="security-badge" className={classes.securityBadge}>
          <div className={classes.badgeIcon}>
            <SecurityIcon />
          </div>
          <div>
            <h3>Secure Authentication</h3>
            <p>
              Your data is protected with enterprise-grade encryption and
              security protocols.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
