import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Shield, User, Mail, Lock, Zap, ChevronRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, themeClasses } = useTheme();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast.success("Account created! Please check your email to verify.");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Login successful!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900' : 'bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50'} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <div className={`hidden md:flex flex-col justify-center space-y-6 ${isDarkMode ? '' : 'text-slate-900'}`}>
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className={`text-5xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Bus Watch</h1>
                <p className={isDarkMode ? 'text-indigo-200 text-lg' : 'text-indigo-600 text-lg'}>Plus</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                  <Zap className={`w-5 h-5 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
                </div>
                <div>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Real-Time Monitoring</p>
                  <p className={isDarkMode ? 'text-indigo-200 text-sm' : 'text-slate-600 text-sm'}>Track bus safety in real-time</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                  <Shield className={`w-5 h-5 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                </div>
                <div>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Incident Reporting</p>
                  <p className={isDarkMode ? 'text-indigo-200 text-sm' : 'text-slate-600 text-sm'}>Report and track incidents instantly</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${isDarkMode ? 'bg-pink-500/20' : 'bg-pink-100'}`}>
                  <Mail className={`w-5 h-5 ${isDarkMode ? 'text-pink-300' : 'text-pink-600'}`} />
                </div>
                <div>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Community Safety</p>
                  <p className={isDarkMode ? 'text-indigo-200 text-sm' : 'text-slate-600 text-sm'}>Share feedback with the community</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Auth Form */}
          <div className="w-full">
            <Card className={`border-0 shadow-2xl backdrop-blur-xl ${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-white to-indigo-50'}`}>
              <CardHeader className="space-y-1 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={`text-3xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {isSignUp ? "Create Account" : "Welcome Back"}
                    </CardTitle>
                    <CardDescription className={isDarkMode ? 'text-indigo-300 mt-2' : 'text-slate-600 mt-2'}>
                      {isSignUp
                        ? "Join thousands keeping commutes safe"
                        : "Sign in to continue to your dashboard"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-5">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="username" className="flex items-center gap-2 text-white font-semibold">
                        <User className="w-4 h-4 text-indigo-400" />
                        Username
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Choose your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="h-12 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-white font-semibold">
                      <Mail className="w-4 h-4 text-indigo-400" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2 text-white font-semibold">
                      <Lock className="w-4 h-4 text-indigo-400" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-12 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500 pr-10"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-white font-semibold">
                        <Lock className="w-4 h-4 text-indigo-400" />
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="h-12 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500 pr-10"
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {!isSignUp && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-slate-600 text-indigo-500 cursor-pointer" />
                        <span className="text-sm text-slate-300">Remember me</span>
                      </label>
                      <Button type="button" variant="link" className="text-sm text-indigo-400 hover:text-indigo-300 p-0 h-auto">
                        Forgot password?
                      </Button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-r-transparent rounded-full animate-spin"></div>
                        {isSignUp ? "Creating..." : "Signing in..."}
                      </>
                    ) : (
                      <>
                        {isSignUp ? "Create Account" : "Sign In"}
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-3 my-6">
                    <div className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent"></div>
                    <span className="text-sm text-slate-400">or</span>
                    <div className="h-px flex-1 bg-gradient-to-l from-slate-700 to-transparent"></div>
                  </div>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-indigo-300 hover:text-indigo-200 hover:bg-slate-700"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setUsername("");
                        setEmail("");
                        setPassword("");
                        setConfirmPassword("");
                      }}
                    >
                      {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <p className="text-center text-sm text-slate-400 mt-6">
              By continuing, you agree to our <Button variant="link" className="text-indigo-400 p-0 h-auto">Terms of Service</Button> and <Button variant="link" className="text-indigo-400 p-0 h-auto">Privacy Policy</Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
