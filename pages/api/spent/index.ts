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
    case "DELETE":
      return deleteSpent(req, res)
    case "PUT":
      return editSpent(req, res)
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

async function deleteSpent(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ message: "Unauthorized" })

  const { id } = req.body

  try {
    const spent = await prisma.spent.findUnique({
      where: {
        id,
      },
    })

    if (!spent) return res.status(400).json({ message: "Bad request" })

    await prisma.spent.delete({
      where: {
        id,
      },
    })

    await prisma.budget.update({
      where: {
        id: spent.budgetId,
      },
      data: {
        taken: {
          decrement: spent.amount,
        },
      },
    })

    return res.status(200).json({ message: "Spent deleted" })
  } catch (error) {
    return res.status(500).json({ message: "error" })
  }
}

async function editSpent(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ message: "Unauthorized" })

  const { id, name, amount, category, budgetId, oldamount } = req.body

  try {
    await prisma.spent.update({
      where: {
        id,
      },
      data: {
        name: name.replace(/\s+/g, " ").trim(),
        amount: parseInt(amount),
        category,
      },
    })

    if (oldamount < amount) {
      await prisma.budget.update({
        where: {
          id: budgetId,
        },
        data: {
          taken: {
            increment: parseInt(amount) - parseInt(oldamount),
          },
        },
      })
    } else {
      await prisma.budget.update({
        where: {
          id: budgetId,
        },
        data: {
          taken: {
            decrement: parseInt(oldamount) - parseInt(amount),
          },
        },
      })
    }

    return res.status(200).json({ message: "Spent edited" })
  } catch (error) {
    return res.status(500).json({ message: "error" })
  }
}
