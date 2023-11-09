
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
  
        data = "hello world"
        return jsonify({'data': data}) 
  
  
# A simple function to calculate the square of a number 
# TODO borrar
@app.route('/home/<int:num>', methods = ['GET']) 
def disp(num): 
  
    return jsonify({'data': num**2}) 
  

# A function in charge of taking the photograph 
@app.route('/jetson/getPlaca', methods = ['GET'])
def getPlaca():
    tmpPlaca = getPlacaVehiculo()
    return jsonify({'Placa':tmpPlaca})

  
# driver function 
if __name__ == '__main__': 
  
    app.run(debug = True) 
