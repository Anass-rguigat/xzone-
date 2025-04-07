import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route("password.email"));
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen">
      <Head title="Forgot Password" />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email below to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status && (
            <div className="mb-4 text-sm font-medium text-green-600">
              {status}
            </div>
          )}
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={processing}>
              Email Password Reset Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}