import { NextApiRequest, NextApiResponse } from "next"
import { unstable_getServerSession } from "next-auth"
import { Spent } from "@prisma/client"
import { authOptions } from "../auth/[...nextauth]"
import prisma from "lib/prisma"

type Data = { message: string } | Spent[] | Spent

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })
    const { id } = session?.user!

    const budget = await prisma.budget.findUnique({
      where: {
        id: req.query.id as string,
      },
    })

    if (!budget) return res.status(404).json({ message: "Not found" })

    if (id !== budget.userId) return res.status(404).json({ message: "Not found" })

    const spent = await prisma.spent.findMany({
      where: {
        budgetId: req.query.id as string,
      },
    })

    return res.status(200).json(spent!)
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}
