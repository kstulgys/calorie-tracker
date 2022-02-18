import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import prisma from './prisma'

export function validateApiRoute(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.APP_ACCESS_TOKEN
    let user

    if (token) {
      try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET)
        user = await prisma.user.findUnique({ where: { id } })
        if (!user) throw new Error('User not found')
      } catch (error) {
        res.status(401).json({ error: 'Not Authorized' })
        return
      }

      delete user.password
      req.body.user = user
      return handler(req, res)
    }
    res.status(401).json({ error: 'User not found' })
  }
}
