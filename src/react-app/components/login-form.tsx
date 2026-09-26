import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,

} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import React, { useState } from "react"
interface FormHandlers {
  handleSubmit: (
    e: React.SubmitEvent,
    email: string | undefined,
    setLoading: (state: boolean) => void,
    setOk: (state: boolean | undefined) => void
  ) => void
  setLoading: (state: boolean) => void
  setOk: (state: boolean | undefined) => void
}
export function LoginForm({
  className,
  handleSubmit,
  setLoading,
  setOk,
  ...props
}: React.ComponentProps<"form"> & FormHandlers) {
  const [email, setEmail]= useState<string>()
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={(e)=>handleSubmit(e,email, setLoading, setOk)} >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your Patron Dashboard</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to Patron Dashboard
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e)=>setEmail(e.target.value)} />
        </Field>
        <Field>
          <Button type="submit">Login</Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
