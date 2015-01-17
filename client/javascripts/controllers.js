/*jslint node: true, plusplus: true, todo: true  */
/*globals userGenerator */
/**
 * Created by theotheu on 27-10-13.
 */
"use strict";

function GroupListCtrl($scope, groupsService) {

    // GET all groups
    $scope.groups = groupsService.groups.get();
}
function GroupDetailCtrl($scope, $routeParams, $location, groupsService) {
    var isSuccess;

    // GET 1 group
    if ($routeParams._id != 0) {
        $scope.groups = groupsService.groups.get({_id: $routeParams._id}, function () {
            console.log('$scope.requests ', $scope.requests);
        });
    }

    // CREATE, UPDATE assertion
    $scope.save = function (assertionForm) {
        console.log('Group / entering save ');
        if ($scope.groups.doc && $scope.groups.doc._id !== undefined) {
            groupsService.groups.update({_id: $scope.groups.doc._id}, $scope.groups.doc, function (res) {
                isSuccess = res.err === null;
                $scope.isSuccess = isSuccess;
                if (isSuccess) {
                    $scope.msg = "Group successfully updated.";
                } else {
                    $scope.err = res.err.message || res.err.err;
                }
                // Show save and updates messages
                $scope.checkResult = function (type, val) {
                    return checkResult($scope, type, val);
                }
            });
        } else {
            console.log('Entering save', $scope.groups.doc);
            groupsService.groups.save({}, $scope.groups.doc, function (res) {
                isSuccess = res.err === null;
                $scope.isSuccess = isSuccess;
                if (isSuccess) {
                    $scope.msg = "Group successfully created.";
                    $scope.groups.doc._id = res.doc._id;
                } else {
                    $scope.err = res.err.message || res.err.err;
                }
                // Show save and updates messages
                $scope.checkResult = function (type, val) {
                    return checkResult($scope, type, val);
                }
            });
        }
    }
    // DELETE group
    $scope.delete = function (_id) {
        groupsService.groups.delete({_id: _id});
        $location.path("/groups");
    }
    // Show save and updates messages
    $scope.checkResult = function (type, val) {
        return checkResult($scope, type, val);
    }
}
function HomeCtrl() {
    // TODO: Replace "home.html" template.
    alert("Where is my view!")
}

/**
 * Controller used to generate a new random user.
 * Purpose of this function is to generate random users.
 * @param $scope
 * @param $location
 * @param usersService
 * @constructor
 */
function UserGeneratorCtrl($scope, usersService) {
    var isSuccess, newUser;

    $scope.genders = [
        "male", "female"
    ];
    console.log('Creating user...');

    // Generate user with random attribute values
    newUser = userGenerator();

    // Save user in MongoDb
    usersService.users.save({}, newUser, function (res) {
        console.log(res);
        $scope.users = {doc: res.doc};
        $scope.users.doc.password = res.doc.meta.humanReadablePassword;
        $scope.users.doc.confirmPassword = res.doc.meta.humanReadablePassword;
        isSuccess = res.err === null;
        $scope.isSuccess = isSuccess;

        if (isSuccess) {
            $scope.msg = "User successfully created.";
            $scope.users.doc._id = res.doc._id;
        } else {
            $scope.err = res.err.message || res.err.err;
        }
        // Show save and updates messages
        $scope.checkResult = function (type, val) {
            return checkResult($scope, type, val);
        }


    });
    // Show save and updates messages
    $scope.checkResult = function (type, val) {
        return checkResult($scope, type, val);
    }
}
/**
 * GET all users
 * @param $scope
 * @param db
 * @constructor
 */
function UserListCtrl($scope, usersService) {

    console.log('Get all users.');
    $scope.users = usersService.users.get();
}
/**
 * get 1 user
 * @param $scope
 * @param $routeParams
 * @param db
 * @constructor
 */
