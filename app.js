var express = require('express');
const cassandra = require('cassandra-driver');
var app = express();




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
		+		'<form method="get" action="/check">'
		+		 'Mac-Address: <input type="text" name="mac" value="AA:AA:AA:AA"><br>'
		+		 'Date:        <input type="text" name="date1" value="11:11:11" placeholder="HH:mm:ss">'
		+		 'To: <input type="text" name="date2" value="12:12:12" placeholder="HH:mm:ss"> <br>'
		+		 'Tipo de medida:'      
		+					' <select name="type" >'
  		+						'<option value="temperature">Temperature</option>'
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
						//console.log("la respuesta es "+respuesta[i]["mac_sensor"]);
				 	  }			
			}

			//console.log("La longitud del array es : "+respuesta.length);
			//console.log(" Al menos la entrada es : " +respuesta[0]);


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
				+		 '<a href="/"> try again </a>'
				+	'</body>'
				+'</html>'
				);
			}else{
				res.send('<html>'
				+	'<body>'
				+		 'No ha habido resultados, lo sentimos'
				+		 '<a href="/"> try again </a>'
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
			+		 '<a href="/"> try again </a>'
			+	'</body>'
			+'</html>'
			);
	}

});


app.listen(8080);
