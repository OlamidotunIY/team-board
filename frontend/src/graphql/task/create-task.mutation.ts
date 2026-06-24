import { gql } from "@apollo/client"

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskDto!) {
    createTask(taskInput: $input) {
      id
      title
      status
      priority
      labels
      estimateMinutes
      order
    }
  }
`
