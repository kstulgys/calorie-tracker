import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    data: { email, password },
  } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (user && bcrypt.compareSync(password, user.password)) {
      delete user.password

      const token = jwt.sign({ ...user, time: Date.now() }, process.env.JWT_SECRET, { expiresIn: '1d' })

      res.setHeader(
        'Set-Cookie',
        cookie.serialize('APP_ACCESS_TOKEN', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60,
          path: '/',
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
        })
      )
      res.status(200).json(user)
    } else {
      res.status(401).json({ error: 'Email or Password is wrong' })
      return
    }
  } catch (error) {
    res.status(401).json(error)
    return
  }
}
