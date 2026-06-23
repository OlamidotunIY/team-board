import { gql } from "@apollo/client"

export const LIST_TASKS = gql`
  query Tasks($projectId: ID!) {
    tasks(projectId: $projectId) {
      id
      title
      status
      priority
      labels
      dueDate
      completedAt
    }
  }
`
