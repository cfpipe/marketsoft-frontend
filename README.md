# Actividad colaborativa N.º 2: Taller integrador — Frontend SPA del supermercado

## Propósito

Desarrollar una aplicación de página única (*Single Page Application*, SPA) con React que consuma la API REST construida en la actividad 1. La aplicación permitirá realizar operaciones de creación, consulta, actualización y eliminación (CRUD) mediante una interfaz diseñada con Bootstrap.

## Integrantes y responsabilidades

| Integrante | Responsabilidades |
|---|---|
| **Cristian Felipe Barreto** | Creación del repositorio, definición de la arquitectura del frontend e implementación del CRUD de productos y proveedores. |
| **Juan Camilo Giraldo A.** | Implementación de las funcionalidades correspondientes a usuarios, ventas y detalles de venta; integración de los componentes desarrollados; mejora de la interfaz con Bootstrap y realización de pruebas de la aplicación. |

## Instrucciones para ejecutar y probar la aplicación

### 1. Descargar los proyectos

Clonar o descargar los repositorios del **frontend** y del **backend** desarrollado en la actividad 1.

### 2. Configurar las variables de entorno

Crear el archivos `.env`  y configurar las variables de entorno correspondientes, incluida la conexión con la base de datos. Estos archivos están incluidos en GitHub, por lo que cada persona que realice las pruebas deberá crearlos en su entorno local.

### 3. Iniciar la base de datos y el backend

Verificar que la base de datos esté disponible e iniciar el backend . La API debe estar en ejecución para que el frontend pueda consultar y modificar la información.

### 4. Instalar las dependencias del frontend

Abrir una terminal en la carpeta raíz del frontend y ejecutar:

```bash
npm install
```

### 5. Iniciar el frontend

Una vez instaladas las dependencias, ejecutar:

```bash
npm run dev
```

Abrir en el navegador la dirección local que indique la terminal.

### 6. Probar las funcionalidades

Verificar las operaciones de creación, consulta, actualización y eliminación disponibles para productos, proveedores, usuarios, ventas y detalles de venta. Comprobar que los cambios se reflejen correctamente en la interfaz y en la base de datos.

### 7. Arquitectura

El proyecto utiliza una arquitectura cliente-servidor, el fronted esta construido con React y separa las pagina, servicios y estilos. el React Router control la navegacion y Axios permite comunicarse con la API
