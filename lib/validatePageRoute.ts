import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import prisma from './prisma'

function redirectTo(res: NextApiResponse, path: string) {
  res.setHeader('location', path)
  res.statusCode = 302
  res.end()
}

export async function validatePageRoute(req: NextApiRequest, res: NextApiResponse, resolvedUrl: string) {
  const token = req.cookies.APP_ACCESS_TOKEN
  if (!token) {
    redirectTo(res, '/login')
  } else {
    const { id } = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) redirectTo(res, '/login')
    if (user.role === 'USER' && resolvedUrl === '/admin') redirectTo(res, '/')
    if (user.role === 'ADMIN' && resolvedUrl === '/') redirectTo(res, '/admin')
  }
}
