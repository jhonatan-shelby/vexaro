'use client';

import { useState } from 'react';
import { LogIn, Apple } from 'lucide-react';
import { AuthService } from '@/modules/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await AuthService.signInWithPassword(email, password);
    // In a real scenario, handle routing or error states
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel - Dark Green */}
      <div className="hidden lg:flex w-1/2 bg-primary flex-col justify-center items-center p-12 text-primary-foreground relative overflow-hidden">
        {/* Subtle background gradient/glow effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0f2e1b] to-primary opacity-80" />
        
        <div className="z-10 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-secondary rounded-xl mb-8 shadow-lg" />
          <h1 className="text-display font-heading text-5xl">Precision</h1>
          <p className="text-body-lg text-[#accfb3] max-w-md mx-auto leading-relaxed">
            Manage both cognitive load and capital with tranquil authority. Welcome to the workspace.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-md bg-surface-container-lowest p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-border">
          <h2 className="text-headline-lg font-heading text-foreground mb-2">Sign In</h2>
          <p className="text-body-md text-muted-foreground mb-8">
            Enter your credentials to access the workspace.
          </p>

          <form onSubmit={handleSignIn} className="space-y-5">
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
              <div className="flex justify-between items-center">
                <label className="text-label-caps text-foreground uppercase block">Password</label>
                <a href="#" className="text-sm font-medium text-foreground hover:text-secondary transition-colors">
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full px-4 py-3 rounded-md border border-input bg-surface-container-lowest text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium text-sm tracking-wide hover:bg-primary-container transition-colors mt-2"
            >
              ENTER WORKSPACE
            </button>
          </form>

          <div className="mt-8 mb-6 relative flex items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm">Or continue with</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-md border border-input bg-surface-container-lowest hover:bg-surface-variant transition-colors text-foreground text-sm font-medium">
              <LogIn className="w-4 h-4" /> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-md border border-input bg-surface-container-lowest hover:bg-surface-variant transition-colors text-foreground text-sm font-medium">
              <Apple className="w-4 h-4" /> Apple
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Don&apos;t have an account? <a href="#" className="font-semibold text-foreground hover:text-secondary transition-colors">Request Access</a>
          </p>
        </div>

        <p className="mt-8 text-xs text-muted-foreground font-mono">
          v1.0.0 / Secure Connection
        </p>
      </div>
    </div>
  );
}
