import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../../hooks/use-auth';
import { loginSchema, type LoginDto } from '../../dtos/auth.dto';
import { GoogleButton } from '../GoogleButton';
import { UserRole } from '../../enums/auth.enums';

export const LoginForm: React.FC = () => {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const params = new URLSearchParams(location.search);
  const returnTo = params.get('returnTo') ?? '/';
  const registerSessionId = params.get('registerSessionId');
  const signupHref = `/signup${location.search}`;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginDto) => {
    setLoginError(null);
    const { error, dbUser } = await signInWithEmail(values.email, values.password);
    if (error) {
      if (error.message.toLowerCase().includes('invalid login credentials') ||
          error.message.toLowerCase().includes('invalid credentials')) {
        setLoginError('invalid_credentials');
      } else {
        toast({ variant: 'destructive', title: 'Login failed', description: error.message });
      }
    } else {
      navigate(dbUser?.role === UserRole.ADMIN ? '/admin' : returnTo);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);

    localStorage.setItem(
      'post_auth_redirect',
      JSON.stringify({
        returnTo,
        registerSessionId,
      })
    );

    const { error } = await signInWithGoogle();
    if (error) {
      localStorage.removeItem('post_auth_redirect');
      toast({ variant: 'destructive', title: 'Google sign-in failed', description: error.message });
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl border-0">
      <CardHeader className="pb-2 text-center">
        <h1 className="text-2xl font-bold text-uiy-dark">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to your UIY 2026 account</p>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
        {loginError === 'invalid_credentials' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Incorrect email or password. If you signed up with Google, use the{' '}
              <button
                type="button"
                className="underline font-medium"
                onClick={handleGoogle}
              >
                Google button
              </button>{' '}above.
            </AlertDescription>
          </Alert>
        )}
        <GoogleButton loading={googleLoading} disabled={isSubmitting} onClick={handleGoogle} />

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-uiy-blue hover:bg-uiy-darkblue"
            disabled={isSubmitting || googleLoading}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Sign In
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center pb-6">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link to={signupHref} className="text-uiy-blue font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
