import { Budget } from "@prisma/client"
import useSWR from "swr"

export default function useBudget() {
  const { data, error, mutate } = useSWR<Budget[]>("/api/budget")

  const loading = !data && !error

  return {
    lbudget: loading,
    budget: data,
    mbudget: mutate,
  }
}
