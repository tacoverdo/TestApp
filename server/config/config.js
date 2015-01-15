/**
 * Created by theotheu on 24-12-13.
 */
module.exports = {
    development: {
        debug: true,                           // set debugging on/off
        db: 'mongodb://localhost/p496720',     // change p496720 with your database
        port: 3000                              // change 3000 with your port number
     }, test: {
        debug: false,                           // set debugging on/off
        db: 'mongodb://localhost/p496720',     // change p496720 with your database
        port: 3000                              // change 3000 with your port number
    }, production: {

    }
};
