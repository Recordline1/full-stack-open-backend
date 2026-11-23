require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const Persons = require('./models/person');
const app = express();
app.use(express.json());
app.use(express.static('dist'))


morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (req, res) => {
    Persons.find({}).then(persons => {
        res.json(persons)
    })
})
app.get('/api/info', (req, res) => {

    const date = new Date()
    res.send(`
        <p>Phonebook has info for ${Persons.length} people</p>
        <p>${date}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
   Persons.findById(req.params.id)
   .then(person => {
       if (person) {
           res.json(person)
       } else {
              res.status(404).end()
       }    
})
})


app.post('/api/persons', (req, res) => {
    const body = req.body
    const existingPerson = Persons.find(p => p.name === body.name)
    if (existingPerson) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name and number are required' })
    }
    if (Persons.find(p => p.name === body.name)) {
        return res.status(400).json({ error: 'name must be unique' })
    }

    const person = new Persons({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})


app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)
    if (!person) {
        return res.status(404)
            .json({ error: `Person with id ${id} not found` })
    }
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()

})
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Example app listening on http://localhost:${PORT}/api/persons`);
});