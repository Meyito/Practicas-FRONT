# API Restful de la Aplicación PILI

[![Github Issues](https://img.shields.io/github/issues/Meyito/Practicas-FRONT.svg)](http://github.com/Meyito/Practicas-FRONT/issues)

La aplicación fue desarrollada con [AngularJS](https://angularjs.org/).

## Requisitos

- [NodeJS >= v4.x.x](https://nodejs.org/en/)
- [Bower >= v1.7.x](https://bower.io/)
- [Gulp >= v3.x](http://gulpjs.com/)


## Instalación

### Instalar dependencias 
- Node
```
npm install
```

- Bower
```
bower install
```

### Variables de entorno y configuración
- Cambiar la linea 5 del archivo `src/modules/common/constants.js` por la dirección real en la que se encuentra desplegado el Backend de la aplicación. A esta ruta se dirigirán todas las peticiones realizadas.


## Compilar la Aplicación
- En la raiz del proyecto ejecutar el siguiente comando 
```
gulp buildAssets
```

Esta instrucción compilará todos los archivos y los unificará en la carpeta `dist`.

- Para desarrollo ejecutar únicamente
```
gulp
```
Esta instrucción compilará todos los archivos, los unificará en la carpeta `dist` y montará un servidor de pruebas en `http://localhost:9000/#/`.


## Despliegue de la Aplicación
Para realizar el despliegue de la aplicación solo es necesario copiar la carpeta `dist` al servidor.
