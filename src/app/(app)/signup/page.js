"use client"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function Signup() {

    const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full lg:grid lg:min-h-[600px]  xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
      <div className="mx-auto grid gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-2xl font-bold">Create New Account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
  <div className="flex items-center">
    <Label htmlFor="password">Password</Label>
    {/* <Link
      href="/forgot-password"
      className="ml-auto inline-block text-sm underline"
    >
      Forgot your password?
    </Link> */}
  </div>
  <div className="relative">
    <Input id="password" type={showPassword ? "text" : "password"} required />
    <span
      className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3.707 2.293a1 1 0 00-1.414 1.414l-2-2a1 1 0 013.414 3.414L5 6.586V10a1 1 0 001 1v-1a1 1 0 00-1-1H3.293a1 1 0 00-.707 1.707l-2 2a1 1 0 001.414 1.414L5 10.414v2.586a1 1 0 001 1v-1a1 1 0 00-1-1H3.293a1 1 0 00-.707-1.707l-2-2zM14.707 6.293a1 1 0 00-1.414-1.414l2-2a1 1 0 013.414 3.414L17 9.586V14a1 1 0 001 1v-1a1 1 0 00-1-1H14.293a1 1 0 00-.707 1.707l2 2a1 1 0 00-1.414 1.414L14 11.414v-2.586zM10 2.586a1 1 0 011.414-1.414l2 2a1 1 0 00-1.414-1.414L10 2.586z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 12a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </span>
  </div>
</div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Signup with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have a account?{" "}
            <Link href="login" className="underline">
            <b style={{color:'blue'}}>Sign in</b>
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  )
}
