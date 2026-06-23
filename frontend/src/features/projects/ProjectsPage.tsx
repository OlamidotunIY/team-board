import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


function ProjectsPage()
{
  return (
    <div className="p-5">
      <h1>Projects</h1>
      <p></p>
      <div>
        <Card className="w-full max-w-sm pt-5">
          <CardHeader>
            <CardAction>
              {/* <Badge variant="outline">Featured</Badge> */}
            </CardAction>
            <CardTitle>Design systems meetup</CardTitle>
            <CardDescription>
              A practical talk on component APIs, accessibility, and shipping
              faster.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full">View Project</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default ProjectsPage