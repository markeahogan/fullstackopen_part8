const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = mongoose.Schema({
    username:{ type:String, required:true, unique:true, minlength:3 },
    favoriteGenre: String
});

schema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

schema.plugin(uniqueValidator);

const BookUser = mongoose.model('BookUser', schema);

module.exports = BookUser;