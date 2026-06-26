
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import
{
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { toast } from "sonner";
import { ToastMessage } from "@/components/custom/ToastMessage";
import { useMutation } from "@apollo/client/react";
import { LOGIN_MUTATION } from "@/graphql/auth/login.mutation";
import type { LoginMutation, LoginMutationVariables } from "@/gql/graphql";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { PATHS } from "@/routing/paths";


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
          navigate(PATHS.root);
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
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input id="email" type="email" placeholder="m@example.com" className="pl-10" required {...register("email")} />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
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
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input id="password" type={showPassword ? "text" : "password"} className="pl-10 pr-10" required {...register("password")} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </Field>
        <Field>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Login"}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            Don't have an account? <Link to={PATHS.auth.signup}>Sign up</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default LoginPage