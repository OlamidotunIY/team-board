
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import type { ProjectsQuery, ProjectsQueryVariables } from "@/gql/graphql"
import { LIST_PROJECTS } from "@/graphql/project/list-project.quary"
import { PATHS } from "@/routing/paths"
import { useQuery } from "@apollo/client/react"
import { CalendarDays, Eye, Lock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import CreateProject from "./components/create-project"


function ProjectsPage()
{
  const { data, loading } = useQuery<ProjectsQuery, ProjectsQueryVariables>(LIST_PROJECTS)
  const navigate = useNavigate();
  return (
    <div className="p-5">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <CreateProject />
      </div>
      {data?.projects && (
        <div className="flex flex-row flex-wrap gap-5 mt-5">
          {data?.projects.map((project) => (
            <Card className="w-full max-w-sm overflow-hidden">
              <CardHeader className="space-y-2 px-4 pt-4">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-1">
                    {project.name}
                  </CardTitle>
                  <Badge
                    variant={
                      project.status === "COMPLETED"
                        ? "default"
                        : project.status === "ACTIVE"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {project.visibility === "TEAM" ? (
                    <>
                      <Eye size={15} />
                      Team
                    </>
                  ) : (
                    <>
                      <Lock size={15} />
                      Private
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-4 space-y-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      Progress
                    </span>
                    <span>
                      {project.progress}%
                    </span>
                  </div>
                  <Progress
                    value={project.progress}
                  />
                </div>
                {/* Due date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays size={16} />
                  Due:
                  {new Date(project?.dueDate as string).toLocaleDateString()}
                </div>
              </CardContent>
              <CardFooter className="px-4 pb-4">
                <Button className="w-full" onClick={() =>
                {
                  navigate(PATHS.projects.detail(project.id))
                }}>
                  View Project
                </Button>
              </CardFooter>

            </Card>
          ))}
        </div>
      )}
      {loading && (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
            <Item variant="muted">
              <ItemMedia>
                <Spinner />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="line-clamp-1">Loading projects...</ItemTitle>
              </ItemContent>
            </Item>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectsPage