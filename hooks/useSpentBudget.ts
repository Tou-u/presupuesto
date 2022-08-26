import { Spent } from "@prisma/client"
import useSWR from "swr"

export default function useSpentBudget(id: string, data_spent: Spent[]) {
  const { data, error, mutate } = useSWR<Spent[]>(`/api/spent/budget?id=${id}`, {
    fallbackData: data_spent,
  })

  const loading = !data && !error

  return {
    lspent: loading,
    spent: data,
    mspent: mutate,
  }
}