function UserDetailCtrl($scope, $routeParams, $location, usersService) {
    var isSuccess;

    $scope.genders = [
        "male", "female"
    ];


    usersService.users.get({_id: $routeParams._id}, function (data) {
        $scope.users = data;

        if (data.doc) {
            $scope.users.doc.password = null;
            $scope.users.doc.confirmPassword = null;

        }
    });


    $scope.delete = function (_id) {
        usersService.users.delete({_id: _id});
        $location.path("/users");
    }
    $scope.save = function () {
        console.log('--------------------------');
        console.log($scope.users.groups);
        console.log('--------------------------');


        if ($scope.users.doc && $scope.users.doc._id !== undefined) {
            console.log('Entering Update', $scope.users.doc);
            if ($scope.users.doc.password && $scope.users.doc.password.length !== '' && ($scope.users.doc.password.length < 8 || $scope.users.doc.password !== $scope.users.doc.confirmPassword)) {
                isSuccess = false;
                $scope.isSuccess = isSuccess;
                $scope.err = "Passwords must be the same. Please verify your password.";
                return;
            }
            usersService.users.update({_id: $scope.users.doc._id}, $scope.users, function (res) {
                isSuccess = res.err === null;
                $scope.isSuccess = isSuccess;
                if (isSuccess) {
                    $scope.msg = "User successfully updated.";
                } else {
                    $scope.err = res.err.message || res.err.err;
                }
            });
        } else {
            console.log('Entering Create', $scope.users.doc);
            if (!$scope.users.doc.password || $scope.users.doc.password === null || $scope.users.doc.password === undefined || $scope.users.doc.password.length < 8 || $scope.users.doc.password !== $scope.users.doc.confirmPassword) {
                isSuccess = false;
                $scope.isSuccess = isSuccess;
                $scope.err = "Passwords must be the same. Please verify your password.";
                return;
            }
            usersService.users.save({}, $scope.users.doc, function (res) {
                isSuccess = res.err === null;
                $scope.isSuccess = isSuccess;
                if (isSuccess) {
                    $scope.msg = "User successfully created.";
                    $scope.users.doc._id = res.doc._id;
                } else {
                    $scope.err = res.err.message || res.err.err;
                }
            });
        }
    }
    // Show save and updates messages
    $scope.checkResult = function (type, val) {
        return checkResult($scope, type, val);
    }
}
/**
 * ==================================================================
 * Helper functions
 * ==================================================================
 */

// Helper for messages
function checkResult($scope, type, val) {
    $scope.checkResult = function (type, val) {
        if (type === 'err' && (val === undefined || val === null)) {
            return true;
        }
        return val;
    };
}
/**
 * Generates a user with random properties
 * @returns {{name: string, email: string, password: string, description: string, location: {street: *, city: *, state: *, zip: string}, picture: *}}
 */
