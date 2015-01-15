/**
 * Created by theotheu on 24-12-13.
 */

module.exports = function (app) {
    /*  user routes
     ---------------
     We create a variable "user" that holds the controller object.
     We map the URL to a method in the created variable "user".
     In this example is a mapping for every CRUD action.
     */
    var controller = require('../app/controllers/users.js');

    // CREATE
    app.post('/users', controller.create);

    // RETRIEVE
    app.get('/users', controller.list);
    app.get('/users/:_id', controller.detail);

    // UPDATE
    app.put('/users/:_id', controller.update);

    // DELETE
    app.delete('/users/:_id', controller.delete);
}