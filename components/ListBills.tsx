import type { NextComponentType, NextPageContext } from "next"
import { Center, Stack, VStack, Text, Flex, Button } from "@chakra-ui/react"
import { Budget, Spent } from "@prisma/client"
import axios from "axios"
import { KeyedMutator } from "swr"
import { useState } from "react"
import EditBill from "./EditBill"

interface Props {
  spent: Spent
  mspent: KeyedMutator<Spent[]>
  mbudget: KeyedMutator<Budget[]>
}

const ListBills: NextComponentType<NextPageContext, {}, Props> = ({
  spent,
  mspent,
  mbudget,
}: Props) => {
  const [editmode, setEditmode] = useState(false)

  const deleteBill = async () => {
    const res = await axios.delete("/api/spent/", {
      data: {
        id: spent.id,
      },
    })

    if (res.status === 200) {
      mspent()
      mbudget()
    }
  }

  const editBill = () => {
    setEditmode(true)
  }

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
        {editmode ? (
          <EditBill
            spent={spent}
            setEditmode={setEditmode}
            mbudget={mbudget}
            mspent={mspent}
          />
        ) : (
          <>
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

            <VStack justifyContent="center" alignItems="end">
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
                  onClick={editBill}
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
                  onClick={deleteBill}
                >
                  Eliminar
                </Button>
              </Flex>
              <Text fontSize="4xl" fontWeight="bold">
                ${spent.amount.toLocaleString("es-CL", { currency: "CLP" })}
              </Text>
            </VStack>
          </>
        )}
      </Stack>
    </Center>
  )
}

export default ListBills
