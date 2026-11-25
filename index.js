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

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body

    Persons.findById(req.params.id)
        .then(person => {
            if (!person) {
                return res.status(404).send({ error: 'Person not found' })
            }
            person.name = name
            person.number = number

            return person.save()
                .then(updatedPerson => res.json(updatedPerson))

        }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Persons.findByIdAndDelete(id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))

})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Example app listening on http://localhost:${PORT}/api/persons`);
});