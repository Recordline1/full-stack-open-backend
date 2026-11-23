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
        .chatch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})


app.post('/api/persons', (req, res) => {
    const body = req.body 

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
    Persons.findByIdAndDelete(id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })

})
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Example app listening on http://localhost:${PORT}/api/persons`);
});