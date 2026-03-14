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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../../hooks/use-auth';
import { signupSchema, type SignupDto } from '../../dtos/auth.dto';
import { GoogleButton } from '../GoogleButton';

export const SignupForm: React.FC = () => {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [accountExistsEmail, setAccountExistsEmail] = useState<string | null>(null);

  const params = new URLSearchParams(location.search);
  const returnTo = params.get('returnTo') ?? '/';
  const registerSessionId = params.get('registerSessionId');
  const loginHref = `/login${location.search}`;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupDto>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: SignupDto) => {
    setAccountExistsEmail(null);
    const { error } = await signUpWithEmail(values.email, values.password, {
      full_name: values.full_name,
      contact_number: values.contact_number,
      date_of_birth: values.date_of_birth,
      address: values.address,
      gender: values.gender,
    });
    if (error) {
      if (error.message.toLowerCase().includes('already registered') ||
          error.message.toLowerCase().includes('already exists')) {
        setAccountExistsEmail(values.email);
      } else {
        toast({ variant: 'destructive', title: 'Sign-up failed', description: error.message });
      }
    } else {
      toast({
        title: 'Account created!',
        description: 'Check your email to confirm your account, then sign in.',
      });
      navigate(loginHref);
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
        <h1 className="text-2xl font-bold text-uiy-dark">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Join UIY 2026 today</p>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
        {accountExistsEmail && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              An account already exists for <strong>{accountExistsEmail}</strong>.{' '}
              <Link to={loginHref} className="underline font-medium">
                Sign in instead
              </Link>
              {' '}or try{' '}
              <button
                type="button"
                className="underline font-medium"
                onClick={handleGoogle}
              >
                Continue with Google
              </button>.
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="contact_number">Phone Number</Label>
              <Input
                id="contact_number"
                type="tel"
                placeholder="+94 71 234 5678"
                autoComplete="tel"
                {...register('contact_number')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                {...register('date_of_birth')}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="gender">Gender</Label>
            <Select onValueChange={(v) => setValue('gender', v)}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              type="text"
              placeholder="123 Main St, Colombo"
              {...register('address')}
            />
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
          <Link to={loginHref} className="text-uiy-blue font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
