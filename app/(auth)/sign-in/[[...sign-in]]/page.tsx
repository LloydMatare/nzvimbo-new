// app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to your Nzvimbo account to continue
          </p>
        </div>

        {/* Clerk SignIn Component */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none bg-transparent w-full",
                headerTitle: "text-xl font-semibold text-gray-900 hidden",
                headerSubtitle: "text-gray-600 hidden",
                socialButtonsBlockButton:
                  "border border-gray-300 rounded-lg py-3 px-4 text-gray-700 hover:bg-gray-50 transition-colors",
                socialButtonsBlockButtonText: "text-sm font-medium",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-500 text-xs",
                formFieldLabel: "text-sm font-medium text-gray-700 mb-2",
                formFieldInput:
                  "rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                formButtonPrimary:
                  "w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-[1.02]",
                footerActionLink:
                  "text-blue-600 hover:text-blue-700 font-medium",
                identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
                formResendCodeLink: "text-blue-600 hover:text-blue-700",
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton",
              },
            }}
          />
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {`Don't have an account?`}{" "}
            <Link
              href="/sign-up"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </Link>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-blue-600 hover:text-blue-700">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
