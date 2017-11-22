const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const app = express()
const port = parseInt(process.env.PORT || "8080")
const baseUrl = process.env.REPLICATED_INTEGRATIONAPI || `http://localhost:${port}`

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/login', (req, res) => {
  authenticate(req.body)
    .then(apiResponse => res.send(`<!DOCTYPE html>
<html>
<body>
  <h1>Success</h1>
  <pre>${escapeHtml(JSON.stringify(apiResponse, null, 2))}</pre>
</body>
</html>`))
    .catch(err => res.send(`<!DOCTYPE html>
<html>
<body>
  <h1>Error</h1>
  <pre>${escapeHtml(err.message)}</pre>
</body>
</html>`))
})

app.post('/identity/v1/login', (req, res) => res.status(500).send(`Didn't try to log in ${req.body.username} in LDAP.
REPLICATED_INTEGRATIONAPI is not configured
`))

async function authenticate({ username, password }) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }
  const url = `${baseUrl}/identity/v1/login`
  const res = await fetch(url, options)

  if (res.status === 200) {
    return res.json()
  }
  if (res.status === 401) {
    throw new Error('Authentication failed')
  }
  throw new Error(`POST ${url} - ${res.status}\n${await res.text()}`)
}

app.listen(port)

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
 }
