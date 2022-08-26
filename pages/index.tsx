import type { NextPage } from "next"
import NewBudget from "components/NewBudget"
import InfoCard from "components/InfoCard"
import InfoBills from "components/InfoBills"
import Header from "components/Header"
import useBudget from "hooks/useBudget"
import useSpent from "hooks/useSpent"
import { Stack, Grid, GridItem } from "@chakra-ui/react"
import { useState } from "react"

const Home: NextPage = () => {
  const [newbudget, setNewbudget] = useState(false)

  const { lbudget, budget, mbudget } = useBudget()
  const { lspent, spent, mspent } = useSpent()

  return (
    <Header>
      {lbudget ? (
        <h1>Loading...</h1>
      ) : budget?.length === 0 || newbudget ? (
        <NewBudget mbudget={mbudget} newbudget={newbudget} setNewbudget={setNewbudget} />
      ) : (
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }}
          m={2}
          gap={2}
        >
          <GridItem w={{ base: "100%", "2xl": "80%" }} margin="0 auto">
            <InfoCard
              budget={budget}
              mbudget={mbudget}
              mspent={mspent}
              setNewbudget={setNewbudget}
            />
          </GridItem>
          <GridItem w="100%">
            <Stack>
              <InfoBills spent={spent} mspent={mspent} mbudget={mbudget} />
            </Stack>
          </GridItem>
        </Grid>
      )}
    </Header>
  )
}

export default Home
