if (process.env.NODE_ENV !== 'production') {
  require('node:dns').setServers(['1.1.1.1', '8.8.8.8'])
}

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://firstuser:${password}@cluster0.raufk7c.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

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


