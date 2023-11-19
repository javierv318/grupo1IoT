
# Using flask to make an api 
# import necessary libraries and functions 
from flask import Flask, jsonify, request 
# importa camera service methods
from CameraService import *
  
# creating a Flask app 
app = Flask(__name__) 
  
# on the terminal type: curl http://127.0.0.1:5000/ 
# returns hello world when we use GET. 
# returns the data that we send when we use POST. 
@app.route('/', methods = ['GET', 'POST']) 
def home(): 
    if(request.method == 'GET'): 
  
        data = "API Camara reconocimiento v1"
        return jsonify({'data': data}) 
  
  
# Funcion a cargo de tomar la placa y devolverla
@app.route('/jetson/getPlaca', methods = ['GET'])
def getPlaca():
    infoVehiculo = getPlacaVehiculo()
    print("DEBUG - infoVehiculo : " + str(infoVehiculo), flush=True)
    return infoVehiculo

# endpoint para llamar placa entre valores predefinidos, por si falla la camara
@app.route('/jetson/getPlacaSim', methods = ['GET'])
def getPlacaSim():
    infoVehiculo = getPlacaSimulada()
    print("DEBUG - infoVehiculo : " + str(infoVehiculo), flush=True)
    return infoVehiculo


  
# driver function 
if __name__ == '__main__': 
  
    app.run(host='0.0.0.0',debug = True) 
