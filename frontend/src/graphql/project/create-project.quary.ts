import { gql } from "@apollo/client"

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectDto!) {
    createProject(projectInput: $input) {
      id
      name
      status
      visibility
      color
      tags
      progress
    }
  }
`
