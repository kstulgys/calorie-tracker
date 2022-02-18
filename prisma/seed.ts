import chance from 'chance'
import bcrypt from 'bcrypt'
import prisma from '../lib/prisma'

const c = chance()

function addDaysToDate(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}

function addHoursToDate(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000)
}

function generateEntries() {
  let count = 0
  const entries = []
  let pastDays = 1
  const d = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 8, 0, 0)
  while (count < 100) {
    let createdAt = addDaysToDate(d, -pastDays)
    pastDays++
    const row = [...Array(4)]
    row.forEach(() => {
      entries.push({
        createdAt,
        name: c.animal(),
        price: c.natural({ min: 10, max: 20 }),
        calories: c.natural({ min: 200, max: 1000 }),
      })
      createdAt = addHoursToDate(createdAt, 4)
      count++
    })
  }
  return entries
}

async function createUserWithEntries({ role, email, password }) {
  const salt = bcrypt.genSaltSync()
  return await prisma.user.create({
    data: {
      role,
      email,
      password: bcrypt.hashSync(password, salt),
      entries: {
        create: generateEntries(),
      },
    },
  })
}

async function seed() {
  return await Promise.all([
    createUserWithEntries({ role: 'USER', email: 'user@test.com', password: 'password' }),
    createUserWithEntries({ role: 'USER', email: 'user1@test.com', password: 'password1' }),
    createUserWithEntries({ role: 'USER', email: 'user2@test.com', password: 'password2' }),
    createUserWithEntries({ role: 'ADMIN', email: 'admin@test.com', password: 'secret' }),
  ])
}

seed()
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
