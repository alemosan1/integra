var express = require('express');
const cassandra = require('cassandra-driver');
var app = express();

//constante para el hashing
const bcrypt = require('bcrypt');

//DEJO MONGOOSE DE MOMENTO
//var mongoose = require('mongoose');
//Connect ?
//mongoose.connect('mongodb://localhost:27017')

//Vamos con el cliente

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/test";

//TODO: Puede haber un problema si la base de datos ya esta creado
//mirar alguna manera de que si ya esta creada no hay que volver a hacerlo

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("test");
  dbo.createCollection("users", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
}); 

// Include bodyparser
var bodyparser = require('body-parser')
app.use(bodyparser.json()); // support json encoded bodies
app.use(bodyparser.urlencoded({ extended: true })); // support encoded bodies



//esquema para la base de datos.

// var UserSchema = new mongoose.Schema({
// 	email: {
//     type: String,
//     unique: true,
//     required: true,
//     trim: true
//   },
//   username: {
//     type: String,
//     unique: true,
//     required: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   passwordConf: {
//     type: String,
//     required: true,
//   }

// });

// var User= mongoose.model('User', UserSchema);

// module.export= User;



//Metodo para comprobar que la mac y la date estan en formato
function validate (mac,date) {
	//Voy a crear la regex para validar la hora y para validar la MAC
	var d = new RegExp("([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])");
	var m = new RegExp("[0-9a-f][0-9a-f]:[0-9a-f][0-9a-f]:[0-9a-f][0-9a-f]:[0-9a-f][0-9a-f]",'i');
	console.log(mac);
	console.log(date);
	console.log(m.test(mac));
	console.log(d.test(date));
return (m.test(mac) && d.test(date))
}


app.get('/', function (req,res) {
	res.send('<html>'
			+	'<body>'

			+	'<form method="get" action="/login">'
			+		 '<input type="submit" value="Login"/>'
			+	'</form>'
			+	'<form method="get" action="/register">'
			+		 '<input type="submit" value="Registrarse"/>'
			+	'</form>'

			+	'</body>'
			+'</html>'
			);
	});



app.get('/register', function (req,res) {
	res.send('<html>'
		+	'<body>'
		+		'<form method="post" action="/create">'
		+		 'Email-Address: <input type="text" name="email"><br>'
		+		 'Username: <input type="text" name="username">'
		+		 'Password: <input type="text" name="password"> <br>'
		+		 'Confirm password <input type="text" name="passwordConf"><br>'
		+		 '<input type="submit" value="Registrarse"/>'
		+		'</form>'
		+	'</body>'
		+'</html>'
		);
});

app.get('/login', function (req,res) {
	res.send('<html>'
		+	'<body>'
		+		'<form method="post" action="/validate">'
		+		 'Email-Address: <input type="text" name="email"><br>'
		+		 'Password: <input type="text" name="password"> <br>'
		+		 '<input type="submit" value="Logearse"/>'
		+		'</form>'
		+	'</body>'
		+'</html>'
		);
});

app.post('/create', function (req,res){
	// Supongo que significa que sea distinto de null
	if (true) {
		console.log('holi')
		//console.log (req.body.email+req.body.username+req.body.password+
		//	req.body.passwordConf)

		// Before saving the password I'm gonna hash it to make this database safer
		//FIXME: los tiron van por solucionar la asincronía que hay entre los dos métodos
	  var BCRYPT_SALT_ROUNDS = 12;
	  var password = req.body.password

	  bcrypt.hash(password, BCRYPT_SALT_ROUNDS, function (err, hash) {
		    if (err) {
		      return next(err);
		    }
		    password = hash;
		    var userData = {
	   		 email: req.body.email,
	   		 username: req.body.username,
	    	 password: password,
	   		 passwordConf: req.body.passwordConf,
	  		}
	  		console.log(userData)
		    connect(userData)

		  })


	 function connect(userDataPasado){ 
	 	MongoClient.connect(url, function(err, db) {
		  if (err) {
		  	console.log("Ha habido un error en la conexion")
		  	throw err;
		  }
		  var dbo = db.db("test");
		  //var myobj = { name: "Company Inc", address: "Highway 37" };
		  dbo.collection("users").insertOne(userDataPasado, function(err, res) {
		    if (err) {
		    	console.log("Ha habido un error en la insercion")
		    	throw err;
		    } 
		    console.log("1 document inserted");
		    db.close();
		   
		  });
		});
	   }
		 return res.redirect("/")
	  }
	});


