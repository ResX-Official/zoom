'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Lock, User } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (isAuthenticated: boolean) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check credentials
    if (username === 'thestreet' && password === 'letwork@2025') {
      // Store authentication in sessionStorage
      sessionStorage.setItem('admin_authenticated', 'true');
      sessionStorage.setItem('admin_user', username);
      onLogin(true);
    } else {
      setError('Invalid username or password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-2 flex items-center justify-center p-4">
      <Card className="bg-dark-1 border-dark-3 w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Lock className="w-6 h-6 text-blue-1" />
            Admin Login
          </CardTitle>
          <p className="text-gray-400">Enter your credentials to access the admin panel</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-white">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-dark-3 border-dark-4 text-white placeholder-gray-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-dark-3 border-dark-4 text-white placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-500 text-sm">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-1 hover:bg-blue-1/80 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
