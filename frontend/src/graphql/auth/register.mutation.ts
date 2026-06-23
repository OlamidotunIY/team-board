import { gql } from "@apollo/client"

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterDto!) {
    register(registerInput: $input) {
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