app.post('/validate', function (req,res) {
	
	//Obtengo todos los parametros indicados en el formulario
	var email = req.body.email;
	var password = req.body.password;

	console.log(email);
	console.log(password);

		//ahora nos conectamos a la base de datos y comprobamos que esta el usuario
		MongoClient.connect(url,function (err,db) {
			console.log("estoy en la parate de conectarme")
			
			if (err) {
		  		console.log("Ha habido un error en la conexion")
		  		throw err;
		    }

		 	 var dbo = db.db("test");
		 	 console.log("me conecte a test ")
		 	 //hago la query que le envio a la base de datos
		 	 var query = {email:email};
		 	 console.log(query)
		 	 //Ahora voy a buscar si el usuarios esta dentro de la base de datos
		 	 dbo.collection("users").findOne(query,function(err,user){
		 	 		
		 	 		console.log(user);
		 	 		if (err){
		 	 			//Care this
		 	 			throw err
		 	 		} else if (!user) {
		 	 			var err = new Error (' El usuario no está en la base de datos');
		 	 			err.status=401;
		 	 			//Como trato el error ahora
		 	 		}
		 	 		console.log(user)
		 	 		db.close();

		 	 		bcrypt.compare(password, user.password,function(err,result){

		 	 			if (result===true){
		 	 				return res.redirect("/data")
		 	 			} else {
		 	 				return res.redirect("/login")
		 	 			}

		 	 		})
		 	 	})
		})	
	
  });


app.get('/data', function (req,res) {
	res.send('<html>'
		+	'<body>'
		+		'<form method="get" action="/check">'
		+		 'Mac-Address: <input type="text" name="mac" value="AA:AA:AA:AA"><br>'
		+		 'Date:        <input type="text" name="date1" value="11:11:11" placeholder="HH:mm:ss">'
		+		 'To: <input type="text" name="date2" value="12:12:12" placeholder="HH:mm:ss"> <br>'
		+		 'Tipo de medida:'      
		+					' <select name="type" >'
  		+						'<option value="user">Temperature</option>'
  		+						'<option value="brightness">Brightness</option>'
  		+ 						'<option value="pir">PIR</option>'
 		+ 						'<option value="humidity">Humidity</option>'
 		+						'<option value="todas">Todas</option>'
		+					'</select>'
		+				'<br>'
		+		 '<input type="submit" value="Send"/>'
		+		'</form>'
		+	'</body>'
		+'</html>'
		);
});

app.get('/check', function (req,res) {
	
	//Obtengo todos los parametros indicados en el formulario
	var mac = req.query.mac;
	var date1 = req.query.date1;
	var date2 = req.query.date2;
	var opcion = req.query.type;

	//Defino el esqueleto de las entradas

	var entrada = {mac_sensor: "",time: "",num_seq: "", time_ins: "", tipo: "", valor: ""};
	var respuesta = [];

	console.log(opcion);
	
	
	if (validate(mac,date1)){
		//Ahora aqui vamos a hacer la query y la conexión con el cliente cassandra
		const client = new cassandra.Client({ contactPoints: ['127.0.0.1'],
				      keyspace: 'integra' });
		var query;
		if (opcion == "todas"){query = 'SELECT * FROM medidas3'; }
		else{ query = "SELECT * FROM medidas3 WHERE tipo ='"+ opcion+"' ALLOW FILTERING";}
		//console.log("me conecte");
		
		 client.execute(query,  function (err, resultado) {
			//console.log(err);
		if (!err) {

				//console.log("Pase el error");
			if (resultado.rows.length > 0 ) {		
				for ( var i = 0 ; i < resultado.rows.length ; i ++) {
					for (var key in resultado.rows[i]){

						if (resultado.rows[i].hasOwnProperty(key)){
							entrada[key] = resultado.rows[i][key];
							console.log("Entrada"+entrada[key]);
							//console.log( key + " - > " + resultado.rows[i][key]);

							}
						}
						console.log("la entrada es : " + entrada.tipo);
						respuesta[i]=Object.assign({},entrada);
						//respuesta[i]=entrada;
						console.log("la respuesta es "+respuesta[i]["mac_sensor"]);
				 	  }			
			}

			console.log("La longitud del array es : "+respuesta.length);
			console.log(" Al menos la entrada es : " +respuesta[0]);


			//
			
			if (respuesta.length != 0){
				var contenido;
				contenido = '<table>'
							+'<tr>';
				for (var key in respuesta[0]) { 
					  contenido += '<th>';
					  contenido += key;
					  contenido += '</th>';
					}	 
				contenido += '</tr>';

				for (var k = 0; k < respuesta.length ; k++) { 
					contenido += '<tr>';
					for (var key in respuesta[k]){
						contenido += '<td>';
						contenido += respuesta[k][key];
						contenido += '</td>';
						console.log("EL ARRAY QUE ESTOY RECORRIENDO "+ respuesta[k][key]);

					}
					contenido += '</tr>';
				}
				contenido += '</table>';
			
			//console.log(contenido);
			res.send('<html>'
				+	'<body>'
				+		 mac +" esta es la MAC del sensor que vas a buscar <p>"
				+		 date1+" esta es la fecha que vas a buscar"
				+		 contenido
				+		 '<a href="/data"> try again </a>'
				+	'</body>'
				+'</html>'
				);
			}else{
				res.send('<html>'
				+	'<body>'
				+		 'No ha habido resultados, lo sentimos'
				+		 '<a href="/data"> try again </a>'
				+	'</body>'
				+'</html>'
				);

			}

		//Este else es por si ha habido un error
		}else {
					console.log("No results"); 
			 }	
	
		  });
		

		
	}else {
		res.send('<html>'
			+	'<body>'
			+		 'Por favor revisa el formato de los parametros'
			+		 '<a href="/data"> try again </a>'
			+	'</body>'
			+'</html>'
			);
	}

});


app.listen(8080);
