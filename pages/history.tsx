import {
  Button,
  Center,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Link,
} from "@chakra-ui/react"
import useBudget from "hooks/useBudget"
import type { NextPage } from "next"
import NextLink from "next/link"
import { useRouter } from "next/router"

const History: NextPage = () => {
  const { lbudget, budget, mbudget } = useBudget()
  const router = useRouter()

  const goToBudget = (id: string) => {
    router.push(`/budget/${id}`)
  }

  return (
    <Center mt={6} display="flex" flexDir="column">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Presupuesto</Th>
              <Th>Fecha creación</Th>
              <Th>Acción</Th>
            </Tr>
          </Thead>
          <Tbody>
            {budget?.map((b) => (
              <Tr key={b.id}>
                <Td>{b.amount.toLocaleString("es-CL", { currency: "CLP" })}</Td>
                <Td>
                  {new Date(b.date).toLocaleString("es-MX", {
                    timeZone: "America/Santiago",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </Td>
                <Td>
                  <Button
                    bgColor="blue.400"
                    fontSize={"small"}
                    boxShadow={
                      "0px 1px 10px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                    }
                    _hover={{
                      bg: "blue.500",
                    }}
                    _focus={{
                      bg: "blue.500",
                    }}
                    fontWeight="bold"
                    size="xs"
                    px={4}
                    onClick={() => goToBudget(b.id)}
                  >
                    Ver
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <NextLink href="/" passHref>
        <Link mt={5}>Volver</Link>
      </NextLink>
    </Center>
  )
}

export default History
