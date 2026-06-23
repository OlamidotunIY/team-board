import { gql } from "@apollo/client"

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginDto!) {
    login(loginInput: $input) {
      accessToken
      user {
        id
        email
        name
        role
        jobTitle
        timezone
      }
    }
  }
`
