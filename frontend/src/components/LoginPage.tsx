import { useState } from 'react';
import { toast } from 'sonner';

interface LoginPageProps {
  onLogin: (email: string) => void;
  onNavigateToRegister: () => void;
}

export function LoginPage({ onLogin, onNavigateToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Basic email validation
    if (!email.endsWith('@ufl.edu')) {
      toast.error('Please use a valid UF email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Login successful!');
      onLogin(email);
    }, 1000);
  };

  const handleForgotPassword = () => {
    toast.info('Password reset link would be sent to your email');
  };

  return (
    <div className="bg-white relative size-full min-h-screen" data-name="High-Fi login">
      {/* Blue left panel */}
      <div className="absolute bg-[#00306e] h-full left-0 top-0 w-[752px] max-md:hidden" />
      
      {/* White tilted rectangle on left side */}
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.006124263629317284)+(var(--transform-inner-height)*0.9999844431877136)))] items-center justify-center left-[188.33px] top-[179.78px] w-[calc(1px*((var(--transform-inner-height)*0.0055775828659534454)+(var(--transform-inner-width)*0.9999812245368958)))] max-md:hidden" style={{ "--transform-inner-width": "370.28125", "--transform-inner-height": "686.890625" } as React.CSSProperties}>
        <div className="flex-none rotate-[359.649deg] skew-x-[359.969deg]">
          <div className="bg-white h-[686.897px] w-[370.295px]" data-name="Rectangle" />
        </div>
      </div>

      {/* Orange circle on left side */}
      <div className="absolute left-[311px] size-[128px] top-[291px] max-md:hidden">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 128 128">
          <circle cx="64" cy="64" fill="#FFB362" r="64" />
        </svg>
      </div>

      {/* Welcome text on left side */}
      <div className="absolute font-['Impact:Regular',_sans-serif] h-[174px] leading-[normal] left-[375.5px] not-italic text-black text-center top-[470px] translate-x-[-50%] w-[505px] max-md:hidden">
        <p className="mb-0 text-[50px]">WELCOME TO</p>
        <p className="text-[50px]">GATOR MARKET</p>
      </div>

      {/* Tagline on left side */}
      <p className="absolute font-['Alumni_Sans:Regular',_sans-serif] font-normal h-[54px] leading-[normal] left-[375.5px] text-black text-center top-[595px] translate-x-[-50%] w-[387px] max-md:hidden text-[45px]">
        By students, for students
      </p>

      {/* Right side - Login form */}
      <div className="absolute left-[752px] right-0 top-0 bottom-0 flex items-center justify-center max-md:static max-md:w-full max-md:min-h-screen">
        <form onSubmit={handleLogin} className="w-full max-w-[618px] px-8">
          {/* HELLO heading */}
          <p className="font-['Impact:Regular',_sans-serif] leading-[normal] not-italic text-black text-center mb-4 text-[50px]">
            HELLO!
          </p>

          {/* Instruction text */}
          <div className="font-['Impact:Regular',_sans-serif] leading-[normal] not-italic text-black text-center mb-12 text-[20px]">
            <p className="mb-0">Please enter your</p>
            <p>information below.</p>
          </div>

          {/* UF Email field */}
          <div className="mb-6">
            <label className="font-['Alumni_Sans:Regular',_sans-serif] font-normal leading-[normal] text-black block mb-2 text-[25px]">
              UF Email
            </label>
            <div className="relative">
              <div className="flex items-center justify-center">
                <div className="flex-none rotate-[359.649deg] skew-x-[359.969deg] w-full">
                  <div className="bg-white h-[84.491px] relative w-full" data-name="Rectangle">
                    <div aria-hidden="true" className="absolute border-2 border-[#00306e] border-solid inset-0 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="absolute inset-0 w-full h-full px-4 bg-transparent outline-none font-['Alumni_Sans:Regular',_sans-serif] text-[20px] rotate-[-359.649deg] skew-x-[-359.969deg] origin-center"
                      placeholder="name@ufl.edu"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password field */}
          <div className="mb-4">
            <label className="font-['Alumni_Sans:Regular',_sans-serif] font-normal leading-[normal] text-black block mb-2 text-[25px]">
              Password
            </label>
            <div className="relative">
              <div className="flex items-center justify-center">
                <div className="flex-none rotate-[359.649deg] skew-x-[359.969deg] w-full">
                  <div className="bg-white h-[84.491px] relative w-full" data-name="Rectangle">
                    <div aria-hidden="true" className="absolute border-2 border-[#00306e] border-solid inset-0 pointer-events-none" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="absolute inset-0 w-full h-full px-4 bg-transparent outline-none font-['Alumni_Sans:Regular',_sans-serif] text-[20px] rotate-[-359.649deg] skew-x-[-359.969deg] origin-center"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Forgot password link */}
          <div className="text-right mb-8">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="[text-underline-position:from-font] decoration-solid font-['Alumni_Sans:Regular',_sans-serif] font-normal leading-[normal] text-[#00306e] underline hover:opacity-80 transition-opacity text-[25px]"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>

          {/* Log In button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#ffb362] box-border flex items-center justify-center px-[73px] py-[6px] rounded-[50px] h-[84.491px] hover:bg-[#ffa347] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <p className="font-['Impact:Regular',_sans-serif] leading-[normal] not-italic text-center text-nowrap text-white whitespace-pre text-[40px]">
              {isLoading ? 'Logging in...' : 'Log In'}
            </p>
          </button>

          {/* Create account link */}
          <div className="text-center">
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="[text-underline-position:from-font] decoration-solid font-['Alumni_Sans:Regular',_sans-serif] font-normal leading-[normal] text-black underline hover:opacity-80 transition-opacity text-[25px]"
              disabled={isLoading}
            >
              New here? Create an account!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
