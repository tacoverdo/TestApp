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
var groupSchema = Schema({
    _id: {type: Schema.Types.ObjectId, ref: "Group"}
});

/* Schema definitions */
// Schema types @see http://mongoosejs.com/docs/schematypes.html
var schemaName = Schema({
    gender: {type: String},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: {type: String},
    description: {type: String},
    picture: {type: String},
    location: { // <--------------- nested document
        street: {type: String},
        city: {type: String},
        state: {type: String},
        zip: {type: String}
    },
    groups: [groupSchema], // <----- sub document
    meta: {}, // anything goes
    modificationDate: {type: Date, "default": Date.now}
});

/* Custom server side validators
 * @see http://mongoosejs.com/docs/api.html#document_Document-validate
 * @see http://mongoosejs.com/docs/api.html#schematype_SchemaType-validate
 * @see http://mongoosejs.com/docs/2.7.x/docs/validation.html
 *
 * if validation fails, then return false || if validation succeeds, then return true
 *
 * */
schemaName.path('name').validate(function (val) {
    return (val !== undefined && val !== null && val.length >= 8);
}, 'Invalid name');

schemaName.path('email').validate(function (val) {
    // Some awful regular expression. Note that you should not use regular expressions for validating email addresses.
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(val);
}, 'Invalid email');


/*
 If collectionName is absent as third argument, than the modelName should always end with an -s.
 Mongoose pluralizes the model name. (This is not documented)
 */
var modelName = "User";
var collectionName = "users"; // Naming convention is plural.
mongoose.model(modelName, schemaName, collectionName);

