const express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var sess;
const mysql = require('mysql');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
	port:3307,
    database: "airline_management"
});

app.get('/', function (req, res) {
    res.redirect('/public/index.html');
    return;
});

app.listen(3003, function () {
    console.log('App listening  on port 3003!');
});

con.connect(function (err) {
    if (err)
        throw err;
});

app.post('/signin', (req, res) => {
    var sql = `select count(*) as count from user_profile where email_id = '${req.body.emailid}' and user_password = MD5('${req.body.password}')`;
    console.log(sql);
    con.query(sql, function (err, result, fields) {
        if (result[0].count != 1) {
            res.status(401).send("Wrong credentials");
            return;
        }
        if (err) {
            console.log(err);
            throw err;
            return;
        }
        var sql2 = "SELECT profile_id FROM user_profile WHERE email_id = '"+req.body.emailid+"'";
        con.query(sql2,function(err,result){
            // console.log("profileid "+result[0].profile_id); 
            sess = req.session;
            sess.emailid = req.body.emailid;  
            sess.profile_id = result[0].profile_id;
        });

        res.cookie('name','test',{expire:360000+Date.now()}); 
        
        res.redirect('/public/homepage.html');
    });
});

app.post('/signinAdmin', (req, res) => {
    var sql = `select count(*) as count from admin_profile where email_id = '${req.body.emailid}' and user_password = MD5('${req.body.password}')`;
    console.log(sql);
    con.query(sql, function (err, result, fields) {
        if (result[0].count != 1) {
            res.status(401).send("Wrong credentials");
            return;
        }
        if (err) {
            console.log(err);
            throw err;
            return;
        }       
        res.redirect('/public/admin.html');
    });
});

app.post('/search', (req, res) => {
    console.log(sess.profile_id);
    var from_place = req.body.from_place;
    var to_place = req.body.to_place;
    var date_to = req.body.date_to;
    var date_from = req.body.date_from;
    var num_passengers = req.body.num_passengers;
    var sortorder = req.body.sortorder;
    var sql = "select air_flight.flight_id, air_flight.from_location, air_flight.to_location, airline_name, flight_departure_date, flight_arrival_date, departure_time, arrival_time, price  from air_flight inner join air_flight_details on air_flight.flight_id = air_flight_details.flight_id where from_location='"+from_place+"' and to_location='"+to_place+"' and total_seats >= '"+num_passengers +"' and flight_departure_date = '"+date_to+"' and air_flight.deleted!='1' order by price "+sortorder+";";
    console.log(sql);
    con.query(sql, function(err, result){
        if (err) 
            throw err; 
        // console.log(result);
        res.send(result);
        res.end();
    });
});

app.post('/bookSeats', (req, res) => {
    console.log(req.body.length);
    var profile_id = sess.profile_id;
    var flight_id = sess.flight_id;
    var flight_departure_date = sess.flight_departure_date;
    console.log(sess.flight_departure_date);
    var flight_status = 1;
    var sql = "insert into air_ticket_info(profile_id, flight_id, flight_departure_date, flight_status) values('"+profile_id+"','"+flight_id+"', '"+flight_departure_date+"', '"+flight_status+"')";
    var ticket_id_generated = "";
    console.log(sql);
    con.query(sql, function(err, result){
        if(err)
            throw err;
        console.log("1 record added");
        sql = "select max(ticket_id) as ticket_id from air_ticket_info";
        con.query(sql, function(err, result){
            if(err)
                throw err;
            ticket_id_generated = result[0].ticket_id;
            for(var i = 0; i < req.body.length; i++){
                var seatnumber = req.body[i].seatnumber;
                var fullname = req.body[i].passengername;
                sql = "insert into passenger_seat(ticket_id, fullname, seat_number) values('"+ticket_id_generated+"', '"+fullname+"', '"+seatnumber+"')";
                con.query(sql, function(err, result){
                    if(err)
                        throw err;
                    console.log("success");
                });
            }
        });
    });
});

