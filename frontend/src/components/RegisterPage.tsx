'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

type RegisterPageProps = {
  onRegister: () => void;
  onNavigateToLogin: () => void;
  apiUrl: string;
};

export function RegisterPage({
  onRegister,
  onNavigateToLogin,
  apiUrl,
}: RegisterPageProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Make API call with JSON body
      const response = await fetch(`${apiUrl}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: fullName, // Use fullName as the username
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Handle validation errors from Pydantic
        if (response.status === 422 && errorData.detail) {
          const messages = errorData.detail
            .map((err: any) => err.msg)
            .join('. ');
          throw new Error(messages);
        }
        throw new Error(errorData.detail || 'Registration failed');
      }

      // 2. Success!
      toast.success('Account created successfully! Please log in.');
      onRegister(); // Tell App.tsx to navigate to login
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'An error occurred during registration'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side design */}
      <div className="flex-1 bg-[#00306e] flex items-center justify-center">
        <div className="bg-white p-8 text-center">
          <div className="w-20 h-20 bg-orange-400 mx-auto rounded-full mb-4"></div>
          <h1 className="text-2xl font-bold">WELCOME TO GATOR MARKET</h1>
          <p className="mt-2 text-sm">By students, for students</p>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white">
        <h2 className="text-3xl font-bold mb-2">CREATE ACCOUNT</h2>
        <p className="mb-6 text-sm text-gray-600">Join the Gator community!</p>

        <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1">Full Name (this will be your username)</label>
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-[#00306e] px-3 py-2 rounded"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block mb-1">UF Email</label>
            <input
              type="email"
              placeholder="name@ufl.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#00306e] px-3 py-2 rounded"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#00306e] px-3 py-2 rounded"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-[#00306e] px-3 py-2 rounded"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-400 text-white py-3 rounded-full text-lg font-semibold mt-4 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-sm">
          Already have an account?{' '}
          <button
            className="underline text-blue-600"
            onClick={onNavigateToLogin}
            disabled={isLoading}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

