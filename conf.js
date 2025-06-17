const key = process.env.NODE_ENV || 'development',
      credentials = require(`./.credentials.${key}`)

module.exports = { credentials }