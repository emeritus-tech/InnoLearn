/* eslint-disable @typescript-eslint/no-var-requires */
const { createServer } = require('http')
const { parse } = require('url')
const fs = require('fs')
const next = require('next')

const dev = process.env.APP_ENV === 'development'
const port = process.env.PORT || 3000
const hostname = process.env.HEROKU_APP_NAME ? `${process.env.HEROKU_APP_NAME}.herokuapp.com` : 'localhost'

const app = next({ dev, port, hostname })

try {
  app.prepare().then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true)
      const handle = app.getRequestHandler()

      handle(req, res, parsedUrl)
    }).listen('/tmp/nginx.socket', (err) => {
      if (err) throw err
      fs.openSync('/tmp/app-initialized', 'w')
      console.log('> NextJS Server running...')
    })
  })
} catch (error) {
  console.log('SERVER ERROR: ', error)
}
