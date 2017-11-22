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
    .then(response => res.send(html('Response', response)))
    .catch(err => res.send(html('Error', err.message)))
})

app.post('/identity/v1/login', (req, res) => res.status(500).send(`Didn't try to log in ${req.body.username} in LDAP.
REPLICATED_INTEGRATIONAPI is not configured.
`))

async function authenticate({ username, password }) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }
  const url = `${baseUrl}/identity/v1/login`
  const res = await fetch(url, options)
  return curlLikeOutput(res)
}

app.listen(port)

async function curlLikeOutput(res) {
  return `< HTTP /1.1 ${res.status} ${res.statusText}
${headersString(res.headers)}
${await body(res)}`
}

function headersString(headers) {
  let s = ''
  headers.forEach((value, key) => {
    s += `< ${key}: ${value}\n`
  })
  return s
}

async function body(res) {
  if(res.headers.get('Content-Type').indexOf('appliaction/json') === 0) {
    return JSON.stringify(await res.json(), null, 2)
  } else {
    return await res.text()
  }
}

function html(header, body) {
  return `<!DOCTYPE html>
<html>
<body>
<h1>Response</h1>
<pre>${escapeHtml(body)}</pre>
</body>
</html>`
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
 }
