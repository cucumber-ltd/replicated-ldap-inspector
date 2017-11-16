const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const app = express()
const port = parseInt(process.env.PORT || "8080")
const baseUrl = process.env.REPLICATED_INTEGRATIONAPI || `http://localhost:${port}`

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/login', (req, res) => {
  authenticate(req.body)
    .then(apiResponse => res.send(JSON.stringify(apiResponse, null, 2)))
    .catch(err => res.status(500).send(err.message))
})

app.post('/identity/v1/login', (req, res) => res.json({ message: `You (${req.body.username}) need to define the REPLICATED_INTEGRATIONAPI`}))

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
  throw new Error(`POST ${url} - ${res.status} ${await res.text()}`)
}

app.listen(port)
