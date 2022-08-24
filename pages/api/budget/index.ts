import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "lib/prisma"
import { Budget } from "@prisma/client"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"

type Data = { message: string } | Budget[] | Budget

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return getBudget(req, res)
    case "POST":
      return newBudget(req, res)
    default:
      return res.status(400).json({ message: "Bad request" })
  }
}

async function getBudget(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })
    const { id } = session?.user!

    const budget = await prisma.budget.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        date: "desc",
      },
    })
    return res.status(200).json(budget!)
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

async function newBudget(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ message: "Unauthorized" })
  const { id } = session.user
  const { amount } = req.body

  try {
    const budget = await prisma.budget.create({
      data: {
        amount: parseInt(amount),
        taken: 0,
        user: { connect: { id } },
      },
    })
    return res.status(200).json(budget)
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}
