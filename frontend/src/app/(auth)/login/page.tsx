"use client";

import { useLogin } from '@/hooks/auth/useLogin'
import React, { FormEvent, useState } from 'react'

const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { mutate, isPending, isError, error } = useLogin()

  const handleSubmitForm = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutate({
      email,  
      password
    })
  }

  return (
    <main>
      <h1>Login Page</h1>

      <form onSubmit={handleSubmitForm}>
        <input
          type="text"
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button type='submit' disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </button>

        {isError && (
          <p>{error instanceof Error ? error.message : "Login Failed"}</p>
        )}

      </form>

    </main>
  )
}

export default Login