import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../../hooks/use-auth';
import { signupSchema, type SignupDto } from '../../dtos/auth.dto';
import { GoogleButton } from '../GoogleButton';

export const SignupForm: React.FC = () => {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupDto>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: SignupDto) => {
    const { error } = await signUpWithEmail(values.email, values.password, values.full_name);
    if (error) {
      toast({ variant: 'destructive', title: 'Sign-up failed', description: error.message });
    } else {
      toast({
        title: 'Account created!',
        description: 'Check your email to confirm your account, then sign in.',
      });
      navigate('/login');
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({ variant: 'destructive', title: 'Google sign-in failed', description: error.message });
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl border-0">
      <CardHeader className="pb-2 text-center">
        <h1 className="text-2xl font-bold text-uiy-dark">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Join UIY 2026 today</p>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
        <GoogleButton loading={googleLoading} disabled={isSubmitting} onClick={handleGoogle} />

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              type="text"
              placeholder="Jane Doe"
              autoComplete="name"
              {...register('full_name')}
            />
            {errors.full_name && (
              <p className="text-xs text-destructive">{errors.full_name.message}</p>
            )}
          </div>

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
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <Input
              id="confirm_password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register('confirm_password')}
            />
            {errors.confirm_password && (
              <p className="text-xs text-destructive">{errors.confirm_password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-uiy-blue hover:bg-uiy-darkblue"
            disabled={isSubmitting || googleLoading}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Create Account
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center pb-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-uiy-blue font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
