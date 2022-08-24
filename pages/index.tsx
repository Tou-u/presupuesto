import type { NextPage } from "next"
import NewBudget from "components/NewBudget"
import InfoCard from "components/InfoCard"
import InfoBills from "components/InfoBills"
import Header from "components/Header"
import useBudget from "hooks/useBudget"
import useSpent from "hooks/useSpent"
import { Stack, Grid, GridItem } from "@chakra-ui/react"

const Home: NextPage = () => {
  const { lbudget, budget, mbudget } = useBudget()
  const { lspent, spent, mspent } = useSpent()

  return (
    <Header>
      <Grid>
        {lbudget ? (
          <h1>Loading...</h1>
        ) : budget?.length === 0 ? (
          <GridItem w="100%">
            <NewBudget mbudget={mbudget} />
          </GridItem>
        ) : (
          <GridItem w="100%">
            <Stack
              justifyContent="space-around"
              direction={{ base: "column", md: "row" }}
            >
              <InfoCard budget={budget} mbudget={mbudget} mspent={mspent} />
              <Stack width={{ base: "100%", md: "60%" }}>
                <InfoBills spent={spent} />
              </Stack>
            </Stack>
          </GridItem>
        )}
      </Grid>
    </Header>
  )
}

export default Home
