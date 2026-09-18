import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import AuthCard from "@/components/auth/AuthCard";
import { embeddedAuthAppearance } from "@/lib/clerkAppearance";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

export default function SignInPage() {
  return (
    <AuthCard>
      <SignIn appearance={embeddedAuthAppearance} />
    </AuthCard>
  );
}
