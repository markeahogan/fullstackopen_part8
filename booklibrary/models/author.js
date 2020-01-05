const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = mongoose.Schema({
    name:{type:String, required:true},
    born:Number
});

schema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

schema.plugin(uniqueValidator);

const Author = mongoose.model('Author', schema);
module.exports = Author;