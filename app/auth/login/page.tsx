"use client"

import { LoginForm } from "@/app/auth/login/login-form"
import Aurora from "@/components/ui/aurora"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Aurora
          colorStops={["#5227FF", "#7CFF67", "#5227FF"]}
          blend={0.6}
          amplitude={1.2}
          speed={0.5}
        />
      </div>
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}
