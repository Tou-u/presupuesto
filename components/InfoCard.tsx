import type { NextComponentType, NextPageContext } from "next"
import { Budget, Spent } from "@prisma/client"
import {
  Center,
  Stack,
  CircularProgress,
  CircularProgressLabel,
  Heading,
  Button,
  Box,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import Modal from "./Modal"
import { KeyedMutator } from "swr"

interface Props {
  budget?: Budget[]
  mbudget: KeyedMutator<Budget[]>
  mspent: KeyedMutator<Spent[]>
}

const InfoCard: NextComponentType<NextPageContext, {}, Props> = ({
  budget,
  mbudget,
  mspent,
}: Props) => {
  const data = budget?.[0]!
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Center py={6} alignItems="start">
      <Stack
        borderWidth="1px"
        borderRadius="lg"
        height={{ sm: "476px", md: "20rem" }}
        direction={{ base: "column", md: "row" }}
        bg="gray.900"
        boxShadow={"2xl"}
        padding={4}
        alignItems="center"
        width="100%"
      >
        <Box>
          <CircularProgress
            value={(data.taken / data.amount) * 100}
            size="250px"
            thickness="7px"
          >
            <CircularProgressLabel>
              <Text fontSize="5xl">
                {Math.round((data.taken / data.amount) * 100) > 100
                  ? 100
                  : Math.round((data.taken / data.amount) * 100)}
                %
              </Text>
              <Text fontSize="3xl">Gastado</Text>
            </CircularProgressLabel>
          </CircularProgress>
        </Box>

        <Stack flex={1} flexDirection="column" p={1} pt={2}>
          <Heading
            fontSize={"2xl"}
            fontFamily={"body"}
            display="flex"
            justifyContent="space-between"
          >
            Presupuesto:
            <Text ml={5}>
              ${data.amount.toLocaleString("es-CL", { currency: "CLP" })}
            </Text>
          </Heading>
          <Heading
            fontSize={"2xl"}
            fontFamily={"body"}
            display="flex"
            justifyContent="space-between"
          >
            Disponible:
            <Text
              ml={5}
              color={data.amount - data.taken < 0 ? "red.500" : "whiteAlpha.900"}
            >
              ${(data.amount - data.taken).toLocaleString("es-CL", { currency: "CLP" })}
            </Text>
          </Heading>
          <Heading
            fontSize={"2xl"}
            fontFamily={"body"}
            display="flex"
            justifyContent="space-between"
          >
            Gastado:
            <Text ml={5}>${data.taken.toLocaleString("es-CL", { currency: "CLP" })}</Text>
          </Heading>
          <Stack
            width={"100%"}
            mt={"2rem"}
            direction={"row"}
            padding={2}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Button
              mt={3}
              flex={1}
              fontSize={"sm"}
              rounded={"full"}
              bg={"blue.400"}
              color={"white"}
              boxShadow={
                "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
              }
              _hover={{
                bg: "blue.500",
              }}
              _focus={{
                bg: "blue.500",
              }}
              onClick={onOpen}
            >
              + Nuevo gasto
            </Button>
            <Modal
              isOpen={isOpen}
              onClose={onClose}
              data={data}
              mbudget={mbudget}
              mspent={mspent}
            />
          </Stack>
        </Stack>
      </Stack>
    </Center>
  )
}

export default InfoCard
