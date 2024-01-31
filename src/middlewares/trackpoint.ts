import { v4 as uuidv4 } from 'uuid'

import { initialRequiredData } from 'constants/trackpoint'
import type { NextRequest, NextResponse } from 'next/server'

export function trackpointMiddleware(request: NextRequest, response: NextResponse) {
  const userUUID = request.cookies.get(initialRequiredData.userUUID)

  if (!userUUID) {
    response.cookies.set(initialRequiredData.userUUID, uuidv4())
  }

  return response
}
