import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { validateApiRoute } from '../../../lib/validateApiRoute'

const allowedMethods = { GET: true, PUT: true, DELETE: true }
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!allowedMethods[req.method]) {
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }

  const { entryId } = req.query

  try {
    if (req.method === 'GET') {
      const entry = await prisma.entry.findFirst({
        where: { id: String(entryId) },
      })
      res.status(200).json(entry)
      return
    }

    if (req.method === 'PUT') {
      const {
        data: { createdAt, updatedAt, ...rest },
      } = req.body
      const entry = await prisma.entry.update({
        where: { id: String(entryId) },
        data: { ...rest, updatedAt: new Date(updatedAt) },
      })
      res.status(200).json(entry)
      return
    }

    if (req.method === 'DELETE') {
      const entry = await prisma.entry.delete({
        where: { id: String(entryId) },
      })
      res.status(200).json(entry)
      return
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default validateApiRoute(handler)
