import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "lib/prisma"
import { Budget } from "@prisma/client"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"

type Data = { message: string } | Budget[] | Budget

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })
    const { id } = session?.user!

    const budget = await prisma.budget.findMany({
      where: {
        id: req.query.id as string,
      },
    })

    if (budget.length === 0) return res.status(404).json({ message: "Not found" })

    if (budget[0].userId !== id) return res.status(404).json({ message: "Not found" })

    return res.status(200).json(budget!)
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}
