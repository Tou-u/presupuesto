import type { NextComponentType, NextPageContext } from "next"
import { Center, Stack, VStack, Text, Flex, Button } from "@chakra-ui/react"
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
        <VStack alignItems="start">
          <Text fontSize="md" textTransform="uppercase" fontWeight="bold">
            {spent.category}
          </Text>
          <Text fontSize="2xl" fontWeight="bold" textTransform="capitalize">
            {spent.name}
          </Text>

          <Text as="span" fontWeight="normal" ml={1}>
            {new Date(spent.date).toLocaleString("es-MX", {
              timeZone: "America/Santiago",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </VStack>
        <VStack justifyContent="center">
          <Flex gap={1}>
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
            >
              Editar
            </Button>
            <Button
              bgColor="red.400"
              fontSize={"small"}
              boxShadow={
                "0px 1px 10px -5px rgb(153 0 0 / 48%), 0 10px 10px -5px rgb(140 0 0 / 43%)"
              }
              _hover={{
                bg: "red.500",
              }}
              _focus={{
                bg: "red.500",
              }}
              fontWeight="bold"
              size="xs"
            >
              Eliminar
            </Button>
          </Flex>
          <Text fontSize="4xl" fontWeight="bold">
            ${spent.amount.toLocaleString("es-CL", { currency: "CLP" })}
          </Text>
        </VStack>
      </Stack>
    </Center>
  )
}

export default ListBills