function userGenerator() {
    var newUser, names, images, firstname, lastnames, lastname, streets, street, cities, city, states, state, postcode, name, email, password, i, phone, genders, gender, picture;
    // Data for random properties
    names = {
        male: ['Nick', 'Gavin', 'Fidel', 'Guillermo', 'Tom', 'Dion', 'Sung', 'Drew', 'Jerrod', 'Leon', 'Nelson', 'Lionel', 'Cornell', 'Trey', 'Sonny', 'Gino', 'Maurice', 'Albert', 'Branden', 'Dorian', 'Marc', 'Steve', 'Sang', 'Herbert', 'Piet', 'Bernie', 'Landon', 'Charley', 'Jerold', 'Denis', 'Derek', 'Chris', 'Menno', 'Chad', 'Lindsay', 'Trent', 'Robert', 'Donn', 'Eibert ', 'Spencer', 'Lawerence', 'Andrew', 'Johnathan', 'Stewart', 'Deshawn', 'Vernon', 'Phillip', 'Cleveland', 'Trevor', 'Derick', 'Darren', 'Porter', 'Quinn', 'Boris', 'Ruben', 'Antony', 'Robin', 'Nicky', 'Gabriel', 'Rueben', 'Numbers', 'Kris', 'Kim', 'Johnson', 'Floris', 'Renaldo', 'Errol', 'Ambrose', 'Lazaro', 'Jefferey', 'Doug', 'Chet', 'Lupe', 'Warner', 'Pascal', 'Kristopher', 'Rashad', 'Philip', 'Stanton', 'Jamie', 'Dillon', 'Barney', 'Roosevelt', 'Billy', 'Elden', 'Adrian', 'Bradford', 'Lamont', 'Ramon', 'Elisha', 'Adolph', 'Tyrone', 'Lesley', 'Arlie', 'Jesper ', 'Darell', 'Ike', 'Hank', 'Clifton', 'Ezequiel'],
        female: ['Linda', 'Onie', 'Cheri', 'Alyse', 'Cira', 'Georgianna', 'Allison', 'Darby', 'Fernande', 'Jong', 'Trinh', 'Leone', 'Vanita', 'Minh', 'Carina', 'Emelina', 'Stacy', 'Lonnie', 'Tyler', 'Veronica', 'Anastasia', 'Zandra', 'Gema', 'Rana', 'Hope', 'Brenda', 'Katrina', 'Eliana', 'Usha', 'Gay', 'Sabrina', 'Glady', 'Robyn', 'Robertha', 'Denisha', 'Tabitha', 'Ima', 'Sigrid', 'Fe', 'Sarita', 'Shantell', 'Pricilla', 'Adelia', 'Henriette', 'Syreeta', 'Mckenzie', 'Phylis', 'Dion', 'Sharika', 'Hellen', 'Paulina', 'Yolonda', 'Rubi', 'Wendy', 'Golden', 'Ashly', 'Mia', 'Lavette', 'Doretta', 'Devon', 'Celestina', 'Ryann', 'Diana', 'Chieko', 'Fernanda', 'Eugene', 'Catarina', 'Desirae', 'Marita', 'Nicolle', 'Shawanna', 'Nancee', 'Jonna', 'Bunny', 'Kaitlyn', 'Angelic', 'Malvina', 'Johnsie', 'Lorna', 'Sunday', 'Riva', 'Fred', 'Myesha', 'Thomasina', 'Camille', 'Vannesa', 'Ivey', 'Freddie', 'Damaris', 'Shala', 'Elvia', 'Skye', 'Eva', 'Kum', 'Lanie', 'Aide', 'Shelli', 'Tiera', 'Charlott', 'Teisha']
    };
    lastnames = ['Keeken', 'Kuitenbrouwer', 'Wiggerts', 'Wijlen', 'Heemstra', 'Hoffstede', 'Kuijten', 'Maurer', 'Hogerdijk', 'Boxman', 'Hellegers', 'Gilin', 'Schaab', 'Bozon', 'Poulisse', 'Bersselaar', 'Dales', 'Hydra', 'Heevel', 'Luites', 'Staadegaard', 'Sekowsky', 'Croockewit', 'Messing', 'Harkema', 'Barends', 'Bimmerman', 'Siwabessy', 'Boot', 'Vaartjes', 'Krabbendam', 'Buijssen', 'Bles', 'Stribos', 'Doornik', 'Kerjes', 'Busio', 'Vitkovic', 'Ostadi', 'Pulskens', 'Luijtelaar', 'Eijkenboom', 'Stinstra', 'Kammen', 'Welbers', 'Beer', 'Sluiman', 'Preter', 'Effing', 'Folkers', 'Grevelink', 'Moser', 'Memis', 'Hafkamp', 'Gregoor', 'Gielens', 'Pos', 'Gerrichhauzen', 'Schützle', 'Dekhuijzen', 'Claeys', 'Heiltjes', 'Ceelen', 'Taminiau', 'Lavino', 'Boomert', 'Oortgiesen', 'Laponder', 'Koppen', 'Vlaskamp', 'Peykar', 'Lourernsen', 'Quintino', 'Kegels', 'Breenen', 'Mastenbroek', 'Horlings', 'Rijnbout', 'Verheugd', 'Weyenberg', 'Smalbil', 'Salentijn', 'Nonnekes', 'Rayer', 'Esders', 'Busser', 'Reiss', 'Coelen', 'Beeldsnijder', 'Feber', 'Sinkeler', 'Zwanenberg', 'Snaphaan', 'Verzijden', 'Zeilmaker', 'Siemons', 'Papenborg', 'Heiwegen'];
    streets = ['Ruitenberglaan', 'Nico van der Valkpad', 'Everstraat', 'Brink O.Z.', 'Luissel', 'It Grien', 'Christiaan Huijgensstraat', 'Jan de Geusrede', 'Damsteeg', 'Roffelaarskom', 'Houtentorenweg', 'Gouwekade', 'Beresteynstraat', 'Gijsinglaan', 'Dorreweg', 'Schermplaat', 'G.B. Shawplaats', 'Zudden', 'De Koekoek', 'Heeckerenstraat', 'Slagendreef', 'Poststraatje', 'Diurckenlaan', 'Meliestraat', 'Vlasserij', 'Trompenburgstraat', 'Schoordijk', 'Nieuwe Plantage', 'Schoonekampzoom', 'Zuster Xavier Nolenslaan', 'Ring', 'Achter de Valk', 'Veersteeg', 'M.C. Escherlaan', 'Weidijk', 'Van Bronckhorstdreef', 'Meteorenlaan', 'Bennebroekerdreef', 'R Veemanstrjitte', 'Oliepalmstraat', 'Maarsdreef', 'Godeboldlaan', 'Dirkslandhof', '3e Westewagenhof', 'Schelfhout', 'Snipweide', 'Prof. Poststraat', 'Melisse', 'Vuurlijn', 'Leuvensveldseweg', 'Kinkershof', 'Kronenburgplantsoen', 'Philipsflat', 'Lisztlaan', 'Surinamesingel', 'Kloveniersdreef', 'Vliet en Wegen', 'Groenhoven', 'Groot-Bollerweg', 'Schenkeldijk', 'Burg Jhr H vd Boschstr', 'Wijkamplaan', 'Achter de Broeren', 'Op de Hof', 'Veldbeemd', 'Dokter De Ramlaan', 'Mirasstraat', 'Milieuparkweg', 'Sneeuwgors', 'Hiltsjemuoiswalden', 'Postdwarsweg', 'Pieter Jacobszstraat', 'Aalscholverring', 'Oerhaelspaed', 'J van der Veldelaan', 'Frankhuizerallee', 'Eijsderbosch', 'Vuurbaakstraat', 'Crocuslaan', 'Roobolweg', 'It Merkelan', 'Weth Soetekouwstraat', 'Zeisweg', 'Schoonhetenseweg', 'Roeterskamp', 'Doctor de Visserstraat', 'Aboomsestraat', 'Dobbelsteijnstraat', 'Professor Poelslaan', 'Joost van den Vondellaan', 'Dijkeputten', 'Blindehoek', 'Zandloperweg', 'Geurdenstraat', 'Adelbert van Scharnlaan F', 'Ludenweg', 'Swaensborch', 'Sorteerder', 'Driepoelpad', 'Carpinistraat', 'Eekhoffstraat'];
    cities = ['Arnhem', 'Meppen', 'Budel Dorplein', 'Wilsum', 'Schettens', 'Briltil', 'Collendoorn', 'Grevenbicht', 'Bruinehaar', 'Maasvlakte Rotterdam', 'Baarle-nassau', 'Goutum', 'Beek Gem Montferland', 'Middenbeemster', 'Bornerbroek', 'Grashoek', 'Veelerveen', 'Spier', 'Schelluinen', 'Oudehaske', 'Holwierde', 'Aldtsjerk', 'Paasloo', 'Limmen', 'Lippenhuizen', 'Nijehaske', 'Blokzijl', 'Veere', 'Hendrik Ido Ambacht', 'Lienden', 'Wehe-Den Hoorn', 'Parrega', 'Glimmen', 'Gersloot', 'Kronenberg', 'Garminge', 'De Heurne', 'Donderen', 'Borssele', 'Beets NH', 'Arnhem', 'Elp', 'Eede Zld', 'Wognum', 'Burgh-Haamstede', 'Terschelling O.end', 'Schiphol-Rijk', 'Onna', 'Warder', 'Vasse', 'Eesterga', 'Zuidveen', 'Delfstrahuizen', 'Nieuw Lekkerland', 'Niftrik', 'Bedum', 'Koudekerke', 'Beerzerveld', 'Leur gld', 'Oldelamer', 'Westergeest', 'Zwolle', 'Hoogland', 'Vlieland', 'Eindhoven', 'Orvelte', 'Rheezerveen', 'Hoensbroek', 'Sint Philipsland', 'Pijnacker', 'Nieuwerkerk Ad IJssel', 'Den Haag / Loosduinen', 'Starnmeer', 'Beinsdorp', 'Huijbergen', 'Oostburg', 'De Koog (texel)', 'Molenhoek', 'Sijbrandahuis', 'Varsseveld', 'Nijeholtpade', 'Vegelinsoord', 'Noordeinde GLD', 'Wijdewormer', 'Nieuw-Annerveen', 'Chaam', 'Oirlo', 'Holten', 'Medemblik', 'Vondelingenplaat Rt', 'Broekhuizen', 'IJhorst', 'Balloerveld', 'Grathem', 'Dodewaard', 'Slagharen', 'Bingelrade', 'Harreveld', 'Vlierden', 'Honselersdijk'];
    states = ['Groningen', 'Friesland', 'Drenthe', 'Overijssel', 'Flevoland', 'Gelderland', 'Utrecht', 'Noord-Holland', 'Zuid-Holland', 'Zeeland', 'Noord-Brabant', 'Limburg'];
    images = {
        male: ['6280_117343852429_521247429_2260561_6657651_n.jpg', 'austrianman.jpg', 'averageafghanimale.jpg', 'averageargentinemale.jpg', 'averagebollywoodactor.jpg', 'averageburmesemale.jpg', 'averagecambodianman.jpg', 'averagedutchman.jpg', 'averageegyptianmale.jpg', 'averageenglishman.jpg', 'averageethiopianmale.jpg', 'averagefinnman.jpg', 'averagefrenchmale.jpg', 'averagegermanmale.jpg', 'averagegreekman.jpg', 'averagehumanman.jpg', 'averageindianman.jpg', 'averageiranianman.jpg', 'averageiraqimale.jpg', 'averageirishmale.jpg', 'averageisraelimale.jpg', 'averagelebaneseman.jpg', 'averagemexicanman.jpg', 'averagemongolman.jpg', 'averageperuvianmale1.jpg', 'averagepolishmale.jpg', 'averagepuertoricanman.jpg', 'averageromanianmale.jpg', 'averagerussianman.jpg', 'averagesamoanmale.jpg', 'averagesaudimale.jpg', 'averageserbianwoman.jpg', 'averagesouthafricanmale.jpg', 'averagesouthindian.jpg', 'averagespaniardmale.jpg', 'averageswedeman.jpg', 'averageswissman.jpg', 'averagetaiwanesemale.jpg', 'averagetibetanman.jpg', 'averageukrainianman.jpg', 'averageuzbekmale.jpg', 'belgianman1.jpg', 'chineseactor.jpg', 'czechman.jpg', 'filipinomale.jpg', 'img00000242428.jpg', 'italian.jpg', 'japaneseactor.jpg', 'japaneseaverageman.jpg', 'koreanaverageman.jpg', 'koreanmaleactor.jpg', 'thaiaverageman1.jpg', 'hungarianman.jpg', 'vietnameseaverageman.jpg', 'whiteamericanmale.jpg'],
        female: ['austrianfemale.jpg', 'averageafghanifemale.jpg', 'averagearegentinefemale.jpg', 'averagebeauty.jpg', 'averagebollywoodactress.jpg', 'averagebrazilianwoman.jpg', 'averageburmesefemale.jpg', 'averagecambodianwoman.jpg', 'averagechineseactress.jpg', 'averagedutchwoman.jpg', 'averageenglishwoman.jpg', 'averageethiopianwoman.jpg', 'averagefilipino.jpg', 'averagefinnishfemale.jpg', 'averagefrenchfemale.jpg', 'averagegermanwo.jpg', 'averagegreekwoman.jpg', 'averagehumanwoman.jpg', 'averageindian.jpg', 'averageiranianwoman.jpg', 'averageirishfemale.jpg', 'averageisraeliwoman.jpg', 'averageitalianfemale.jpg', 'averagejapaneseactress.jpg', 'averagelatvian-lithuanianfemale.jpg', 'averagelebanesewoman.jpg', 'averagemexicanwoman.jpg', 'averagemongolianwoman.jpg', 'averageperuvianwoman.jpg', 'averagepolishfemale.jpg', 'averagepornstar1.jpg', 'averageromanianfemale.jpg', 'averagesamoanfemale.jpg', 'averageserbian.jpg', 'averagesouthafricanfemale.jpg', 'averagesouthindianfemale.jpg', 'averagespaniardfemale.jpg', 'averageswedishfemale.jpg', 'averageswisswoman.jpg', 'averagetaiwanesefemale.jpg', 'averageturkishwoman.jpg', 'averageukrainian.jpg', 'averageuzbekfemale.jpg', 'averagevietnamesewoman.jpg', 'averagewelshwoman.jpg', 'belgianwoman1.jpg', 'chadcameroon.jpg', 'czechwoman.jpg', 'hungarianwoman.jpg', 'japaneseaveragewoman.jpg', 'koreanaveragewoman.jpg', 'newrussianaveragewoman.jpg', 'puertoricanfemale.jpg', 'thaiwoman.jpg', 'whiteamericanfemale.jpg']
    };
    genders = ["male", "female"];
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // generate gender
    gender = genders[getRandomInt(0, genders.length - 1)];
    // generate firstname, lastname, street, city and state
    firstname = names[gender][getRandomInt(0, names[gender].length - 1)];
    lastname = lastnames[getRandomInt(0, lastnames.length - 1)];
    street = streets[getRandomInt(0, streets.length - 1)];
    city = cities[getRandomInt(0, cities.length - 1)];
    state = states[getRandomInt(0, states.length - 1)];
    // name
    name = firstname + " " + lastname;
    // email
    email = firstname.toLowerCase() + "." + lastname.toLowerCase() + "@example.com";
    // email
    phone = "0";
    for (i = 0; i < 2; i++) {
        phone += "" + getRandomInt(1, 9);
    }
    phone += "-";
    for (i = 0; i < 8; i++) {
        phone += "" + getRandomInt(0, 9);
    }
    // generate password
    password = Math.random().toString(36).substring(7);
    // generate postcode
    postcode = '';
    for (i = 0; i < 4; i++) {
        postcode += getRandomInt(1, 9);
    }
    for (i = 0; i < 2; i++) {
        postcode += String.fromCharCode(getRandomInt(65, 90));
    }
    // get images
    picture = images[gender][getRandomInt(0, images[gender].length - 1)];
    newUser = {
        gender: gender,
        name: name,
        email: email,
        password: password,
        description: "Generated.",
        location: {
            street: street,
            city: city,
            state: state,
            zip: postcode
        },
        phone: phone,
        picture: picture,
        meta: {
            humanReadablePassword: password,
            creationDate: new Date(),
            imageSrc: "http://pmsol3.wordpress.com/"
        }
    };
    return newUser;
}