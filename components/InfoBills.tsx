import type { NextComponentType, NextPageContext } from "next"
import { Spent } from "@prisma/client"
import { Center, Stack, Select, Text, Box, Container } from "@chakra-ui/react"
import ListBills from "./ListBills"

interface Props {
  spent?: Spent[]
}

const InfoBills: NextComponentType<NextPageContext, {}, Props> = ({ spent }: Props) => {
  return (
    <>
      <Center _first={{ paddingTop: 6 }}>
        <Stack
          borderWidth="1px"
          borderRadius="lg"
          direction={{ base: "column", md: "row" }}
          bg="gray.900"
          boxShadow={"2xl"}
          padding={4}
          w="100%"
          px={{ base: 3, md: 10 }}
        >
          <Text
            fontSize="3xl"
            fontWeight="bold"
            textAlign={{ base: "center", md: "start" }}
            whiteSpace="nowrap"
          >
            Filtrar Gastos
          </Text>
          <Select w="100%" placeholder="Selecciona una categoría" pl={{ base: 0, md: 5 }}>
            <option value="ahorro">Ahorro</option>
            <option value="comida">Comida</option>
            <option value="casa">Casa</option>
            <option value="gastos varios">Gastos varios</option>
            <option value="ocio">Ocio</option>
            <option value="salud">Salud</option>
            <option value="suscripciones">Suscripciones</option>
          </Select>
        </Stack>
      </Center>
      <Stack overflow="hidden" overflowY="scroll" maxH="80vh" width="100%">
        {spent?.map((spent) => (
          <ListBills key={spent.id} spent={spent} />
        ))}
      </Stack>
    </>
  )
}

export default InfoBills
