import { NextResponse } from 'next/server'
import { trackpointMiddleware } from 'middlewares/trackpoint'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  try {
    response = trackpointMiddleware(request, response)
  } catch (error) {
    console.error(error)
  }

  return response
}

// Skip for static assets in the /_next folder
export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)'
}
