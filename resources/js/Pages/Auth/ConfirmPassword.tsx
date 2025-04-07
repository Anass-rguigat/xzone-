import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import GuestLayout from '@/Layouts/GuestLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/Components/InputError";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function ConfirmPassword() {
  const { data, setData, post, processing, errors, reset } = useForm({
    password: "",
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("password.confirm"), {
      onFinish: () => reset("password"),
    });
  };

  return (
    <GuestLayout>
    <div className={cn("flex flex-col items-center justify-center min-h-screen p-6")}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Confirm Password</CardTitle>
          <CardDescription>
            This is a secure area of the application. Please confirm your
            password before continuing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={data.password}
                  className="mt-1 block w-full"
                  isFocused={true}
                  onChange={(e) => setData("password", e.target.value)}
                />
                <InputError message={errors.password} className="mt-2" />
              </div>

              <div className="mt-4 flex items-center justify-end">
                <Button type="submit" disabled={processing} className="w-full">
                  Confirm
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    </GuestLayout>
  );
}
