# FICOHSA BACKEND TEST

En este repositorio encontraras la solución Backend a la prueba enviada por ficohsa via email.
Este ejercicio incluye construir un aplicativo en Node.js usando la libreria express que respondera con REST API y está integrado a una base de datos Mongo.

## COMO ACCEDER

La url base del aplicativo en cloud es la siguiente:
(https://ficohsadev.uw.r.appspot.com)


## DESPLIEGUE

En esta sección encontrarás detalles en como desplegar este aplicativo

### Requerimientos

El ejercicio requiere tener instalado [Node.js](https://nodejs.org/en/). Se recomienda usar la versión 18.x.

### Librerias usadas

- pm2
- mongoose
- body-parser
- dotenv
- express
- joi
- nodemon (dev)

### Pasos

Lo primero que debes hacer es clonar este repositorio en una carpeta local en tu computador.

Una vez hayas hecho esto instala las dependencias con el siguiente comando:
```
npm install
```

Tambien puedes instalar (como opcional) la libreria pm2 globalmente. Esto es para crear diferentes clusters en tu computador local
```
npm install -g pm2
```

Una vez tengas las dependencias instaladas, debes crear un archivo .env. Puedes usar de referencia el archivo .env.example que se encuentra en este repositorio.
**DEBES** reemplazar todos los valores en este archivo .env

El último paso a seguir es ejecutar los siguientes comandos (Dependiendo de lo que necesites):
```
# Creara 4 clusters con pm2
npm start
# Corre Node con una unica instancia
npm run local
# Ambiente de desarrollo
npm run dev
```

Si inicias el aplicativo con la libreria pm2 (o el comando *npm start*) encontrarás los siguientes comandos utiles:
```
# Detener clusters
pm2 stop app
# Borrar clusters
pm2 delete app
```

## NOTAS TECNICAS

En esta sección encontraras las notas tecnicas de este aplicativo

### API ENDPOINTS

Lista de API ENDPOINTS:
- **POST** /mutant : Revisa si el codigo DNA (matriz) tiene mutaciones (body: { "dna": [][] String})
- **GET** /stats : Retorna las estadisticas del conteo de humanos y mutantes que se han revisado via POST /mutant

## NOTAS ADICIONALES

En esta sección encontrarás notas adicionales de este test

### Retos de concurrencia

Después de leer el reto pense sobre los problemas de concurrencia en diferentes niveles (App y bases de datos).
En cuanto al aplicativo se puede escalar horizontal y verticalmente con las herramientas en la nube. Este nivel es mucho más fácil de solucionar que la concurrencia a nivel de bases de datos.
Encontré diferentes acercamientos a la solución para este útlimo. Los detallo en esta misma sección.

#### Conteos

Se puede llevar el conteo en un simple documento en una colección (usando mongo) dentro de la base de datos (ex: {count_mutant: 0, count_human: 0, ratio: 0}).
Cuando varios request son solicitados en un mismo momento (alta concurrencia) este documento puede no ser actualizado correctamente y no reflejará las estadisticas correctas (Algunas transacciones pueden perderse debido a que la propiedad en diferentes request pueden ser actualizadas al mismo tiempo).
Para resolver este problema se puede usar la opcion Optimistic concurrency con la libreria mongoose.
Esta opción le dira a mongoDB que puede actualizar el documento si y solo si la propiedad __v (version) es la anterior a la que se va a actualizar (Ex: __v: 1 => __v: 2). De alguna manera es como bloquear un recurso dentro de la base de datos (Similar a lo que hacen las SQL DB)
Si la version no coincide con la anterior, mongo arrojará un error y este puede ser manejado en los controladores del aplicativo y no guardar el resultado del conteo, retornandole al usuario final un mensaje de error (Ex: {message: "Try it again!"} )

Esto resolvera el problema de tener el número correcto de la estadistica en la base de datos, pero a alta concurrencia de llamados puede estar arrojando errores al usuario final.


#### Guardar resultados en documentos diferentes (**Este es usado en la solución desarrollada**)

Por cada POST request en validación de mutaciones decidi guardar un documento con una unica propiedad dentro de una colección ({isMutant: boolean}).
Ahora cada vez que se solicite la estadistica el aplicativo (a nivel de base de datos) deberá contar los documentos filtrados.
El problema ahora es que a través del tiempo se pueden guardar muchos resultados en la base de datos e incurrir en costos adicionales a nivel de infraestructura.


#### Arquitectura por eventos

Guardar un unico documento para almacenar el conteo de las estadisticas y asegurar que este refleje el numero correcto de transacciones realizadas.
Pense en integrar herramientas de mensajeria (Como pub/sub o kafka) para encolar los resultados de la validaciópn de and y procesarlos como si fueran una cola (Queue) (Esto garantiza que la no haya sobreescritura en un unico documento en la base de datos)


#### MEzcla entre guardar resultados y estadisticas

Usando dos colecciones diferentes (Una para guardar la estadistica y otra para guardar los resultados de las transacciones) se puede garantizar el número correcto de validaciones de dna y la concurrencia.

Por cada validacion se guardara el resultado en una coleccion como historial y cada vez que el aplicativo sea actualizado (o mediante CRON JOBS) se puede actualizar el numero de estadisticas contando los resultados del historial guardado hasta ese momento. Una vez realizado esto se procede a eliminar el historial actual.

Esto garantiza que no muchos resultados serán guardados en la base de datos a ravés del tiempo. El aplicativo backend debe cambiarse para reflejar la estadistica correcta (Conteo de estadistica + historial actual filtrado por status)


