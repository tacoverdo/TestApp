/**
 * Module dependencies.
 */
var fs = require('fs')
    , assert = require('assert')
    ;

// Load configuration
var env = process.env.NODE_ENV || 'development'
    , config = require('../server/config/config.js')[env];

// Bootstrap db connection
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
mongoose.connect(config.db);
/**
 * FIXME: debugging mongoose
 */
mongoose.connection.on('error', function (err) {
    console.error('MongoDB error: %s', err);
});
//mongoose.set('debug', true);

// Bootstrap models
var models_path = __dirname + '/../server/app/models'
    , model_files = fs.readdirSync(models_path);
model_files.forEach(function (file) {
    require(models_path + '/' + file);
})


var Group = mongoose.model('Group');


/**
 * Now the tests
 */

describe('Model test for Group', function () {
    describe('CRUD operations with start up and tear down', function () {
        var doc = null;

        // Start up
        beforeEach(function (done) {
            doc = new Group({name: 'Luna',
                description: "tezzt 1"});
            doc.save(done);
        });

        // Tear down
        afterEach(function (done) {
            Group
                .remove({name: 'Luna'}, done);
        });

        // Tests

        // GET all groups
        it("GET all groups", function (done) {
            Group
                .find({}, function (err, result) {
                    if (err || result.length === 0) {
                        throw err;
                    }
                    done();
                })
        });

        // GET all groups
        it("GET 1 group", function (done) {
            Group
                .find({_id: doc._id}, function (err, result) {
                    if (err || result.length !== 1) {
                        throw err;
                    }
                    done();
                })
        });

        // Update group
        it("UPDATE group", function (done) {
            Group
                .update({_id: doc._id}, {description: 'Updated description'}, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    done();
                })
        });


    });


    describe('Simple CRUD operations', function () {
        var doc = null;

        // CREATE group
        it("CREATE group", function (done) {
            doc = new Group({name: 'Luna',
                description: "tezzt"});
            doc.save(done);
        });

        // GET all groups
        it("GET all groups", function (done) {
            Group
                .find({}, function (err, result) {
                    if (result.length === 0) {
                        throw err;
                    }
                    done();
                })
        });

        // GET all groups
        it("GET 1 group", function (done) {
            Group
                .find({_id: doc._id}, function (err, result) {
                    if (result.length !== 1) {
                        throw err;
                    }
                    done();
                })
        });

        // Update group
        it("UPDATE group", function (done) {
            Group
                .update({_id: doc._id}, {description: 'Updated description'}, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    done();
                })
        });

        // DELETE group
        it("DELETE group", function (done) {
            Group
                .remove({_id: doc._id}, done);
        });

    });
});
