import { Budget } from "@prisma/client"
import useSWR from "swr"

export default function useBudget(id: string, data_budget: Budget[]) {
  const { data, error, mutate } = useSWR<Budget[]>(`/api/budget/search?id=${id}`, {
    fallbackData: data_budget,
  })

  const loading = !data && !error

  return {
    lbudget: loading,
    budget: data,
    mbudget: mutate,
  }
}
