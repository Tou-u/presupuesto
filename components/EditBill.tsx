import {
  VStack,
  Flex,
  Button,
  Select,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react"
import { Budget, Spent } from "@prisma/client"
import axios from "axios"
import type { NextComponentType, NextPageContext } from "next"
import { Dispatch, FormEvent, SetStateAction, useRef } from "react"
import { KeyedMutator } from "swr"

interface Props {
  spent: Spent
  setEditmode: Dispatch<SetStateAction<boolean>>
  mspent: KeyedMutator<Spent[]>
  mbudget: KeyedMutator<Budget[]>
}

const EditBill: NextComponentType<NextPageContext, {}, Props> = ({
  spent,
  setEditmode,
  mspent,
  mbudget,
}: Props) => {
  const name = useRef<HTMLInputElement>(null)
  const amount = useRef<HTMLInputElement>(null)
  const category = useRef<HTMLSelectElement>(null)

  const cancelEdit = () => {
    setEditmode(false)
  }

  const saveBill = async (e: FormEvent) => {
    e.preventDefault()

    if (name.current?.value.trim() === "" || category.current?.value.trim() === "") return

    if (!amount.current?.value) return

    const res = await axios.put("/api/spent/", {
      id: spent.id,
      name: name.current?.value,
      amount: amount.current?.value || 0,
      category: category.current?.value,
      budgetId: spent.budgetId,
      oldamount: spent.amount,
    })

    if (res.status === 200) {
      mbudget()
      mspent()
      setEditmode(false)
    }
  }

  return (
    <>
      <form onSubmit={saveBill}>
        <VStack alignItems="start" height="100px">
          <Select
            ref={category}
            placeholder="Selecciona una categoría"
            defaultValue={spent.category}
          >
            <option value="ahorro">Ahorro</option>
            <option value="comida">Comida</option>
            <option value="casa">Casa</option>
            <option value="gastos varios">Gastos varios</option>
            <option value="ocio">Ocio</option>
            <option value="salud">Salud</option>
            <option value="suscripciones">Suscripciones</option>
          </Select>
          <Input ref={name} placeholder="Nombre del gasto" defaultValue={spent.name} />
        </VStack>
      </form>
      <form onSubmit={saveBill}>
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
              type="submit"
            >
              Guardar
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
              onClick={cancelEdit}
            >
              Cancelar
            </Button>
          </Flex>
          <InputGroup h="54px" alignItems="center">
            <Input
              ref={amount}
              placeholder="Cantidad a gastar"
              type="number"
              defaultValue={spent.amount}
            />
            <InputRightAddon children="$" />
          </InputGroup>
        </VStack>
      </form>
    </>
  )
}

export default EditBill
