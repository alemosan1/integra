#!/usr/bin/env py#!/usr/bin/env python
# -*- coding: utf-8 -*-

import paho.mqtt.client as mqtt
import time
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
session = cluster.connect('integrando')
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
	modo = 1
	num_seq_pir = 0
	num_seq_brightness = 0
	#TODO mejorar la funcion s_time	
	envio ="""
                            INSERT INTO medidas3 (mac_sensor, time, tipo, valor, num_seq, time_ins)
                            VALUES (%s_mac, %s_time,%s_tipo, %s_valor, %s_numseq,toTimestamp(now()))
                       """

	# Aqui hago un replace para insertar los valores que he recibido en el mensaje
	# En string [0] viene el valor de la medida
	# En string [1] viene el numero de secuencia
	# En string [2] viene el tiempo

	
        envio = envio.replace('%s_valor',strings[0][1:])                          
       

	#TODO aqui tengo que coger la MAC del topi y sustituirla aqui de alguna manera también
	
	envio = envio.replace('%s_mac','\'198.3.4.5\'')

	if tipo.find("temperature") is not -1 :
              
                                                    
                envio = envio.replace('%s_tipo','\'temperature\'')
		envio = envio.replace('%s_numseq',strings[1])
		envio = envio.replace('%s_time',"'"+strings[2])
		
		
                                      

	if tipo.find("humidity") is not -1 :

 		envio = envio.replace('%s_tipo','\'humidity\'')
		envio = envio.replace('%s_numseq',strings[1])
		envio = envio.replace('%s_time',"'"+strings[2])

	if tipo.find("pir") is not -1 :

		num_seq_pir += 1
		envio = envio.replace('%s_tipo','\'pir\'')
		envio = envio.replace('%s_numseq',str(num_seq_pir))
		envio = envio.replace('%s_time',"\'"+strings[1])

	if tipo.find("brightness") is not -1 :
		num_seq_brightness += 1
		envio = envio.replace('%s_tipo','\'brightness\'')
		envio = envio.replace('%s_numseq',str(num_seq_brightness))		
		envio = envio.replace('%s_time',"'"+strings[1])	
	

	print(envio)
       	session.execute(envio)    
#	    session.execute(
#	        """
#	        INSERT INTO medidas2 (mac_sensor, time, tipo, valor, num_seq, time_ins)
#	        VALUES (%s, %s, %s, %s, %s)
#	     """,
#	     ("192.3.4.5","now()",tipo, float(strings[0]),int(strings[1]),"toTimestamp(now())")
#	    )

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
client.subscribe ("#")




client.loop_forever()


# Now we are going to create a function to manage the received message (on_message)

