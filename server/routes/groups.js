/**
 * Created by theotheu on 24-12-13.
 */

module.exports = function (app) {
    /*  user groups
     ---------------
     We create a variable "user" that holds the controller object.
     We map the URL to a method in the created variable "user".
     In this example is a mapping for every CRUD action.
     */
    var controller = require('../app/controllers/groups.js');

    // CREATE
    app.post('/groups', controller.create);

    // RETRIEVE
    app.get('/groups', controller.list);
    app.get('/groups/:_id', controller.detail);

    // UPDATE
    app.put('/groups/:_id', controller.update);

    // DELETE
    app.delete('/groups/:_id', controller.delete);
}