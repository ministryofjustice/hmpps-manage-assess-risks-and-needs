const page = require('./page')

const indexPage = () =>
  page('Assessments', {
    headerUserName: () => cy.get('[data-qa=header-user-name]'),
  })

module.exports = { verifyOnPage: indexPage }
