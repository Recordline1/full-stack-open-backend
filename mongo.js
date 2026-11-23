if (process.env.NODE_ENV !== 'production') {
  require('node:dns').setServers(['1.1.1.1', '8.8.8.8'])
}

const mongoose = require('mongoose')
const Person = require('./models/person')


if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]



if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  }
  )
} else if (process.argv.length === 5) {
  const person = new Person({
    name,
    number,
  })

  person.save().then(response => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('usage: node mongo.js <password> [<name> <number>]')
  mongoose.connection.close()
}


