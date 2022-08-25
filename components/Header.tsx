import { Box } from "@chakra-ui/react"
import type { NextComponentType, NextPageContext } from "next"
import { signOut, useSession } from "next-auth/react"
import Head from "next/head"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const Header: NextComponentType<NextPageContext, {}, Props> = ({ children }: Props) => {
  const { data: session } = useSession()

  return (
    <>
      <Head>
        <title>Organiza tu presupuesto</title>
      </Head>
      {/* <nav>
        <ul>
          <li>{session?.user.name}</li>
          <button onClick={() => signOut()}>Cerrar Sesión</button>
        </ul>
      </nav> */}

      {children}
    </>
  )
}

export default Header
