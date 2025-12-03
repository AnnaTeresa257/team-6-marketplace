import React, { useState } from 'react';
import { toast } from 'sonner';
import { mockApi } from '../mockApi';
import styles from './Login.module.css';

interface LoginPageProps {
  onLogin: (email: string, isAdmin?: boolean) => void;
  onNavigateToRegister: () => void;
  apiUrl: string;
  mockMode?: boolean;
}

export function LoginPage({
  onLogin,
  onNavigateToRegister,
  apiUrl,
  mockMode = false,
}: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!email.endsWith('@ufl.edu')) {
      toast.error('Please use a valid UF email address');
      return;
    }

    setIsLoading(true);

    try {
      if (mockMode) {
        // Use mock API
        const result = await mockApi.login(email, password);
        if (result.success) {
          toast.success('Login successful!');
          onLogin(email);
        } else {
          throw new Error(result.error || 'Login failed');
        }
      } else {
        // Use real API
        // 1. Prepare form data for OAuth2
        const formData = new URLSearchParams();
        // backend login expects a 'username', so we pass the email as the username
        formData.append('username', email);
        formData.append('password', password);

        // 2. Make the actual API call
        const response = await fetch(`${apiUrl}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Login failed');
        }

        // 3. Get token and save it to localStorage
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);

        toast.success('Login successful!');
        // Pass is_admin status if available
        onLogin(email, data.user?.is_admin); // Tell App.tsx to change the page
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'An error occurred during login'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info('Password reset link would be sent to your email');
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.logoCircle}>
            <img
              src="/gatormarketplace_white.png"
              alt="Gator Marketplace"
              className={styles.logoImage}
            />
          </div>

          <h1 className={styles.welcomeTitle}>
            WELCOME TO{'\n'}GATOR MARKETPLACE
          </h1>
          <p className={styles.tagline}>By students, for students</p>
        </div>
      </div>

      <div className={styles.right}>
        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.helloWrap}>
            <h2 className={styles.hello}>HELLO!</h2>
            <p className={styles.helloSub}>
              Please enter your information below.
            </p>
          </div>

          <label className={styles.label}>UF Email</label>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="name@ufl.edu"
            aria-label="UF Email"
            disabled={isLoading}
          />

          <label className={styles.label}>Password</label>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
            placeholder="••••••••"
            disabled={isLoading}
          />

          <div className={styles.forgotPassword}>
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>

          <button className={styles.submit} type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>

          <div className={styles.signup}>
            <a onClick={onNavigateToRegister} style={{ cursor: 'pointer' }}>
              New here? Create an account!
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

