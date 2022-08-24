import type { NextComponentType, NextPageContext } from "next"
import {
  Button,
  Center,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
  Text,
} from "@chakra-ui/react"
import { FormEvent, useRef, useState } from "react"
import axios from "axios"
import { KeyedMutator } from "swr"
import { Budget } from "@prisma/client"

interface Props {
  mbudget: KeyedMutator<Budget[]>
}

const NewBudget: NextComponentType<NextPageContext, {}, Props> = ({ mbudget }: Props) => {
  const [apierror, setApierror] = useState("")
  const [btnloading, setBtnloading] = useState(false)
  const amount = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!amount.current?.value) {
      setApierror("Ingresa una cantidad")
      return
    }

    setBtnloading(true)

    const res = await axios.post("/api/budget", {
      amount: amount.current?.value || 0,
    })

    if (res.status === 200) {
      await mbudget()
      setBtnloading(false)
    }
  }

  return (
    <Center mt={20}>
      <form onSubmit={handleSubmit}>
        <Stack>
          <Text textAlign="center" fontSize="2xl" mb={3}>
            Comienza añadiendo un presupuesto
          </Text>
          <InputGroup>
            <Input
              ref={amount}
              fontSize="2xl"
              placeholder="100000"
              type="number"
              mb={3}
            />
            <InputRightAddon children="$" mb={3} />
          </InputGroup>
          <Button
            type="submit"
            isLoading={btnloading}
            loadingText="Iniciando presupuesto"
          >
            Iniciar presupuesto
          </Button>
          <Text textAlign="center" color="red.400">
            {apierror}
          </Text>
        </Stack>
      </form>
    </Center>
  )
}

export default NewBudget
