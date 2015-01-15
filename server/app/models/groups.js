/**
 * Created by theotheu on 24-12-13.
 */
/**
 * Module dependencies.
 */
var mongoose;
mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/* Sub Schema definitions */
/* Sub-documents are docs with schemas of their own which are elements of a parents document array
 @see http://mongoosejs.com/docs/subdocs.html

 Nested documents differ from sub-documents by the fact that they can be defined with the schema and are not within in array.
 */
var userSchema = Schema({
    _id: {type: Schema.Types.ObjectId, ref: "User"}
});

/* Schema definitions */
// Schema types @see http://mongoosejs.com/docs/schematypes.html
var schemaName = Schema({
    name: {type: String, required: true},
    description: {type: String},
    users: [userSchema], // <------------------------ sub document
    meta: {}, // anything goes
    modificationDate: {type: Date, "default": Date.now}
});
schemaName.index({name: 1, createdBy: 1}, {unique: true});


/* Custom server side validators
 * @see http://mongoosejs.com/docs/api.html#document_Document-validate
 * @see http://mongoosejs.com/docs/api.html#schematype_SchemaType-validate
 * @see http://mongoosejs.com/docs/2.7.x/docs/validation.html
 *
 * if validation fails, then return false || if validation succeeds, then return true
 *
 * */
schemaName.path('name').validate(function (val) {
    return (val !== undefined && val !== null && val.length >= 3);
}, 'Invalid name');


/*
 If collectionName is absent as third argument, than the modelName should always end with an -s.
 Mongoose pluralizes the model name. (This is not documented)
 */
var modelName = "Group";
var collectionName = "groups"; // Naming convention is plural.
mongoose.model(modelName, schemaName, collectionName)
    .ensureIndexes({name: 1, createdBy: 1}, {unique: true});