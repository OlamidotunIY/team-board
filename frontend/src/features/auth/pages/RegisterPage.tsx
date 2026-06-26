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
import { useForm } from "react-hook-form";
import { signUpSchema, type SignUpFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import type { RegisterMutation, RegisterMutationVariables } from "@/gql/graphql";
import { REGISTER_MUTATION } from "@/graphql/auth/register.mutation";
import { toast } from "sonner";
import { ToastMessage } from "@/components/custom/ToastMessage";
import { PATHS } from "@/routing/paths";
import { Eye, EyeOff, Lock, Mail, User2 } from "lucide-react";
import { extractGraphQLErrors } from "@/lib/graphql";

function RegisterPage()
{
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [registerMutation] = useMutation<RegisterMutation, RegisterMutationVariables>(REGISTER_MUTATION)


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) =>
  {
    setIsLoading(true);
    try
    {
      registerMutation({
        variables: {
          input: {
            ...data
          }
        },
        onError(error)
        {
          const extractedError = extractGraphQLErrors(error)[0]
          toast.error(
            <ToastMessage
              title={`Registration failed: ${extractedError.extensions?.code}`}
              description={extractedError.message}
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
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <div className="relative">
            <User2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              className="bg-background pl-10"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-sm text-red-600">
              {errors.name.message}
            </p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input id="email" type="email" placeholder="m@example.com" className="pl-10" required {...register("email")} />
          </div>
          {errors.email ? (
            <FieldDescription className="text-sm text-red-600">
              {errors.email.message}
            </FieldDescription>
          ) : (
            <FieldDescription>
              We&apos;ll use this to contact you. We will not share your email
              with anyone else.
            </FieldDescription>
          )}

        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
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
          {errors.password ? (
            <p className="text-sm text-red-600">
              {errors.password.message}
            </p>
          ) : (
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
          )}

        </Field>
        <Field>
          <Button type="submit">
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account? <Link to={PATHS.auth.login}>Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default RegisterPage