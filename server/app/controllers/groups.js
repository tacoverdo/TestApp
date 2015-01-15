/**
 * Created by theotheu on 24-12-13.
 */

var mongoose = require('mongoose')
    , Group = mongoose.model('Group');

// CREATE
// save @ http://mongoosejs.com/docs/api.html#model_Model-save
exports.create = function (req, res) {

    // Encrypt password
    console.log('CREATE group.');

    var doc = new Group(req.body);

    console.log(doc);

    doc.save(function (err) {

        var retObj = {
            meta: {"action": "create", 'timestamp': new Date(), filename: __filename},
            doc: doc,
            err: err
        };
        console.log('Result ---', retObj);
        return res.send(retObj);
    });

}

// RETRIEVE
// find @ http://mongoosejs.com/docs/api.html#model_Model.find
exports.list = function (req, res) {
    var conditions, fields, options;

    console.log('GET groups.');

    // You can only see the groups you have created. (Not the groups you are member of)
    conditions = {};
    fields = {};
    sort = {'modificationDate': -1};

    Group
        .find(conditions, fields, options)
        .sort(sort)
        .exec(function (err, doc) {
            var retObj = {
                meta: {"action": "list", 'timestamp': new Date(), filename: __filename},
                doc: doc,
                err: err
            };
            return res.send(retObj);
        })
}

exports.detail = function (req, res) {
    var conditions, fields, options;

    console.log('GET 1 group. ' + req.params._id);

    conditions = req.params._id
        , fields = {}
        , options = {'createdAt': -1};

    /** TODO: Replace "find" with "findById". Tip: you have to change the conditions as well.
     *  @see http://mongoosejs.com/docs/api.html#model_Model.findById
     */
    Group
        .findById(conditions, fields, options)
        .exec(function (err, doc) {
            var retObj = {
                meta: {"action": "detail", 'timestamp': new Date(), filename: __filename},
                doc: doc,
                err: err
            };
            return res.send(retObj);
        })
}

// UPDATE
// findOneAndUpdate @ http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
exports.update = function (req, res) {

    console.log('UPDATE group.');

    // Make sure that password is hashed.

    var conditions = req.params._id
        , update = {
            name: req.body.name,
            description: req.body.description || '',
            modificationDate: Date.now()
        }
        , options = {}
        , callback = function (err, doc) {

            // Like to see the updated document.
            // We de a nested findOne
            Group
            var retObj = {
                meta: {"action": "update", 'timestamp': new Date(), filename: __filename},
                doc: doc,
                err: err
            };
            return res.send(retObj);

        }

    Group
        .findByIdAndUpdate(conditions, update, options, callback);
}

// DELETE
// remove @ http://mongoosejs.com/docs/api.html#model_Model-remove
exports.delete = function (req, res) {
    var conditions, callback, retObj;

    console.log('Deleting group with name. ', req.params.name);

    conditions = {_id: req.params._id}
        , callback = function (err, doc) {
        retObj = {
            meta: {"action": "delete", 'timestamp': new Date(), filename: __filename},
            doc: doc,
            err: err
        };
        return res.send(retObj);
    }

    Group
        .remove(conditions, callback);
}
