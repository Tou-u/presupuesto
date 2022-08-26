import type { GetServerSideProps, NextPage } from "next"
import prisma from "lib/prisma"
import { Budget, Spent } from "@prisma/client"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "pages/api/auth/[...nextauth]"
import { Grid, GridItem, Stack } from "@chakra-ui/react"
import InfoCard from "components/BudgetFromHistory/InfoCard"
import InfoBills from "components/BudgetFromHistory/InfoBills"
import useSearchBudget from "hooks/useSearchBudget"
import useSpentBudget from "hooks/useSpentBudget"

interface Props {
  data_budget: Budget[]
  data_spent: Spent[]
}

const BudgetID: NextPage<Props> = ({ data_budget, data_spent }) => {
  const budgetId = data_budget[0].id
  const { budget, mbudget } = useSearchBudget(budgetId, data_budget)
  const { spent, mspent } = useSpentBudget(budgetId, data_spent)

  return (
    <Grid
      templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }}
      m={2}
      gap={2}
    >
      <GridItem w={{ base: "100%", "2xl": "80%" }} margin="0 auto">
        <InfoCard budget={budget} mbudget={mbudget} mspent={mspent} />
      </GridItem>
      <GridItem w="100%">
        <Stack>
          <InfoBills spent={spent} mspent={mspent} mbudget={mbudget} />
        </Stack>
      </GridItem>
    </Grid>
  )
}

export default BudgetID

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params?.id as string

  const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions)
  if (!session) return { redirect: { destination: "/login", permanent: false } }
  // Enviar a página de login, TODO...

  const budget = await prisma.budget.findMany({
    where: {
      id: id as string,
    },
  })

  if (budget.length === 0) return { notFound: true }
  if (budget[0].userId !== session.user.id) return { notFound: true }

  const spent = await prisma.spent.findMany({
    where: {
      budgetId: id as string,
    },
  })

  return {
    props: {
      data_budget: JSON.parse(JSON.stringify(budget)),
      data_spent: JSON.parse(JSON.stringify(spent)),
    },
  }
}
