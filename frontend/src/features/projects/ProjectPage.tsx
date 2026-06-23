import { LIST_TASKS } from "@/graphql/task/task-list.quary"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { useQuery } from "@apollo/client/react"
import type { TasksQuery, TasksQueryVariables } from "@/gql/graphql"
import type { TaskEntity } from "@/gql/schema-types"
import { useParams } from "react-router-dom"

function ProjectPage()
{
  const { projectId } = useParams<{ projectId: string }>();

  const { data } = useQuery<TasksQuery, TasksQueryVariables>(LIST_TASKS, {
    skip: !projectId,
    variables: {
      projectId: projectId as string
    }
  })


  return (
    <>
      <div className="hidden h-full flex-1 flex-col gap-8 p-8 md:flex">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Welcome back!
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month.
            </p>
          </div>
          {/* <div className="flex items-center gap-2">
            <UserNav />
          </div> */}
        </div>
        <DataTable data={data?.tasks as TaskEntity[] ?? []} columns={columns} />
      </div>
    </>
  )
}

export default ProjectPage