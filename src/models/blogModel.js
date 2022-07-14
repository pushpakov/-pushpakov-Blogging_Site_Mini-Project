/*------------------------------------------Import Modules:-------------------------------------------*/
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


/*------------------------------------------Blog Schema:-------------------------------------------*/
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    authorId: {
        type: ObjectId,
        required: true,
        ref: "author",
        trim: true
    },
    tags: {
        type: [String],
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    subcategory: {
        type: [String],
        trim: true
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        trim: true
    },
    publishedAt: {
        type: Date,
        default: null,
        
    },
    isPublished: {
        type: Boolean,
        default: false,
       
    },

}, { timestamps: true });


/*------------------------------------------Export Module:-------------------------------------------*/
module.exports = mongoose.model('blog', blogSchema)

