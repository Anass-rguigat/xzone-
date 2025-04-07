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
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function Register({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route("register"), {
      onFinish: () => reset("password", "password_confirmation"),
    });
  };

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen p-6", className)} {...props}>
      <Head title="Register" />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Enter your details to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={data.name} onChange={(e) => setData("name", e.target.value)} required />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" value={data.email} onChange={(e) => setData("email", e.target.value)} required />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" value={data.password} onChange={(e) => setData("password", e.target.value)} required />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <Input id="password_confirmation" type="password" name="password_confirmation" value={data.password_confirmation} onChange={(e) => setData("password_confirmation", e.target.value)} required />
              {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={processing}>Register</Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account? {" "}
            <Link href={route("login")} className="underline underline-offset-4">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
