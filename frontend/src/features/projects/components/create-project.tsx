import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import
{
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import
{
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Label } from "@/components/ui/label"
import type { CreateProjectMutation, CreateProjectMutationVariables, ProjectStatus, ProjectVisibility } from "@/gql/graphql"
import { toast } from "sonner"
import { createProjectSchema, type CreateProjectFormData } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useMutation } from "@apollo/client/react"
import { CREATE_PROJECT } from "@/graphql/project/create-project.quary"
import { LIST_PROJECTS } from "@/graphql/project/list-project.quary"
import { Plus } from "lucide-react"

function CreateProject()
{

    const PROJECT_STATUS_OPTIONS: ProjectStatus[] = [
        "ACTIVE",
        "ARCHIVED",
        "COMPLETED",
        "ON_HOLD",
        "PLANNING"
    ]

    const PROJECT_VISIBILITY_OPTIONS: ProjectVisibility[] = [
        "TEAM",
        "PRIVATE",
    ]

    const [isLoading, setIsLoading] = useState(false)

    const [createProjectMutation] = useMutation<
        CreateProjectMutation,
        CreateProjectMutationVariables
    >(CREATE_PROJECT, {
        refetchQueries: [LIST_PROJECTS]
    })

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<CreateProjectFormData>({
        resolver: zodResolver(createProjectSchema),
    })

    const onSubmit = async (data: CreateProjectFormData) =>
    {
        setIsLoading(true)

        try
        {
            await createProjectMutation({
                variables: {
                    input: {
                        ...data,
                        tags: data.tags
                            ? data.tags.split(",").map((t) => t.trim())
                            : undefined,
                    },
                },

                onCompleted()
                {
                    toast.success("Project created successfully")
                },

                onError()
                {
                    toast.error("Failed to create project")
                },
            })
        } catch (error)
        {
            console.error(error)
            toast.error("Unexpected error occurred")
        } finally
        {
            setIsLoading(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg overflow-y-scroll h-[85%]">
                <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new project.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input {...register("name")} />
                        {errors.name && (
                            <p className="text-sm text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input {...register("description")} />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Controller
                            control={control}
                            name="status"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value} >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {PROJECT_STATUS_OPTIONS.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status.replace("_", " ")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Visibility */}
                    <div className="space-y-2">
                        <Label>Visibility</Label>
                        <Controller
                            control={control}
                            name="visibility"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select visibility" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {PROJECT_VISIBILITY_OPTIONS.map((visibility) => (
                                            <SelectItem key={visibility} value={visibility}>
                                                {visibility}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Color */}
                    <div className="space-y-2">
                        <Label>Color</Label>
                        <Input type="color" {...register("color")} />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label>Tags (comma separated)</Label>
                        <Input {...register("tags")} />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                        <Input type="date" {...register("startDate")} />
                        <Input type="date" {...register("dueDate")} />
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "Creating..." : "Create Project"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateProject