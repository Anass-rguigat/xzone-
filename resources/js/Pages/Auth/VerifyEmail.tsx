import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerifyEmail({ status }: { status?: string }) {
  const { post, processing } = useForm({});

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('verification.send'));
  };

  return (
    <GuestLayout>
      <Head title="Email Verification" />

      <div className={cn("flex flex-col items-center justify-center min-h-screen p-6")}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Email Verification</CardTitle>
            <CardDescription>
              Thanks for signing up! Before getting started, could you verify
              your email address by clicking on the link we just emailed to
              you? If you didn't receive the email, we will gladly send you
              another.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === 'verification-link-sent' && (
              <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                A new verification link has been sent to the email address
                you provided during registration.
              </div>
            )}

            <form onSubmit={submit}>
              <div className="mt-4 flex flex-col gap-6">
                <div className="mt-4 flex items-center justify-between">
                  <PrimaryButton disabled={processing}>
                    Resend Verification Email
                  </PrimaryButton>
                  <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                  >
                    Log Out
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </GuestLayout>
  );
}
