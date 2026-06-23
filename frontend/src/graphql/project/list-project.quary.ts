import { gql } from "@apollo/client"

export const LIST_PROJECTS = gql`
  query Projects {
    projects {
      id
      name
      description
      status
      visibility
      tags
      progress
      dueDate
    }
  }
`
