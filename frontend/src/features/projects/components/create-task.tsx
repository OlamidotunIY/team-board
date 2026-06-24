import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@apollo/client/react"

import
{
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

import
{
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { CreateTaskMutation, CreateTaskMutationVariables } from "@/gql/graphql"
import { CREATE_TASK } from "@/graphql/task/create-task.mutation"
import { createTaskSchema, type CreateTaskFormData } from "@/lib/validations"
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from "../data/data"
import { useParams } from "react-router-dom"
import { LIST_TASKS } from "@/graphql/task/task-list.quary"

function CreateTask()
{
    const [isLoading, setIsLoading] = useState(false)
    const { projectId } = useParams<{ projectId: string }>();
    const [open, setOpen] = useState<boolean>(false)

    const [createTaskMutation] = useMutation<
        CreateTaskMutation,
        CreateTaskMutationVariables
    >(CREATE_TASK, {
        refetchQueries: [LIST_TASKS]
    })

    const {
        register,
        handleSubmit,
        control,
    } = useForm<CreateTaskFormData>({
        resolver: zodResolver(createTaskSchema),
    })

    const onSubmit = async (data: CreateTaskFormData) =>
    {
        setIsLoading(true)

        try
        {
            await createTaskMutation({
                variables: {
                    input: {
                        ...data,
                        labels: data.labels
                            ? data.labels.split(",").map((l) => l.trim())
                            : undefined,
                        projectId: projectId as string
                    },
                },
                onCompleted: () =>
                {
                    setOpen(false)
                }
            })
        } catch (error)
        {
            console.error(error)
        } finally
        {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Task</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg h-[85%] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                    <DialogDescription>
                        Add a new task to your project
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input {...register("title")} />
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
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {TASK_STATUS_OPTIONS.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                        <Label>Priority</Label>

                        <Controller
                            control={control}
                            name="priority"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {TASK_PRIORITY_OPTIONS.map((p) => (
                                            <SelectItem key={p} value={p}>
                                                {p}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Labels */}
                    <div className="space-y-2">
                        <Label>Labels (comma separated)</Label>
                        <Input {...register("labels")} />
                    </div>

                    {/* Due Date */}
                    <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Input type="date" {...register("dueDate")} />
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "Creating..." : "Create Task"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateTask