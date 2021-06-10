const { resetStubs } = require('../mockApis/wiremock')

module.exports = on => {
  on('task', {
    reset: resetStubs,
  })
}
