import pandas as pd
import serial
import numpy as np
import math

#--------------------------------------------------------------------

def cor(t): #formato de coordenadas DDMM.MMM a DD.DDDD
    l=(t/100)
    dd=round(l)
    mm=(l-dd)*100/60
    corde=dd+mm
    return corde

def sqrt(x): #raiz cuadrada
  return x**(1/2)

def pow(base,power): #potenciacion
  return base**power

def euclidean(x1,y1,x2,y2): #distancia euclideana
  return sqrt(pow((x1-x2),2)+pow((y1-y2),2))

def e_distance(X,Y,x,y): #punto mas cercano en el mapa
    #Calculamos las distancias
    e = {i:euclidean(X[i],Y[i],x,y) 
            for i in range(len(X))}
    #Minimizamos
    s2 = dict(sorted(e.items(), key=lambda item: item[1])) #Euclidiana
    #Obtenemos los valores minimos
    val2 = list(s2.keys())[0]
    return val2

def g_jordan(gjmatrix,m): #proceso de gauss jordan
    xi = [0 for i in range(m+1)]
    for i in range(m+1):
        if gjmatrix[i][i] == 0:
            print("Mathematical error!")
            return 0
        for j in range(m+1):
            if i!=j:
                ratio = gjmatrix[j][i]/gjmatrix[i][i]
                for k in range(m+2):
                    gjmatrix[j][k] = gjmatrix[j][k] - ratio*gjmatrix[i][k]
    for i in range(m+1):
        xi[i] = gjmatrix[i][m+1]/gjmatrix[i][i]
    return xi

dconst = 110647.63494361268
L,W = 0.695,0.545

def c_angle(x,y,ind): #angulo de giro
    #obtenemos 3 puntos por los que debe pasar el circulo
    ind10 = ind + 10 
    ind20 = ind + 20
    #cuando nos encontramos en los ultimos puntos del mapa
    if ind20 > len(x)-1: 
        ind20 = ind20 - len(x)
    if ind10 > len(x)-1:
        ind10 = ind10 - len(x)
    #aplicamos gauss-jordan
    gj_matrix = [[x[ind20],y[ind20],1,-(pow(x[ind20],2)+pow(y[ind20],2))],
    [x[ind10],y[ind10],1,-(pow(x[ind10],2)+pow(y[ind10],2))],
    [x[ind],y[ind],1,-(pow(x[ind],2)+ pow(y[ind],2))]]
    res = g_jordan(gj_matrix,2)
    #obtenemos el centro de la trayectoria circular
    h = -res[0]/2
    k = -res[1]/2
    r = sqrt(pow(h,2) + pow(k,2) - res[2])
    #geometria ackerman para obtener el angulo de las ruedas
    alpha = math.atan(L/(r*dconst - W/2))
    alpha = math.degrees(alpha)
    return alpha

def vcalc(alpha):
  alpha = abs(alpha)
  if round(alpha,1) == 0:
      vel = 5
  elif (alpha < 1):
      vel = 3
  elif (alpha < 2):
      vel = 2
  elif (alpha < 3):
      vel = 2
  elif (alpha >=3):
      vel = 1

  return vel

def sign(x):
  y = 0
  if x<0:
    y = -1
  elif x >= 0:
    y = 1
  return y

#------------------------------------------------------------------------------------

#leer datos
data = pd.read_csv("Circuito2.csv")
x = data.X
y = data.Y

gps = serial.Serial("COM6", baudrate = 9600) #puerto COM GPS
ard = serial.Serial("COM5",baudrate = 9600) #puerto COM Arduino
sa,la,lo,ind,alpha,beta,gama,prev_gama=0,0,0,0,0,0,0,0 #generando variables para latitud, longitud, satelites e indice del mapa

while True:

    line = str(gps.readline())
    if "$GPGGA" in line:
        data = line.split(",")
        latitud = data[2].strip()
        longitud = data[4].strip()
        satelites = data[7].strip()
        #Cambio a flotante
        sa=float(satelites)
        la=float(latitud)
        lo=float(longitud)

        ind = e_distance(x,y,cor(la),-(cor(lo)))
        ind10 = ind + 10
        ind20 = ind + 20
        if ind > len(x)-1:
            ind = ind - len(x)
        if ind20 > len(x)-1:
            ind20 = ind20 - len(x)
        if ind10 > len(x)-1:
            ind10 = ind10 - len(x)

        alpha = round(c_angle(x,y,ind),1)
        gama = round((alpha - beta)*1000)
        vel = vcalc(gama/1000)

        print(f"Posicion: {x[ind]},{y[ind]}")
        print(f"Angulo de Giro: {alpha}")
        print(f"gama = {alpha} - {beta} = {gama/1000}")
        print(f"Velocidad: {vel}")

        #correccion del delay del timon
        if sign(gama) != sign(prev_gama):
            if gama >= 0:
                gama = gama + 1200
            else:
                gama = gama - 1200

        
        if gama < 0 :
            cmd = f"a{vel}r{abs(gama)}"
        elif gama > 0:
            cmd = f"a{vel}l{abs(gama)}"
        else:
            cmd = f"a{vel}s"
        print(f"{cmd}\n")

        ard.write(cmd.encode('ascii'))

        beta = alpha
        prev_gama = gama

'''        #imprimir datos leido
        print(f"Latitud: {cor(la)}, Longitud: {cor(lo)}, # de satelites: {sa}")
        print(f"Punto mas cercano: {ind} ({x[ind]},{y[ind]})")
        print(f"Angulo de giro: {alpha}")
'''
 #CTRL + C salir del bucle