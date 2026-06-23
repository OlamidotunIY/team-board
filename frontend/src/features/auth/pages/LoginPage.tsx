
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import
{
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { toast } from "sonner";
import { ToastMessage } from "@/components/custom/ToastMessage";
import { useMutation } from "@apollo/client/react";
import { LOGIN_MUTATION } from "@/graphql/auth/login.mutation";
import type { LoginMutation, LoginMutationVariables } from "@/gql/graphql";


function LoginPage()
{

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [loginMutation] = useMutation<LoginMutation, LoginMutationVariables>(LOGIN_MUTATION)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) =>
  {
    setIsLoading(true);
    try
    {
      loginMutation({
        variables: {
          input: {
            ...data
          }
        },
        onError()
        {
          toast.error(
            <ToastMessage
              title="Login failed"
              description="Invalid email or password. Please try again."
            />
          );
        },
        onCompleted()
        {
          toast.success(
            <ToastMessage
              title="Login successful"
              description="Welcome back! Redirecting to dashboard..."
            />
          );
          navigate("/dashboard");
        }
      })

    } catch (error)
    {
      toast.error(
        <ToastMessage
          title="Login failed"
          description="An unexpected error occurred. Please try again."
        />
      );
      console.error("Login error:", error);
    } finally
    {
      setIsLoading(false);
    }
  };


  return (
    <form className={cn("flex flex-col gap-6")} onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" required {...register("email")} />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required {...register("password")} />
        </Field>
        <Field>
          <Button type="submit">Login</Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default LoginPage