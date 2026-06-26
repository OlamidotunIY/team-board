import type { UserEntity } from "@/gql/schema-types"
import { create } from "zustand"

interface UserState {
  user: UserEntity | null
  setUser: (user: UserEntity | null) => void
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  setUser: (user) =>
    set({
      user,
    }),
}))
