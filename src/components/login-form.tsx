"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // usestate
  const [isSigningIn, setIsSigningIn] = useState(false);

  // azure provider login
  const onClickMicrosoftLogin = (provider: "microsoft-entra-id") => {
    setIsSigningIn(true);
    signIn(provider, { callbackUrl: "/auth/login" });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Microsoft account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isSigningIn}
                  onClick={() => onClickMicrosoftLogin("microsoft-entra-id")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <rect
                      x="2"
                      y="2"
                      width="9"
                      height="9"
                      fill="currentColor"
                    />
                    <rect
                      x="13"
                      y="2"
                      width="9"
                      height="9"
                      fill="currentColor"
                    />
                    <rect
                      x="2"
                      y="13"
                      width="9"
                      height="9"
                      fill="currentColor"
                    />
                    <rect
                      x="13"
                      y="13"
                      width="9"
                      height="9"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Microsoft
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a
          href="https://www.microsoft.com/en-ph/servicesagreement"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="https://www.microsoft.com/en-us/privacy/privacystatement"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
