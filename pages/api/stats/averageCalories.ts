import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { validateApiRoute } from '../../../lib/validateApiRoute'

const allowedMethods = { GET: true }
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowedMethods[req.method]) {
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }
  const { user } = req.body

  if (user.role !== 'ADMIN') {
    res.status(401).end('Unauthorized')
    return
  }
  try {
    const { gte, lt } = req.query
    const aggregations = await prisma.entry.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: gte ? new Date(gte as string) : new Date(),
          lt: lt ? new Date(lt as string) : new Date(),
        },
      },
      _avg: {
        calories: true,
      },
    })
    res.status(200).json(aggregations)
  } catch (error) {
    res.status(500).json(error)
  }
}

export default validateApiRoute(handler)
