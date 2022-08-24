import { NextApiRequest, NextApiResponse } from "next"
import { unstable_getServerSession } from "next-auth"
import { Spent } from "@prisma/client"
import { authOptions } from "../auth/[...nextauth]"
import prisma from "lib/prisma"

type Data = { message: string } | Spent[] | Spent

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return getSpents(req, res)
    case "POST":
      return newSpent(req, res)
    default:
      return res.status(400).json({ message: "Bad request" })
  }
}

async function getSpents(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ message: "Unauthorized" })

  const budget = await prisma.budget.findFirst({
    orderBy: {
      date: "desc",
    },
  })

  const spents = await prisma.spent.findMany({
    where: {
      budgetId: budget?.id,
    },
  })

  return res.status(200).json(spents)
}

async function newSpent(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ message: "Unauthorized" })

  const { name, amount, category, budgetId } = req.body

  try {
    const validcategories = [
      "ahorro",
      "comida",
      "casa",
      "gastos varios",
      "ocio",
      "salud",
      "suscripciones",
    ]

    if (name.trim() === "") return res.status(400).json({ message: "Bad request" })

    if (!validcategories.includes(category))
      return res.status(400).json({ message: "Bad request" })

    const spent = await prisma.spent.create({
      data: {
        name: name.replace(/\s+/g, " ").trim(),
        amount: parseInt(amount),
        category,
        budget: { connect: { id: budgetId } },
      },
    })

    await prisma.budget.update({
      where: {
        id: budgetId,
      },
      data: {
        taken: {
          increment: parseInt(amount),
        },
      },
    })

    return res.status(200).json(spent)
  } catch (error) {
    return res.status(500).json({ message: "error" })
  }
}
