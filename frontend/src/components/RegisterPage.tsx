'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { mockApi } from '../mockApi';
import styles from './Register.module.css';

type RegisterPageProps = {
  onRegister: (email: string) => void;
  onNavigateToLogin: () => void;
  apiUrl: string;
  mockMode?: boolean;
};

export function RegisterPage({
  onRegister,
  onNavigateToLogin,
  apiUrl,
  mockMode = false,
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
      if (mockMode) {
        // Use mock API
        const result = await mockApi.signup(fullName, email, password);
        if (result.success) {
          toast.success('Account created successfully! Logging you in...');
          onRegister(email);
        } else {
          throw new Error(result.error || 'Registration failed');
        }
      } else {
        // Use real API
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

        // 2. Success! Auto-login the user
        const data = await response.json();
        
        // Now log in the user automatically
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const loginResponse = await fetch(`${apiUrl}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          localStorage.setItem('gator_token', loginData.access_token);
          toast.success('Account created successfully! Logging you in...');
          onRegister(email);
        } else {
          toast.success('Account created successfully! Please log in.');
          onNavigateToLogin();
        }
      }
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
    <div className={styles.container}>
      {/* Left side - Form */}
      <div className={styles.left}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.title}>SIGN UP</h2>

          <label className={styles.label}>Name</label>
          <input
            type="text"
            className={styles.input}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={isLoading}
          />

          <label className={styles.label}>UF Email</label>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          <label className={styles.label}>Password</label>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <label className={styles.label}>Confirm Password</label>
          <input
            type="password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <button className={styles.submit} type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className={styles.signin}>
            <a onClick={onNavigateToLogin} style={{ cursor: 'pointer' }}>
              Already have an account? Sign In!
            </a>
          </div>
        </form>
      </div>

      {/* Right side - Logo */}
      <div className={styles.right}>
        <div className={styles.logoCard}>
          <div className={styles.logoWrapper}>
            <img
              src="/gatormarketplace_dark.png"
              alt="Gator Marketplace"
              className={styles.logoImage}
              onError={(e) => {
                // Fallback if image doesn't exist
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                      <text x="100" y="60" font-family="Impact, sans-serif" font-size="24" text-anchor="middle" fill="#00306e">
                        GATOR
                      </text>
                      <text x="100" y="85" font-family="Impact, sans-serif" font-size="20" text-anchor="middle" fill="#00306e">
                        MARKETPLACE
                      </text>
                      <path d="M 80 30 L 100 15 L 120 30 L 100 40 Z" fill="none" stroke="#00306e" stroke-width="2"/>
                      <circle cx="100" cy="25" r="3" fill="#00306e"/>
                    </svg>
                  `;
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

