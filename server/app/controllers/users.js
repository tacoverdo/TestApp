/**
 * Created by theotheu on 24-12-13.
 */

var mongoose = require('mongoose')
    , User = mongoose.model('User')
    , Group = mongoose.model('Group')
    , passwordHash = require('password-hash');


// CREATE
// save @ http://mongoosejs.com/docs/api.html#model_Model-save
exports.create = function (req, res) {

    // Encrypt password
    console.log('CREATE user.');

    req.body.password = passwordHash.generate(req.body.password || "topSecret!");

    var doc = new User(req.body);

    doc.save(function (err) {
        var retObj = {
            meta: {"action": "create", 'timestamp': new Date(), filename: __filename},
            doc: doc,
            err: err
        };
        return res.send(retObj);

    });

}

// RETRIEVE
// find @ http://mongoosejs.com/docs/api.html#model_Model.find
exports.list = function (req, res) {
    var conditions, fields, options;

    console.log('GET users.');

    conditions = {};
    fields = {};
    sort = {'modificationDate': -1};

    User
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
    var conditions, fields, options, retDoc, i, j, groupDoc;

    console.log('GET 1 user. ' + req.params._id);

    conditions = req.params._id
        , fields = {}
        , options = {'createdAt': -1};

    User
        .findById(conditions, fields, options)
        .populate("Group")// <------------------ populating sub documents, only for demo, not needed here
        .exec(function (err, doc) {

            var groups = [];
            // Create a array, so that we can compare all groups with existing groups
            if (!doc) {
                doc = {};
                doc.gender = "male";
                doc.picture = "user.png";
            } else if (doc && doc.groups) {
                for (i = 0; i < doc.groups.length; i++) {
                    groups.push(doc.groups[i]._id + "");
                }
            }

            // Find groups for user
            Group
                .find({}, function (err, groupsDoc) {
                    retDoc = [];
                    for (i = 0; i < groupsDoc.length; i++) {
                        groupDoc = {
                            _id: groupsDoc[i]._id,
                            name: groupsDoc[i].name,
                            isMember: false
                        };

                        if (groups.indexOf(groupsDoc[i]._id + "") >= 0) {
                            groupDoc.isMember = true;
                        }
                        retDoc.push(groupDoc);
                    }

                    var retObj = {
                        meta: {"action": "detail", 'timestamp': new Date(), filename: __filename},
                        doc: doc,
                        groups: retDoc,
                        err: err
                    };
                    return res.send(retObj);
                });
        })
}

// Nested callback for $addToSet
function updateGroupsWithUser(err, req, res, groups, doc) {
    var group;

    if (!groups || groups.length === 0) {
        // Return if no array or empty array (consider alternative $pullAll)
        var retObj = {
            meta: {"action": "update", 'timestamp': new Date(), filename: __filename},
            doc: doc,
            err: err
        };
        return res.send(retObj);
    } else {
        // Get first element from groups array.
        group = groups.pop();

        // Check if group has to be added or excluded from groups based on attribute "isMember"
        if (group.isMember) {
            // Add to set
            User
                .update({_id: doc._id}, {$addToSet: {"groups": group}}, function (res1) {
                    updateGroupsWithUser(err, req, res, groups, doc);
                });
        } else {
            // Remove from set
            User
                .update({_id: doc._id}, {$pull: {"groups": group}}, function (res1) {
                    updateGroupsWithUser(err, req, res, groups, doc);
                });
        }
    }
}


// UPDATE
// findOneAndUpdate @ http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
exports.update = function (req, res) {

    console.log('UPDATE user.');

    // Password validation. Can only partially be a validation rule from the model because of confirmPassword.
    if (req.body.doc.password && req.body.doc.password !== '' && (req.body.doc.password.length < 8 || req.body.doc.password !== req.body.doc.confirmPassword)) {
        var retObj = {
            meta: {"action": "update", 'timestamp': new Date(), filename: __filename},
            doc: null,
            err: {
                message: "Passwords must be the same and at least 8 characters. Please verify your password."
            }
        };
        return res.send(retObj);
    }


    console.log('Updating....\n', req.body);


    var conditions = req.params._id
        , update = {
            gender: req.body.doc.gender || 'male',
            name: req.body.doc.name || '',
            location: {
                street: req.body.doc.location.street || '',
                city: req.body.doc.location.city || '',
                zip: req.body.doc.location.zip || '',
                state: req.body.doc.location.state || ''
            },
            phone: req.body.doc.phone || '',
            email: req.body.doc.email || '',
            picture: req.body.doc.picture || '',
            description: req.body.doc.description,
            modificationDate: Date.now()
        }
        , options = { multi: false }
        , callback = function (err, doc) {
            updateGroupsWithUser(err, req, res, req.body.groups, doc);
        };

    if (update.picture === '') {
        update.picture = "user.png";
    }

    if (req.body.doc.password && req.body.doc.password !== '') {
        // Make sure that password is hashed.
        update.password = passwordHash.generate(req.body.doc.password || "topSecret!");
    }

    User
        .findByIdAndUpdate(conditions, update, options, callback);
}

// DELETE
// remove @ http://mongoosejs.com/docs/api.html#model_Model-remove
exports.delete = function (req, res) {
    var conditions, callback, retObj;

    console.log('Deleting user. ', req.params._id);

    conditions = {_id: req.params._id}
        , callback = function (err, doc) {
        retObj = {
            meta: {"action": "delete", 'timestamp': new Date(), filename: __filename},
            doc: doc,
            err: err
        };
        return res.send(retObj);
    }

    User.remove(conditions, callback);
}
