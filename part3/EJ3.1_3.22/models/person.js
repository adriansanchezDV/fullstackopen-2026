const mongoose = require('mongoose')
const phoneRegex = /^\d{2,3}-\d{5,8}$/

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return phoneRegex.test(v)
      },
      message: props =>
        `${props.value} is not a valid phone number. Use format XX-XXXXXXX or XXX-XXXXXXXX`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)