app.post('/signup', (req, res) => {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var password = req.body.password;
    var emailid = req.body.emailid;
    var mobile = parseInt(req.body.mobile);
    console.log(password);
    var sql = "insert into user_profile(user_password, firstname, lastname, mobile_number, email_id) values (MD5('"+password+"'),'"+firstname+"','"+lastname+"','"+mobile+"','"+emailid+"')";
    console.log(sql);
    con.query(sql, function(err, result){
        try{
            if(err){
                throw err;
            }
            console.log("1 record added");
            res.send("done");
        }
        catch(err){
            res.send(err);
        }
    });
});

app.post('/findmybooking', (req, res) => {
    var ticketid = req.body.ticketid;
    var lastname = req.body.lastname;
    console.log(ticketid);
    var sql = "select * from air_ticket_info where ticketid='"+ticketid;
});

app.post('/onlinecheckin', (req, res) => {
    var ticketid = req.body.ticketid;
    var lastname = req.body.lastname;
    console.log(ticketid);
    var sql = "SELECT (CASE WHEN count = 1 THEN 'present' ELSE 'not present' END) as isPresent FROM (SELECT COUNT(*) AS count FROM air_ticket_info INNER JOIN user_profile ON air_ticket_info.profile_id = user_profile.profile_id WHERE ticket_id = '"+ticketid+"' AND lastname = '"+lastname+"') AS a";
    con.query(sql, function(err, result){
        if (err) 
            throw err;
        if(!result.includes('not')){
            sql = "insert into passenger_checkin(ticket_id, checkedin) values(ticketid, 'true')";
        }
    });
});

