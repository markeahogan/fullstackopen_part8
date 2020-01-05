const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = mongoose.Schema({
    title:{type:String, required:true},
    published:{type:Number, required:true},
    author:{type: mongoose.Schema.Types.ObjectId, ref: 'Author'},
    genres:[String]
});

schema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
});

schema.plugin(uniqueValidator);

const Book = mongoose.model('Book', schema);
module.exports = Book;