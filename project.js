var express = require('express');
var app = express();
var ejs = require('ejs');
app.use(express.static('public'));
app.set('view engine','ejs');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var db = mongojs('mongodb://samyu:samyu369@ds245680.mlab.com:45680/svecw',['admin','user','hostel'])
var session = require('express-session')
app.use(session({secret:'123456789'}))
app.get('/home',function(req,res){
	res.sendFile(__dirname+'/public/home.html')
})


var ObjectId = require("mongojs").ObjectId;



app.get('/signup',function(req,res){
		res.sendFile(__dirname+'/public/signup.html')
})
app.use(bodyParser.urlencoded({extended:false}))
app.post('/signupregister',function(req,res){
	var res1 = req.body.name;
	var res2 = req.body.email;
	var res3 = req.body.regdno;
	var res4 = req.body.password;
var doc = {
	name:res1,
	email:res2,
	regdno:res3.toUpperCase(),
	password:res4,
}
console.log(doc);
db.user.insert(doc,function(err,newDoc){
	res.sendFile(__dirname+'/public/login.html')
	console.log(newDoc);
})
})
app.get('/login',function(req,res){
	res.sendFile(__dirname+'/public/login.html')
})
app.post('/loginsubmit',function(req,res){
	var res9 = req.body.regdno;
	var res10 = req.body.password;

	var doc = {
		"regdno":res9.toUpperCase(),
		"password":res10

	}
	db.user.find(doc, function (err, docs){
		if(docs.length > 0) {
			if(res10 == "svecw123")
				res.sendFile(__dirname+'/public/roomsinsert.html')
			else
				res.sendFile(__dirname+'/public/hostelselect.html')
		}

		else{
			res.send('Invalid user');
		}
	})
})
app.post('/roomsinsertsubmit',function(req,res){
	var res11 = req.body.name;
	var res12 = req.body.rno;
	var res13 = req.body.beds;
	var res14 = req.body.hosteltype;
	var res15 = req.body.fees;
var doc = {
	name:res11,
	rno:res12,
	beds:res13,
	hosteltype:res14,
	fees:res15,
}

console.log(doc);
db.hostel.insert(doc,function(err,newDoc){
	res.send("data inserted successfully");
	console.log(newDoc);
})
})
app.post('/hostelselectsubmit',function(req,res){
	var res19 = req.body.name;
	var doc = {
		"name":res19
	}
	db.hostel.find(doc, function (err, docs){
		if(docs.length > 0) {
			var k = docs[0].name
			if(k == res19) {
			      console.log(docs)
			      res.render('hostelrooms',{result:docs})
			    }
			      
			}

		else{
			res.send('No data entered');
		}
	})
})
app.get('/retreive/:rno/:name/:_id/:beds',function(req,res){
	var n1 = req.params.rno;
	var n2 = req.params.name;
	db.hostel.find({rno:n1,name:n2},function(err,docs){
			res.render('retreive',{result:docs});
	})
})
app.get('/logout',function(req,res){
	req.session.destroy(function(err){
		res.sendFile(__dirname+'/public/home.html')		
	})
})

app.get('/con/:_id/:beds',function(req,res){
	console.log('hhh')
	var s = req.params._id;
	var b = req.params.beds;
	console.log(s);
	console.log(b);
	db.hostel.update({"_id": ObjectId(s)}, {$set:{"beds": b-1}}, function(err, result){
    if (err) {
        console.log('Error updating object: ' + err);
        res.send({'error':'An error has occurred'});
    } else {
        console.log('' + result + ' document(s) updated');
        res.send("Room booked successfully");
    }
	})
})
app.listen(9999,function(){
	console.log("go to web page!!!!");
})
