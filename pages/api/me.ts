import { NextApiRequest, NextApiResponse } from 'next'
import { validateApiRoute } from '../../lib/validateApiRoute'
import prisma from '../../lib/prisma'

const allowedMethods = { GET: true, PUT: true }
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req.body

  if (!allowedMethods[req.method]) {
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }

  try {
    if (req.method === 'GET') {
      res.status(200).json(user)
      return
    }

    if (req.method === 'PUT') {
      const { data } = req.body
      const userUpdated = await prisma.user.update({
        where: { id: user.id },
        data: { ...data },
      })
      res.status(200).json(userUpdated)
      return
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

export default validateApiRoute(handler)
