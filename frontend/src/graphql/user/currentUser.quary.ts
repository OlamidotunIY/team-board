import { gql } from "@apollo/client"

export const GET_USER = gql`
  query Me {
    currentUser {
      id
      email
      name
      role
      jobTitle
      timezone
    }
  }
`