app.post('/seatSelect', function(req, res){
    var path = __dirname+"/public/flightSeats.html";
    console.log(path);
    fs.readFile(path, function(err, data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
});
// app.get('/bookedSeats',function(req,res){
//     var sql = "select group_concat(seat_number) as seat_numbers from passenger_seat inner join air_ticket_info on passenger_seat.ticket_id = air_ticket_info.ticket_id  where flight_id = '12345' and flight_departure_date = '2018-02-03';";
//     con.query(sql, function(err, result){
//         if (err) 
//             throw err;
//         res.send(result);
//     });
// });
app.post('/bookedSeats',function(req,res){
    console.log("server side "+req.body.flightId);
    var flightID = req.body.flightId;
    sess.flight_id = flightID;
    var dateFrom = req.body.dateFrom;
    sess.flight_departure_date = dateFrom;
    var sql = "select group_concat(seat_number) as seat_numbers from passenger_seat inner join air_ticket_info on passenger_seat.ticket_id = air_ticket_info.ticket_id  where flight_id = "+flightID+" and flight_departure_date ='"+ dateFrom+"';";
    console.log(sql);
    con.query(sql, function(err, result){
        if (err) 
            throw err;
        res.send(result);
    });
});

app.get('/resetSession',function(req,res){
    console.log('dddd');
    res.cookie("name","");
    console.log('Cookies:', req.cookies);
    
   /* res.clearCookie("name");
    res.clearCookie("token");
    res.clearCookie("token1");*/
  /*  var cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }    
        res.cookie(prop, '', {expires: new Date(0)});
    }
    console.log('Cookies:', req.cookies);
  /*  req.session.destroy(function(err){
        if(err){
            console.log(err);
        } else {
            console.log("reserserrrrrrr");
            res.redirect('/');
            res.send();
            console.log('Cookies:', req.cookies);
        }
    });*/
    res.send("Cokkie reset");
});


app.post('/ticket', function(req, res){
    console.log(req.body[0].ticket_id);
    var ticketid = req.body[0].ticket_id;
    var sql = "select air_flight.flight_id, air_flight_details.flight_departure_date, departure_time, flight_arrival_date, arrival_time, price, from_location, to_location from air_flight_details inner join air_ticket_info on air_flight_details.flight_id = air_ticket_info.flight_id inner join air_flight on air_flight.flight_id = air_flight_details.flight_id where ticket_id = '"+ticketid+"'";
    con.query(sql, function(err, result){
        if(err)
            throw err;
        res.send(result);
    });
});

app.post('/ticketList', function(req, res){
    console.log(req.body);
    profile_id = sess.profile_id;
    var sql = "select air_flight.flight_id, air_ticket_info.ticket_id, air_flight_details.flight_departure_date, departure_time, flight_arrival_date, arrival_time, from_location, to_location from air_flight_details inner join air_ticket_info on air_flight_details.flight_id = air_ticket_info.flight_id inner join air_flight on air_flight.flight_id = air_flight_details.flight_id where profile_id = '"+profile_id+"'";
    console.log(sql);
    con.query(sql, function(err, result){
        if(err)
            throw err;
        res.send(result);
    });
});

app.post('/passenger', (req, res) => {
    console.log("passenger");
    console.log(req.body[0].ticket_id);
    ticket_id = req.body[0].ticket_id;
    var sql = "select group_concat(fullname) as passengers from passenger_seat where ticket_id = '"+ticket_id+"'";
    console.log(sql);
    con.query(sql, function(err, result){
        if(err)
            throw err;
        res.send(result);
    });
});

app.post('/flight', (req, res) => {
    var sql = "select flight_id, airline_name, from_location, to_location, total_seats from air_flight where deleted!='1'";
    con.query(sql, function(err, result){
        if(err)
            throw err;
        res.send(result);
    });
});

app.post('/flights', (req, res) => {
    var airline_name = req.body.airlinename;
    var from_location = req.body.fromlocation;
    var to_location = req.body.tolocation;
    var totalseats = req.body.totalseats;
    var departuredate = req.body.departuredate;
    var departuretime = req.body.departuretime;
    var arrivaldate = req.body.arrivaldate;
    var arrivaltime = req.body.arrivaltime;
    var price = req.body.price;
    var sql = "insert into air_flight(airline_name, from_location, to_location, total_seats, deleted) values('"+airline_name+"', '"+from_location+"', '"+to_location+"', '"+totalseats+"', '0')";
    console.log(sql);
    con.query(sql, function(err, result){
        if(err)
            throw err;
        sql = "select flight_id from air_flight where airline_name='"+airline_name+"' and from_location='"+from_location+"' and to_location='"+to_location+"' and total_seats='"+totalseats+"'";
        console.log(sql);
        con.query(sql, function(err, result){
            if(err)
                throw err;
            console.log(result[0].flight_id);
            sql = "insert into air_flight_details(flight_id, flight_departure_date, departure_time, flight_arrival_date, arrival_time, price, available_seats, deleted) values"+
            "('"+result[0].flight_id+"', '"+departuredate+"', '"+departuretime+"', '"+arrivaldate+"', '"+arrivaltime+"', '"+price+"', '"+totalseats+"', '0')";
            con.query(sql, function(err, result){
                if(err)
                    throw err;
                console.log("success");
            });
        });
    });
});

app.post('/deleteflight', (req, res) => {
    var flight_id = req.body.flight_id;
    var sql = "select count(*) as count from air_ticket_info where flight_id='"+flight_id+"'";
    console.log(sql);
    con.query(sql, function(err, result){
        if(err)
            throw err;
        console.log(result[0].count);
        if(parseInt(result[0].count)==0){
            sql = "update air_flight set deleted='1' where flight_id = '"+flight_id+"'";
            con.query(sql, function(err, result){
                if(err)
                    throw err;
                sql = "update air_flight_details set deleted='1' where flight_id = '"+flight_id+"'";
                con.query(sql, function(err, result){
                    if(err)
                        throw err;
                    console.log("Successfully soft-deleted");
                });
            });
        } else{
            console.log("Cannot delete");
            res.send("error");
        }
    });
});

app.post('/updateFlight', (req, res) => {
    var flight_id = req.body.flight_id;
    var seat_number = req.body.seats;
    console.log(flight_id+"-"+seat_number);
    sql = "update air_flight set total_seats='"+seat_number+"' where flight_id='"+flight_id+"'";
    con.query(sql, function(err, result){
        if(err)
            throw err;
        res.send("Updated");
    });
});