import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { teamCreationSchema, type TeamCreationFormValues } from '../../dtos/teams.dto';
import { useTeamCreation } from '../../hooks/use-team-creation';
import { useAuth } from '@/features/Auth/hooks/use-auth';
import type { IUserSearchResult } from '../../types/teams.types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Users,
  User,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Search,
  Loader2,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Team Info', icon: GraduationCap },
  { id: 2, label: 'Supervisor', icon: User },
  { id: 3, label: 'Your Details', icon: User },
  { id: 4, label: 'Members', icon: Users },
];

// ─── Field helpers ───────────────────────────────────────────────────────────

function TextInput({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <Input {...props} className={`h-10 ${error ? 'border-red-400 focus-visible:ring-red-400' : ''}`} />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function UniversitySelect({
  value,
  onChange,
  universities,
  loading,
  error,
  label = 'University',
}: {
  value: string;
  onChange: (v: string) => void;
  universities: { id: string; name: string }[];
  loading: boolean;
  error?: string;
  label?: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={loading}>
        <SelectTrigger className={`h-10 ${error ? 'border-red-400' : ''}`}>
          <SelectValue placeholder={loading ? 'Loading…' : 'Select university'} />
        </SelectTrigger>
        <SelectContent>
          {universities.map((u) => (
            <SelectItem key={u.id} value={u.id}>
              {u.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Supervisor block ─────────────────────────────────────────────────────────

function SupervisorFields({
  prefix,
  form,
  universities,
  universitiesLoading,
}: {
  prefix: 'supervisor' | 'co_supervisor';
  form: ReturnType<typeof useForm<TeamCreationFormValues>>;
  universities: { id: string; name: string }[];
  universitiesLoading: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name={`${prefix}.supervisor_name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Dr. Jane Smith" className="h-10" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${prefix}.supervisor_email`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="supervisor@university.edu" className="h-10" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${prefix}.supervisor_contact_number`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Number</FormLabel>
            <FormControl>
              <Input {...field} placeholder="+94 77 123 4567" className="h-10" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`${prefix}.supervisor_university_id`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>University</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={universitiesLoading}
            >
              <FormControl>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={universitiesLoading ? 'Loading…' : 'Select university'} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {universities.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, idx) => {
        const done = step.id < current;
        const active = step.id === current;
        const Icon = step.icon;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  done
                    ? 'bg-uiy-blue text-white'
                    : active
                    ? 'bg-uiy-blue text-white ring-4 ring-blue-100'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  active ? 'text-uiy-blue' : done ? 'text-uiy-blue' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-12 sm:w-20 mx-1 mt-[-1.25rem] transition-colors duration-200 ${
                  step.id < current ? 'bg-uiy-blue' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Member card ──────────────────────────────────────────────────────────────

function MemberCard({
  index,
  form,
  onRemove,
}: {
  index: number;
  form: ReturnType<typeof useForm<TeamCreationFormValues>>;
  onRemove: () => void;
}) {
  const fullName = form.watch(`members.${index}.full_name`);
  const email = form.watch(`members.${index}.email`);

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-gray-800">{fullName}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded"
          aria-label="Remove member"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FormField
          control={form.control}
          name={`members.${index}.iesl_id`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">IESL ID</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="12345"
                  className="h-9 text-sm"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`members.${index}.department`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Department</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Electrical" className="h-9 text-sm" />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`members.${index}.university_id_image`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Uni ID Image URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://…" className="h-9 text-sm" />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TeamCreationForm() {
  const { dbUser } = useAuth();
  const {
    universities,
    universitiesLoading,
    searchQuery,
    searchResults,
    searchLoading,
    submitting,
    handleSearchChange,
    clearSearch,
    submitTeam,
  } = useTeamCreation();

  const [step, setStep] = useState(1);
  const [showCoSupervisor, setShowCoSupervisor] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const form = useForm<TeamCreationFormValues>({
    resolver: zodResolver(teamCreationSchema),
    defaultValues: {
      team_name: '',
      university_id: '',
      supervisor: {
        supervisor_name: '',
        supervisor_email: '',
        supervisor_contact_number: '',
        supervisor_university_id: '',
      },
      has_co_supervisor: false,
      co_supervisor: undefined,
      leader_iesl_id: '' as unknown as number,
      leader_department: '',
      leader_university_id_image: '',
      members: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'members',
  });

  // ── Step navigation with partial validation ────────────────────────────────

  const goNext = async () => {
    let fieldsToValidate: (keyof TeamCreationFormValues)[] = [];
    if (step === 1) fieldsToValidate = ['team_name', 'university_id'];
    if (step === 2) fieldsToValidate = ['supervisor'];
    if (step === 3) fieldsToValidate = ['leader_iesl_id', 'leader_department', 'leader_university_id_image'];

    const ok = await form.trigger(fieldsToValidate as Parameters<typeof form.trigger>[0]);
    if (ok) setStep((s) => Math.min(s + 1, 4));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  // ── Add member from search ─────────────────────────────────────────────────

  const addMember = (user: IUserSearchResult) => {
    const alreadyAdded = fields.some((f) => f.user_id === user.id);
    if (alreadyAdded) return;
    append({
      user_id: user.id,
      full_name: user.full_name,
      email: user.email,
      iesl_id: '' as unknown as number,
      department: '',
      university_id_image: '',
    });
    clearSearch();
    setShowSearchResults(false);
  };

  // ── Form submit ────────────────────────────────────────────────────────────

  const onSubmit = async (values: TeamCreationFormValues) => {
    await submitTeam(values);
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-uiy-blue/10 mb-4">
            <Users className="w-8 h-8 text-uiy-blue" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Create Your Team</h1>
          <p className="text-gray-500 mt-2">Register your team for UIY 2026</p>
        </div>

        <StepIndicator current={step} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>

            {/* ── Step 1: Team Info ── */}
            {step === 1 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-uiy-blue" />
                    Team Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="team_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. TechPioneers 2026" className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="university_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={universitiesLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder={universitiesLoading ? 'Loading…' : 'Select your university'} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {universities.map((u) => (
                              <SelectItem key={u.id} value={u.id}>
                                {u.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* ── Step 2: Supervisor ── */}
            {step === 2 && (
              <div className="space-y-4">
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-uiy-blue" />
                      Supervisor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SupervisorFields
                      prefix="supervisor"
                      form={form}
                      universities={universities}
                      universitiesLoading={universitiesLoading}
                    />
                  </CardContent>
                </Card>

                {/* Co-supervisor toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCoSupervisor((v) => !v);
                      form.setValue('has_co_supervisor', !showCoSupervisor);
                    }}
                    className="flex items-center gap-2 text-sm text-uiy-blue font-medium hover:underline"
                  >
                    <Plus className="w-4 h-4" />
                    {showCoSupervisor ? 'Remove Co-Supervisor' : 'Add Co-Supervisor (optional)'}
                  </button>

                  {showCoSupervisor && (
                    <Card className="shadow-sm mt-3">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="w-5 h-5 text-gray-400" />
                          Co-Supervisor
                          <Badge variant="secondary" className="text-xs">Optional</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <SupervisorFields
                          prefix="co_supervisor"
                          form={form}
                          universities={universities}
                          universitiesLoading={universitiesLoading}
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* ── Step 3: Leader Details ── */}
            {step === 3 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-uiy-blue" />
                    Your Details
                    <Badge className="bg-uiy-blue text-white text-xs">Team Leader</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Read-only identity */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-uiy-blue flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {dbUser?.full_name?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{dbUser?.full_name ?? '—'}</p>
                      <p className="text-sm text-gray-500">{dbUser?.email ?? '—'}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto text-xs border-uiy-blue text-uiy-blue">
                      Leader
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    You are automatically registered as the team leader. Fill in your membership details below.
                  </p>
                  <Separator />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="leader_iesl_id"
                      render={({ field }) => (
                        <FormItem> 
                          <FormLabel>IESL Member ID</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="12345"
                              className="h-10"
                              value={field.value || ''}
                              onChange={(e) =>
                                field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="leader_department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. Electrical Eng." className="h-10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="leader_university_id_image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Uni ID Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://…" className="h-10" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ── Step 4: Team Members ── */}
            {step === 4 && (
              <div className="space-y-4">
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-5 h-5 text-uiy-blue" />
                      Team Members
                      {fields.length > 0 && (
                        <Badge className="bg-uiy-blue/10 text-uiy-blue text-xs ml-auto">
                          {fields.length} added
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Search box */}
                    <div className="relative">
                      <Label className="text-sm font-medium text-gray-700 mb-1 block">
                        Search team members by email
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          value={searchQuery}
                          onChange={(e) => {
                            handleSearchChange(e.target.value);
                            setShowSearchResults(true);
                          }}
                          onFocus={() => setShowSearchResults(true)}
                          placeholder="Type email to search registered users..."
                          className="h-10 pl-9 pr-9"
                        />
                        {searchLoading && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                        )}
                        {searchQuery && !searchLoading && (
                          <button
                            type="button"
                            onClick={() => {
                              clearSearch();
                              setShowSearchResults(false);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Results dropdown */}
                      {showSearchResults && searchResults.length > 0 && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                          {searchResults.map((user) => {
                            const alreadyAdded = fields.some((f) => f.user_id === user.id);
                            const isLeader = user.id === dbUser?.id;
                            const blocked = alreadyAdded || isLeader || user.in_team;
                            return (
                              <button
                                key={user.id}
                                type="button"
                                disabled={blocked}
                                onClick={() => addMember(user)}
                                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                                  blocked
                                    ? 'opacity-50 cursor-not-allowed bg-gray-50'
                                    : 'hover:bg-blue-50 cursor-pointer'
                                }`}
                              >
                                <div className="w-8 h-8 rounded-full bg-uiy-blue/10 flex items-center justify-center text-uiy-blue font-semibold text-sm flex-shrink-0">
                                  {user.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-800 truncate">{user.full_name}</p>
                                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                                {alreadyAdded && <Badge variant="secondary" className="text-xs">Added</Badge>}
                                {isLeader && <Badge variant="secondary" className="text-xs">You (Leader)</Badge>}
                                {!alreadyAdded && !isLeader && user.in_team && (
                                  <Badge variant="destructive" className="text-xs">Already in a team</Badge>
                                )}
                                {!blocked && (
                                  <Plus className="w-4 h-4 text-uiy-blue flex-shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {showSearchResults && searchQuery.length >= 2 && !searchLoading && searchResults.length === 0 && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-500">
                          No registered users found for "{searchQuery}"
                        </div>
                      )}
                    </div>

                    {/* Member cards */}
                    {fields.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No members added yet</p>
                        <p className="text-xs">Search by email above to add team members</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {fields.map((field, index) => (
                          <MemberCard
                            key={field.id}
                            index={index}
                            form={form}
                            onRemove={() => remove(index)}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Summary */}
                <Card className="bg-blue-50 border-blue-100 shadow-sm">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-sm font-semibold text-uiy-blue mb-2">Submission Summary</p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>• Team: <span className="font-medium text-gray-800">{form.getValues('team_name') || '—'}</span></p>
                      <p>• University: <span className="font-medium text-gray-800">{universities.find(u => u.id === form.getValues('university_id'))?.name || '—'}</span></p>
                      <p>• Leader: <span className="font-medium text-gray-800">{dbUser?.full_name ?? '—'}</span></p>
                      <p>• Total members: <span className="font-medium text-gray-800">{fields.length + 1} (including you)</span></p>
                      {showCoSupervisor && <p>• Co-supervisor included ✓</p>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ── Navigation ── */}
            <div className="flex items-center justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={step === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              {step < 4 ? (
                <Button
                  type="button"
                  onClick={goNext}
                  className="bg-uiy-blue hover:bg-uiy-darkblue text-white flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-uiy-blue hover:bg-uiy-darkblue text-white flex items-center gap-2 min-w-[140px]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
