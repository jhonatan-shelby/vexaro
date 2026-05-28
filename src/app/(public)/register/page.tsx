'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthService } from '@/modules/auth';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);
    
    const { data, error } = await AuthService.signUp(email, password);
    
    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Registration successful! Please check your email to confirm your account.');
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel - Dark Green */}
      <div className="hidden lg:flex w-1/2 bg-primary flex-col justify-center items-center p-12 text-primary-foreground relative overflow-hidden">
        {/* Subtle background gradient/glow effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0f2e1b] to-primary opacity-80" />
        
        <div className="z-10 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-secondary rounded-xl mb-8 shadow-lg" />
          <h1 className="text-display font-heading text-5xl">Join Vexaro</h1>
          <p className="text-body-lg text-[#accfb3] max-w-md mx-auto leading-relaxed">
            Request access to manage your workflow with precision and clarity.
          </p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-md bg-surface-container-lowest p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-border">
          <h2 className="text-headline-lg font-heading text-foreground mb-2">Request Access</h2>
          <p className="text-body-md text-muted-foreground mb-8">
            Create an account to access the workspace.
          </p>

          {successMsg ? (
            <div className="p-6 bg-green-500/10 text-green-600 border border-green-500/20 rounded-md text-sm text-center font-medium">
              {successMsg}
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <label className="text-label-caps text-foreground uppercase block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 rounded-md border border-input bg-surface-container-lowest text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-label-caps text-foreground uppercase block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full px-4 py-3 rounded-md border border-input bg-surface-container-lowest text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                />
              </div>

              {errorMsg && (
                <p className="text-sm text-red-500 font-medium">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium text-sm tracking-wide hover:bg-primary-container disabled:opacity-70 transition-colors mt-2"
              >
                {isLoading ? 'PROCESSING...' : 'REQUEST ACCESS'}
              </button>
            </form>
          )}

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="font-semibold text-foreground hover:text-secondary transition-colors">Sign In</Link>
          </p>
        </div>

        <p className="mt-8 text-xs text-muted-foreground font-mono">
          v1.0.0 / Secure Connection
        </p>
      </div>
    </div>
  );
}
