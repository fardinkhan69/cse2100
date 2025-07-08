
/**
 * Login Page Component
 * 
 * Modern login page design with Firebase authentication integration
 * Features:
 * - Responsive design for all screen sizes
 * - Email/password authentication with Firebase
 * - Google Sign-In integration
 * - Create new account functionality
 * - Modern UI with animations
 * - Improved gradient and text visibility
 */

import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Chrome } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AuthContext } from '@/components/AuthProvider';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, setUser, createUser, signInUser, signInWithGoogle, isLoading, setIsLoading } = useContext(AuthContext);
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCreateAccount, setIsCreateAccount] = useState(false);

  // Get the intended destination from location state or URL params with validation
  const getValidatedRedirectUrl = () => {
    const fromState = location.state?.from?.pathname;
    const fromQuery = new URLSearchParams(location.search).get('redirect');
    const redirectUrl = fromState || fromQuery;

    // Validate redirect URL to prevent open redirect attacks
    if (redirectUrl) {
      // Only allow internal URLs (starting with /)
      if (redirectUrl.startsWith('/') && !redirectUrl.startsWith('//')) {
        // Additional validation for known routes
        const validRoutes = ['/dashboard', '/book/', '/'];
        const isValidRoute = validRoutes.some(route =>
          redirectUrl === route || redirectUrl.startsWith(route)
        );

        if (isValidRoute) {
          console.log('Smart redirect: Redirecting to intended destination:', redirectUrl);
          return redirectUrl;
        }
      }
    }

    // Default to dashboard if no valid redirect URL
    console.log('Smart redirect: No valid redirect URL found, defaulting to dashboard');
    return '/dashboard';
  };

  const from = getValidatedRedirectUrl();

  // Redirect authenticated users to their intended destination
  useEffect(() => {
    if (user && !isLoading) {
      navigate(from, { replace: true });
    }
  }, [user, isLoading, navigate, from]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isCreateAccount) {
        // Validate password confirmation
        if (password !== confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Create new account
        const userCredential = await createUser(email, password);
        setUser(userCredential.user);
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
      } else {
        // Sign in existing user
        const userCredential = await signInUser(email, password);
        setUser(userCredential.user);
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
      }

      // Navigate to intended destination on success
      navigate(from, { replace: true });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      const userCredential = await signInWithGoogle();
      setUser(userCredential.user);
      toast({
        title: "Success",
        description: "Logged in with Google successfully!",
      });
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCreateAccount = () => {
    setIsCreateAccount(!isCreateAccount);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-medical-light/20 to-medical-medium/30 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-medical-light/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-medical-medium/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-medical-dark transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </motion.button>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="backdrop-blur-sm bg-white/80 shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="text-center space-y-2 bg-gradient-to-r from-medical-dark via-medical-medium to-medical-dark text-white p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-white font-bold text-2xl">R</span>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-white">
              {isCreateAccount ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-white/90 font-medium">
              {isCreateAccount 
                ? 'Join RUET Medical Center today' 
                : 'Sign in to your RUET Medical Center account'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.form
                key={isCreateAccount ? 'create' : 'login'}
                initial={{ opacity: 0, x: isCreateAccount ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isCreateAccount ? -20 : 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleEmailLogin}
                className="space-y-6"
              >
                
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your student email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-medical-medium focus:ring-medical-light rounded-lg"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-12 h-12 bg-gray-50 border-gray-200 focus:border-medical-medium focus:ring-medical-light rounded-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field (only for create account) */}
                {isCreateAccount && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-12 h-12 bg-gray-50 border-gray-200 focus:border-medical-medium focus:ring-medical-light rounded-lg"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Forgot Password Link (only for login) */}
                {!isCreateAccount && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-medical-dark hover:text-medical-medium font-medium"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-medical-medium to-medical-dark hover:from-medical-dark hover:to-medical-medium text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      isCreateAccount ? 'Create Account' : 'Sign In'
                    )}
                  </Button>
                </motion.div>

                {/* Google Login Button */}
                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full h-12 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-all duration-300 flex items-center gap-3"
                  disabled={isLoading}
                >
                  <Chrome className="w-5 h-5" />
                  Continue with Google
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      {isCreateAccount ? 'Already have an account?' : 'New to RUET Medical?'}
                    </span>
                  </div>
                </div>

                {/* Toggle Create Account Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-2 border-medical-medium text-medical-dark hover:bg-medical-medium hover:text-white font-semibold rounded-lg transition-all duration-300"
                  onClick={toggleCreateAccount}
                >
                  {isCreateAccount ? 'Sign In Instead' : 'Create New Account'}
                </Button>
              </motion.form>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
