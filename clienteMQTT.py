#!/usr/bin/env py#!/usr/bin/env python
# -*- coding: utf-8 -*-

import paho.mqtt.client as mqtt
import time
import cql
import uuid
from cassandra.cluster import Cluster







#certificados
#tls = {
#  'ca_certs':"/etc/ssl/certs/ca-certificates.crt",
#  'tls_version':ssl.PROTOCOL_TLSv1
#}

# configuration

broker_address="138.4.11.164"

## connect ('keyspace')


cluster = Cluster()
session = cluster.connect('integra')
print("me conecte")

##Session


#functions

# Handling messages
def on_message(client, userdata, message):



	print("message received " ,str(message.payload.decode("utf-8")))
	print("message topic=",message.topic)
	print("message qos=",message.qos)
	print("message retain flag=",message.retain)
	
	strings = str(message.payload.decode("utf-8")).split(';')
	
	print(strings)
	ID = str(uuid.uuid4())
	
	print (message.topic)

	##Convertimos la información parseada en la query para insertar
	
	#Aqui vamos a sacar información del topic, interesante para la base de datos
	
	tipo = str(message.topic)
	if tipo.find("temperature") is not -1 :
		tipo = "temperature"
			
	# En string [0] viene el valor de la medida
	# En string [1] viene el numero de secuencia
	# En string [2] viene el tiempo
	session.execute(
	    """
	    INSERT INTO measures (uuid, mac_sensor,tiempo,tipo,valor)
	    VALUES (%s, %s, %s, %s, %s)
	    """,
	    (ID,"192.3.4.5",strings[2], tipo, float(strings[0]))
	)
	


# Creating a client istance
def on_connect( client, userdata, message):
	client.subscribe("hola/#")
	


#Configuracion



#cliente general
#Client(client_id=””, clean_session=True, userdata=None, protocol=MQTTv311, transport=”tcp”)

client=mqtt.Client()
client.on_message=on_connect
client.on_message=on_message

client.connect(broker_address)

# Connecting to a broker or Server
# general command : connect(host, port=1883, keepalive=60, bind_address="")

client.connect(broker_address)




print ("Subscribiendome al topic ")


# Aqui pongo al topic que me quiero subscribir 
client.subscribe ("/hola/temperature")




client.loop_forever()


# Now we are going to create a function to manage the received message (on_message)

