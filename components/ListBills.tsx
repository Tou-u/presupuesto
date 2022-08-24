import type { NextComponentType, NextPageContext } from "next"
import { Center, Stack, VStack, Text } from "@chakra-ui/react"
import { Spent } from "@prisma/client"

interface Props {
  spent: Spent
}

const ListBills: NextComponentType<NextPageContext, {}, Props> = ({ spent }: Props) => {
  return (
    <Center>
      <Stack
        borderWidth="1px"
        borderRadius="lg"
        direction="row"
        bg="gray.900"
        boxShadow={"2xl"}
        padding={4}
        justifyContent="space-between"
        w="100%"
        px={{ base: 3, md: 10 }}
      >
        <VStack alignItems="start" whiteSpace="nowrap" overflow="hidden">
          <Text fontSize="md" textTransform="uppercase" fontWeight="bold">
            {spent.category}
          </Text>
          <Text fontSize="2xl" fontWeight="bold" textTransform="capitalize">
            {spent.name}
          </Text>
          <Text display="flex" as="p" fontWeight="bold">
            Agregado el:
            <Text as="span" fontWeight="normal" ml={1}>
              {new Date(spent.date).toLocaleString("es-MX", {
                timeZone: "America/Santiago",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </Text>
        </VStack>
        <VStack justifyContent="center">
          <Text fontSize="4xl" fontWeight="bold">
            ${spent.amount.toLocaleString("es-CL", { currency: "CLP" })}
          </Text>
        </VStack>
      </Stack>
    </Center>
  )
}

export default ListBills
