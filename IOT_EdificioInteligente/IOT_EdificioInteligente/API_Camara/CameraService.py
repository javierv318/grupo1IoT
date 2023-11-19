# import libraries
import cv2
from matplotlib import pyplot as plt
# config pytesseractz
import pytesseract
from PIL import Image
# Json y tiempo para ensamblar paquetes
import json 
import time
# para procesamiento de datos
from collections import Counter
#Para servicios rests
import requests

#Configuraciones
urlServer = "https://fluffy-wasps-return.loca.lt"
urlEndpoint = "/GR1/controlAcceso"

#para mock
from random import randint


def agregarRegistro(jsonToSend):
    enpointRegistro = urlEndpoint + "/addRegistro/"
    sendRequest = requests.post(urlServer+enpointRegistro, json=jsonToSend)
    
    return sendRequest

#Llama la camara principal, captura la imagen y hace reconocimiento de caracteres para el texto
def procesarPlacaConCamara():
    print("DEBUG, Iniciando procesado con camara \n---\n")
    #inicializar camara web
    camera = cv2.VideoCapture(0)
    # tomar una frama de video de la camara

    imageFrames = []

    # tomar 7 muestras de la foto
    for x in range(7):
        ret, frame = camera.read()
        imageFrames.append(frame)
        
    #Convertir a escala de grises

    grayFrames = []

    for frame in imageFrames:
        grayFrames.append(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY))

    #Llamar a pytesseract e iterar sobre las framas a procesar

    ocrStrings = []

    for frameToProcess in grayFrames:
        tmpString = pytesseract.image_to_string(frameToProcess, config='--psm 12')
        ocrStrings.append(tmpString)

    choppedStrings = []
    # nota, por alguna razon cuando se hace el replace dentro del for anterior no funciona como deberia
    for strings in ocrStrings:
        returnString = strings.replace("\n", "")
        #shortedTest = tmpString.replace(" ", "")
        choppedStrings.append(returnString)


    #Revisamos que cadena se repite mas entre las 15 capturas, con la finalidad de minimizar falsos positivos por blur en la imagen 
    counterProm = Counter(choppedStrings)
    posiblePlaca = max(counterProm, key=counterProm.get)


    ### TEST DEBUG ###
    tmpObj = {"timeStamp": int(time.time()) , "placa": posiblePlaca}
    
    #JSON a enviar al servidor
    jsonToSend = json.dumps(tmpObj)

    resultRegistro = agregarRegistro(jsonToSend)
    #TODO Devolver JSON con resultados
    
    return posiblePlaca


def verificarPlaca(placa):
    
    placaAVerificar = str(placa)
    endpoint = urlServer + urlEndpoint+ "/verificarPlaca/"
    requestVerificacion = requests.get(endpoint+placa)

    return requestVerificacion

def agregarVehiculoAutorizado(autorizado):

    endpoint = urlServer + urlEndpoint+"/agregarVehiculo/"

    jsonAutorizado = {
        "nombreTitular": "El pepe",
    "apellidoTitular": "Rodriguez",
    "marcaVehiculo": "Chevrolet",
    "colorVehiculo": "Azul",
    "placa": "JJJ:933"
    }

    requestAddVehiculo = requests.post(endpoint, json=autorizado)


def getPlacaVehiculo():

    placa = procesarPlacaConCamara()
    print("DEBUG, finalizado procesado con camara \n---\n")
    permitido = ""
    try:
        permitido = str(verificarPlaca(placa))
    except:
        permitido = "error conectando con API"
    obj = {"placa":placa, "timeStamp": int(time.time()), "permitido":permitido}


    return obj

def getPlacaSimulada():
    placas = ['ABC-156', 'AAA-111', 'ZQP-199', 'LOL-223', 'CPS-208', 'JFT-989']

    index = randint(0,5)
    
    placa = placas[index]
    permitido = ""
    try:
        permitido = str(verificarPlaca(placa))
    except:
        permitido = "error conectando con API"
    obj = {"placa":placa, "timeStamp": int(time.time()), "permitido":permitido}


    return obj


