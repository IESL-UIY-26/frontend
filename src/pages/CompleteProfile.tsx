import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { authAPI } from '@/features/Auth/api/auth.api';

interface CompleteProfileFields {
  contact_number: string;
  date_of_birth: string;
  gender: string;
  address: string;
}

const CompleteProfile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const navigateAfterProfile = () => {
    const pendingRaw = localStorage.getItem('post_auth_redirect');
    if (!pendingRaw) {
      navigate('/', { replace: true });
      return;
    }

    try {
      const pending = JSON.parse(pendingRaw) as {
        returnTo?: string;
        registerSessionId?: string | null;
      };

      const nextPath = pending.returnTo || '/';
      const nextParams = new URLSearchParams();
      if (pending.registerSessionId) {
        nextParams.set('registerSessionId', pending.registerSessionId);
        nextParams.set('returnTo', nextPath);
      }

      localStorage.removeItem('post_auth_redirect');
      navigate(
        nextParams.toString() ? `${nextPath}?${nextParams.toString()}` : nextPath,
        { replace: true }
      );
    } catch {
      localStorage.removeItem('post_auth_redirect');
      navigate('/', { replace: true });
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<CompleteProfileFields>();

  const onSubmit = async (values: CompleteProfileFields) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    await authAPI.syncUser(session.access_token, {
      contact_number: values.contact_number,
      date_of_birth: values.date_of_birth,
      gender: values.gender,
      address: values.address,
    });

    toast({ title: 'Profile saved!', description: 'Welcome to UIY 2026.' });
    navigateAfterProfile();
  };

  return (
    <div  className="bg-white p-16 shadow-lg">
      <div className="min-h-screen flex items-center rounded-xl justify-center bg-gradient-to-br from-uiy-darkblue via-uiy-blue to-uiy-accent px-4 py-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Link to="/">
              <img src="/images/logo-light.png" alt="UIY 2026" className="h-16 w-auto" />
            </Link>
          </div>

          <Card className="shadow-2xl border-0">
            <CardHeader className="pb-2 text-center">
              <h1 className="text-2xl font-bold text-uiy-dark">Complete your profile</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Just a few more details to get you started
              </p>
            </CardHeader>

            <CardContent className="pt-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save & Continue
                </Button>

                <button
                  type="button"
                  className="w-full text-sm text-muted-foreground hover:underline"
                  onClick={navigateAfterProfile}
                >
                  Skip for now
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
