import { Spent } from "@prisma/client"
import useSWR from "swr"

export default function useSpent() {
  const { data, error, mutate } = useSWR<Spent[]>("/api/spent")

  const loading = !data && !error

  return {
    lspent: loading,
    spent: data,
    mspent: mutate,
  }
}
