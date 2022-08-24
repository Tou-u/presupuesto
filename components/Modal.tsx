import type { NextComponentType, NextPageContext } from "next"
import { FormEvent, useRef, useState } from "react"
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  ModalFooter,
  Button,
  Text,
  Center,
} from "@chakra-ui/react"
import { Budget, Spent } from "@prisma/client"
import axios from "axios"
import { KeyedMutator } from "swr"

interface Props {
  isOpen: boolean
  onClose: () => void
  data: Budget
  mbudget: KeyedMutator<Budget[]>
  mspent: KeyedMutator<Spent[]>
}

const Modal: NextComponentType<NextPageContext, {}, Props> = ({
  isOpen,
  onClose,
  data,
  mbudget,
  mspent,
}: Props) => {
  const [apierror, setApierror] = useState("")

  const name = useRef<HTMLInputElement>(null)
  const amount = useRef<HTMLInputElement>(null)
  const category = useRef<HTMLSelectElement>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (name.current?.value.trim() === "" || category.current?.value.trim() === "") {
      setApierror("Faltan campos por completar")
      return
    }

    if (!amount.current?.value) {
      setApierror("Ingresa una cantidad")
      return
    }

    const res = await axios.post("/api/spent", {
      name: name.current?.value,
      amount: amount.current?.value || 0,
      category: category.current?.value,
      budgetId: data.id,
    })

    if (res.status === 200) {
      mbudget()
      mspent()
      setApierror("")
      onClose()
    }
  }

  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} initialFocusRef={name} isCentered>
      <ModalOverlay w="full" h="full" />
      <ModalContent margin={1}>
        <ModalHeader fontSize="2xl" textAlign="center">
          Nuevo Gasto
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack>
              <Input ref={name} placeholder="Nombre del gasto" />
              <InputGroup>
                <Input ref={amount} placeholder="Cantidad a gastar" type="number" />
                <InputRightAddon children="$" />
              </InputGroup>
              <Select ref={category} placeholder="Selecciona una categoría">
                <option value="ahorro">Ahorro</option>
                <option value="comida">Comida</option>
                <option value="casa">Casa</option>
                <option value="gastos varios">Gastos varios</option>
                <option value="ocio">Ocio</option>
                <option value="salud">Salud</option>
                <option value="suscripciones">Suscripciones</option>
              </Select>
              <Text fontWeight="bold" color="red.500">
                {apierror}
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" colorScheme="blue">
              Guardar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </ChakraModal>
  )
}

export default Modal
