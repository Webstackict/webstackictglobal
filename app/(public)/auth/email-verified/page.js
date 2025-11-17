"use server";

// import { createSupabaseServerClient } from "@/lib/db/supabaseServer";
import classes from "../page.module.css";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LinkWithProgress from "@/components/ui/Link-with-progress";
import ResendButton from "@/components/ui/resend-link-button";
import AutoRefreshIfVerified from "@/components/poll/autorefreshVerification";
import IconRenderer from "@/components/ui/icon-rederer";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function VerifyEmail({ searchParams }) {
  const params = await searchParams;
  const email = params.email;

  const cookieStore = await cookies();

  const supabase = createServerClient(supabaseURL, serviceRoleKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  const { data: userRaw, error: listError } =
    await supabase.auth.admin.listUsers({
      filter: `email=eq.${email}`,
    });

  const users = userRaw.users;

  const user = users.find((u) => u.email === email);

  if (!user) {
    redirect("/auth");
  }

  const isEmailVerified = user.user_metadata.email_verified;

  if (isEmailVerified === true) {
    redirect("/auth");
  }

  console.log("sxcw", user);

  const now = new Date();
  const lastResend = user.confirmation_sent_at;
  const waitResend = lastResend && now - new Date(lastResend) < 60 * 1000;

  return (
    <section id="login-main" className={classes.authSection}>
      <AutoRefreshIfVerified email={email} />
      <div className={classes.wrapper}>
        <div id="login-card" className={classes.card}>
          <div className={classes.glowBar}></div>

          <div id="login-header" className={classes.header}>
            <IconRenderer label="verified-email" iconName="badgeCheck" />
            <h1>Email Verified Successfully</h1>
            <p>
              Your email has been verified, proceed to login and kickstart your
              journey!
            </p>

            <div className={classes.verifyButtonsContainer}>
              <LinkWithProgress href="/auth" className={classes.proceedButton}>
                Proceed to Login
              </LinkWithProgress>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
