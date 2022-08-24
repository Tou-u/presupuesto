import withAuth from "next-auth/middleware"

export default withAuth((req) => {})

export const config = { matcher: ["/"] }
