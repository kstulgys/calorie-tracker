import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { validateApiRoute } from '../../../lib/validateApiRoute'

const allowedMethods = { GET: true, POST: true }
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowedMethods[req.method]) {
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }

  const { user } = req.body

  try {
    if (req.method === 'GET') {
      const { gte, lt } = req.query

      if (user.role === 'ADMIN') {
        const entries = await prisma.entry.findMany({
          orderBy: { createdAt: 'desc' },
          where: {
            createdAt: {
              gte: gte ? new Date(gte as string) : new Date(),
              lt: lt ? new Date(lt as string) : new Date(),
            },
          },
        })
        res.status(200).json(entries)
        return
      }

      const entries = await prisma.entry.findMany({
        orderBy: { createdAt: 'desc' },
        where: {
          createdAt: {
            gte: gte ? new Date(gte as string) : new Date(),
            lt: lt ? new Date(lt as string) : new Date(),
          },
          User: { id: user.id },
        },
      })
      res.status(200).json(entries)
      return
    }

    if (req.method === 'POST') {
      const {
        data: { createdAt, ...rest },
      } = req.body
      const entry = await prisma.entry.create({
        data: {
          ...rest,
          createdAt: new Date(createdAt),
          User: { connect: { id: user.id } },
        },
      })
      res.status(200).json(entry)
      return
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

export default validateApiRoute(handler)
