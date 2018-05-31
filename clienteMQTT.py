#!/usr/bin/env py#!/usr/bin/env python
# -*- coding: utf-8 -*-

import paho.mqtt.client as mqtt
import time
import cql
from cassandra.cluster import Cluster

from pyasn1_modules import pem, rfc2459
from pyasn1.codec.der import decoder






#certificados
#tls = {
#  'ca_certs':"/etc/ssl/certs/ca-certificates.crt",
#  'tls_version':ssl.PROTOCOL_TLSv1
#}

# configuration

broker_address="138.4.11.164"

## connect ('keyspace')


cluster = Cluster()
session = cluster.connect('testdata')
print("me conecte")

##Session


#functions

# Handling messages
def on_message(client, userdata, message):




	print ("he decodificado")


	mensaje=str(message.payload.decode("utf-8")).split(';')
	message = message[0]

	print("message received " ,str(message.payload.decode("utf-8")))
	print("message topic=",message.topic)
	print("message qos=",message.qos)
	print("message retain flag=",message.retain)
	
	strings = str(message.payload.decode("utf-8")).split(';')
	
	print(strings)


	##Convertimos la información parseada en la query para insertar


	session.execute(
	    """
	    INSERT INTO integra (numse, medida,tiempo)
	    VALUES (%s, %s, %s)
	    """,
	    (strings[0], strings[1], float(strings[2]))
	)


# Creating a client istance
def on_connect( client, userdata, message):
	client.subscribe("W1/#")
	


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
client.subscribe ("W1/#")




client.loop_forever()


# Now we are going to create a function to manage the received message (on_message)

