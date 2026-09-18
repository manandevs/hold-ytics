import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import AuthCard from "@/components/auth/AuthCard";
import { embeddedAuthAppearance } from "@/lib/clerkAppearance";

export const metadata: Metadata = {
  title: "Create an account",
  robots: { index: false },
};

export default function SignUpPage() {
  return (
    <AuthCard>
      <SignUp appearance={embeddedAuthAppearance} />
    </AuthCard>
  );
}
