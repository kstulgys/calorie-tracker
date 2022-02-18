import chance from 'chance'
const c = chance()

let firstEntryName = c.animal()
let first = false
function createEntry() {
  cy.get('button').contains('+').click()
  cy.get('[id=name]').type(!first ? firstEntryName : c.animal())
  cy.get('[id=calories]')
    .clear()
    .type(c.natural({ min: 200, max: 1000 }))
  cy.get('[id=price]')
    .clear()
    .type(c.natural({ min: 10, max: 20 }))
  cy.get('button').contains('Submit').click()
  first = true
}

function updateEntry() {
  cy.get('button').contains(firstEntryName).click()
  cy.get('[id=name]').clear().type(c.animal())
  cy.get('[id=calories]')
    .clear()
    .type(c.natural({ min: 200, max: 1000 }))
  cy.get('[id=price]')
    .clear()
    .type(c.natural({ min: 10, max: 20 }))
  cy.get('button').contains('Submit').click()
}

describe('App', () => {
  it('should navigate to the about page', () => {
    cy.visit('/')
    // Login
    let email = 'user@test.com'
    let password = 'password'
    cy.get('p').contains('Sign in').should('exist')
    cy.get('[id=email]').type(email)
    cy.get('[id=password]').type(password)
    cy.get('button').contains('Sign in').click()
    cy.wait(3000)

    /**
     * Add item
     */
    createEntry()
    createEntry()

    /**
     * Update Item
     */
    updateEntry()
    cy.wait(2000)

    /**
     *  Update Settings
     */
    cy.get('button').contains('⚙️').click()
    cy.wait(2000)
    cy.get('[id="calorie"]')
      .clear()
      .type(c.natural({ min: 900, max: 2500 }))
    cy.get('[id="budget"]')
      .clear()
      .type(c.natural({ min: 900, max: 1100 }))
    cy.get('button').contains('Submit').click()

    /**
     *  Navigate next, prev
     */
    cy.get('button').contains('→').click()
    cy.wait(3000)
    cy.get('button').contains('←').click()
    cy.wait(3000)
    cy.get('button').contains('←').click()
    cy.wait(3000)
    cy.get('button').contains('←').click()
    cy.wait(3000)

    /**
     *  Select from to date
     */
    cy.get('[type="date"]').first().type('2022-01-01')
    cy.wait(3000)
    cy.get('[type="date"]').last().type('2022-02-02')
    cy.wait(5000)
    cy.get('[data-test="list"]').scrollTo('bottom', { duration: 2000, easing: 'swing' })
    cy.wait(2000)
    cy.visit('/login')

    email = 'admin@test.com'
    password = 'secret'
    cy.get('p').contains('Sign in').should('exist')
    cy.get('[id=email]').type(email)
    cy.get('[id=password]').type(password)
    cy.get('button').contains('Sign in').click()
    cy.wait(3000)
    cy.get('[type="date"]').last().type('2022-02-07')
    cy.wait(3000)
    cy.get('[type="date"]').first().type('2022-02-01')
    cy.wait(7000)
    cy.get('[data-test="list-item"]').first().click()
    cy.get('[id=name]').clear().type(c.animal())
    cy.get('[id=calories]')
      .clear()
      .type(c.natural({ min: 200, max: 1000 }))
    cy.get('[id=price]')
      .clear()
      .type(c.natural({ min: 10, max: 20 }))
    cy.get('button').contains('Submit').click()
    cy.wait(3000)
    cy.get('[data-test="list"]').scrollTo('bottom', { duration: 2000, easing: 'swing' })
  })
})
