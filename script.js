
/* =====================================
   CONFIGURACIÓN INICIAL
===================================== */

// Obtener elementos del HTML

const catalogoProductos = document.getElementById("catalogo-productos");

const listaCarrito = document.getElementById("lista-carrito");

const contadorProductos = document.getElementById("contador-productos");

const cantidadCatalogo = document.getElementById("cantidad-catalogo");

const totalCompra = document.getElementById("total-compra");

const totalUnidades = document.getElementById("total-unidades");

const botonVaciar = document.getElementById("btn-vaciar");

const notificacion = document.getElementById("notificacion");


// Configurar formato de moneda

const formatoMoneda = new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD"
});


// Recuperar carrito guardado

let carrito = cargarCarrito();


// Variable para controlar las notificaciones

let temporizadorNotificacion;


/* =====================================
   MOSTRAR CATÁLOGO
===================================== */

function mostrarCatalogo() {

    // Limpiar catálogo anterior

    catalogoProductos.innerHTML = "";

    // Mostrar cantidad de productos disponibles

    cantidadCatalogo.textContent =
        productos.length + " productos";

    // Recorrer catálogo

    productos.forEach(function(producto) {

        // Crear tarjeta

        const tarjeta = document.createElement("article");

        tarjeta.classList.add("product-card");

        // Crear imagen

        const imagen = document.createElement("img");

        imagen.classList.add("product-image");

        imagen.src = producto.imagen;

        imagen.alt = producto.nombre;

        imagen.loading = "lazy";

        imagen.addEventListener("error", function() {
            imagen.removeAttribute("src");
            imagen.alt = "Imagen no disponible";
        });

        // Crear contenido de tarjeta

        const detalles = document.createElement("div");

        detalles.classList.add("product-details");

        // Categoría

        const categoria = document.createElement("span");

        categoria.classList.add("product-category");

        categoria.textContent = producto.categoria;

        // Nombre

        const nombre = document.createElement("h3");

        nombre.textContent = producto.nombre;

        // Descripción

        const descripcion = document.createElement("p");

        descripcion.classList.add("product-description");

        descripcion.textContent = producto.descripcion;

        // Contenedor inferior

        const inferior = document.createElement("div");

        inferior.classList.add("product-bottom");

        // Precio

        const precio = document.createElement("span");

        precio.classList.add("product-price");

        precio.textContent = formatoMoneda.format(producto.precio);

        // Botón agregar

        const botonAgregar = document.createElement("button");

        botonAgregar.type = "button";

        botonAgregar.classList.add("btn-add");

        botonAgregar.textContent = "Agregar +";

        botonAgregar.addEventListener("click", function() {

            agregarAlCarrito(producto.id);

        });

        // Organizar elementos

        inferior.appendChild(precio);

        inferior.appendChild(botonAgregar);

        detalles.appendChild(categoria);

        detalles.appendChild(nombre);

        detalles.appendChild(descripcion);

        detalles.appendChild(inferior);

        tarjeta.appendChild(imagen);

        tarjeta.appendChild(detalles);

        catalogoProductos.appendChild(tarjeta);

    });

}


/* =====================================
   AGREGAR AL CARRITO
===================================== */

function agregarAlCarrito(id) {

    // Buscar producto en el catálogo

    const productoExiste = productos.find(function(producto) {
        return producto.id === id;
    });

    // Verificar que el producto exista

    if (!productoExiste) {
        return;
    }

    // Buscar si ya está en el carrito

    const productoEnCarrito = carrito.find(function(item) {
        return item.id === id;
    });

    if (productoEnCarrito) {

        // Aumentar cantidad si ya existe

        if (productoEnCarrito.cantidad >= 99) {
            mostrarNotificacion("Máximo 99 unidades por producto.");
            return;
        }

        productoEnCarrito.cantidad++;

    } else {

        // Agregar nuevo producto al carrito

        carrito.push({
            id: id,
            cantidad: 1
        });

    }

    // Guardar y actualizar

    guardarCarrito();

    mostrarCarrito();

    mostrarNotificacion("Producto agregado al carrito.");

}


/* =====================================
   MOSTRAR CARRITO
===================================== */

function mostrarCarrito() {

    // Limpiar lista

    listaCarrito.innerHTML = "";

    // Verificar si el carrito está vacío

    if (carrito.length === 0) {

        const mensaje = document.createElement("p");

        mensaje.classList.add("empty-message");

        mensaje.textContent =
            "Tu carrito está vacío. Agrega productos del catálogo.";

        listaCarrito.appendChild(mensaje);

    } else {

        // Recorrer productos seleccionados

        carrito.forEach(function(item) {

            // Buscar información en el catálogo

            const producto = productos.find(function(elemento) {
                return elemento.id === item.id;
            });

            // Crear fila del carrito

            const fila = document.createElement("article");

            fila.classList.add("cart-item");

            // Información del producto

            const informacion = document.createElement("div");

            informacion.classList.add("cart-product-info");

            const nombre = document.createElement("h3");

            nombre.textContent = producto.nombre;

            const detalle = document.createElement("p");

            detalle.textContent =
                formatoMoneda.format(producto.precio) + " por unidad";

            informacion.appendChild(nombre);

            informacion.appendChild(detalle);

            // Controles de cantidad

            const acciones = document.createElement("div");

            acciones.classList.add("cart-item-actions");

            const controlCantidad = document.createElement("div");

            controlCantidad.classList.add("quantity-control");

            // Botón disminuir

            const botonMenos = document.createElement("button");

            botonMenos.type = "button";

            botonMenos.classList.add("btn-quantity");

            botonMenos.textContent = "−";

            botonMenos.setAttribute(
                "aria-label",
                "Disminuir cantidad de " + producto.nombre
            );

            botonMenos.addEventListener("click", function() {

                cambiarCantidad(item.id, -1);

            });

            // Mostrar cantidad

            const cantidad = document.createElement("span");

            cantidad.classList.add("quantity-value");

            cantidad.textContent = item.cantidad;

            // Botón aumentar

            const botonMas = document.createElement("button");

            botonMas.type = "button";

            botonMas.classList.add("btn-quantity");

            botonMas.textContent = "+";

            botonMas.setAttribute(
                "aria-label",
                "Aumentar cantidad de " + producto.nombre
            );

            botonMas.addEventListener("click", function() {

                cambiarCantidad(item.id, 1);

            });

            // Organizar controles

            controlCantidad.appendChild(botonMenos);

            controlCantidad.appendChild(cantidad);

            controlCantidad.appendChild(botonMas);

            // Calcular subtotal del producto

            const subtotal = document.createElement("span");

            subtotal.classList.add("cart-item-price");

            subtotal.textContent = formatoMoneda.format(
                producto.precio * item.cantidad
            );

            // Botón eliminar

            const botonEliminar = document.createElement("button");

            botonEliminar.type = "button";

            botonEliminar.classList.add("btn-delete");

            botonEliminar.textContent = "Eliminar";

            botonEliminar.addEventListener("click", function() {

                eliminarDelCarrito(item.id);

            });

            // Organizar fila

            acciones.appendChild(controlCantidad);

            acciones.appendChild(subtotal);

            acciones.appendChild(botonEliminar);

            fila.appendChild(informacion);

            fila.appendChild(acciones);

            listaCarrito.appendChild(fila);

        });

    }

    // Actualizar información general

    calcularTotal();

    actualizarContador();

    // Mostrar botón vaciar solamente cuando hay productos

    botonVaciar.hidden = carrito.length === 0;

}


/* =====================================
   CAMBIAR CANTIDAD
===================================== */

function cambiarCantidad(id, cambio) {

    // Buscar producto en el carrito

    const producto = carrito.find(function(item) {
        return item.id === id;
    });

    if (!producto) {
        return;
    }

    // Modificar cantidad

    producto.cantidad += cambio;

    // Eliminar si la cantidad llega a cero

    if (producto.cantidad <= 0) {

        carrito = carrito.filter(function(item) {
            return item.id !== id;
        });

    }

    // Limitar cantidad máxima

    if (producto.cantidad > 99) {

        producto.cantidad = 99;

        mostrarNotificacion("Máximo 99 unidades por producto.");

    }

    // Guardar y actualizar

    guardarCarrito();

    mostrarCarrito();

}


/* =====================================
   ELIMINAR PRODUCTO DEL CARRITO
===================================== */

function eliminarDelCarrito(id) {

    // Conservar todos los productos excepto el seleccionado

    carrito = carrito.filter(function(item) {
        return item.id !== id;
    });

    // Guardar y actualizar

    guardarCarrito();

    mostrarCarrito();

    mostrarNotificacion("Producto eliminado del carrito.");

}


/* =====================================
   CALCULAR TOTAL
===================================== */

function calcularTotal() {

    // Calcular sumatoria de todos los productos

    const total = carrito.reduce(function(acumulado, item) {

        const producto = productos.find(function(elemento) {
            return elemento.id === item.id;
        });

        return acumulado + (producto.precio * item.cantidad);

    }, 0);

    // Mostrar total

    totalCompra.textContent = formatoMoneda.format(total);

    return total;

}


/* =====================================
   ACTUALIZAR CONTADOR
===================================== */

function actualizarContador() {

    // Sumar cantidades de todos los productos

    const cantidad = carrito.reduce(function(total, item) {

        return total + item.cantidad;

    }, 0);

    // Actualizar encabezado

    contadorProductos.textContent = cantidad;

    // Actualizar resumen

    totalUnidades.textContent = cantidad;

}


/* =====================================
   GUARDAR CARRITO
===================================== */

function guardarCarrito() {

    localStorage.setItem(
        "minishop_carrito",
        JSON.stringify(carrito)
    );

}


/* =====================================
   RECUPERAR CARRITO
===================================== */

function cargarCarrito() {

    try {

        const datosGuardados = localStorage.getItem(
            "minishop_carrito"
        );

        const datos = datosGuardados
            ? JSON.parse(datosGuardados)
            : [];

        if (!Array.isArray(datos)) {
            return [];
        }

        // Validar productos guardados

        const carritoValido = datos.filter(function(item) {

            return (
                item !== null &&
                Number.isSafeInteger(item.id) &&
                Number.isInteger(item.cantidad) &&
                item.cantidad >= 1 &&
                item.cantidad <= 99 &&
                productos.some(function(producto) {
                    return producto.id === item.id;
                })
            );

        });

        // Evitar productos repetidos en el almacenamiento

        const carritoUnico = new Map();

        carritoValido.forEach(function(item) {

            const cantidadActual = carritoUnico.get(item.id) || 0;

            carritoUnico.set(
                item.id,
                Math.min(cantidadActual + item.cantidad, 99)
            );

        });

        return Array.from(carritoUnico, function([id, cantidad]) {

            return {
                id: id,
                cantidad: cantidad
            };

        });

    } catch (error) {

        console.error("Error al recuperar el carrito:", error);

        return [];

    }

}


/* =====================================
   VACIAR CARRITO
===================================== */

function vaciarCarrito() {

    if (carrito.length === 0) {
        return;
    }

    const confirmar = confirm(
        "¿Estás seguro de que deseas vaciar todo el carrito?"
    );

    if (confirmar) {

        carrito = [];

        guardarCarrito();

        mostrarCarrito();

        mostrarNotificacion("Carrito vaciado correctamente.");

    }

}


/* =====================================
   MOSTRAR NOTIFICACIONES
===================================== */

function mostrarNotificacion(mensaje) {

    // Mostrar mensaje

    notificacion.textContent = mensaje;

    notificacion.classList.add("show");

    // Evitar que se acumulen temporizadores

    clearTimeout(temporizadorNotificacion);

    // Ocultar después de 2.5 segundos

    temporizadorNotificacion = setTimeout(function() {

        notificacion.classList.remove("show");

    }, 2500);

}


/* =====================================
   EVENTOS
===================================== */

// Evento para vaciar el carrito

botonVaciar.addEventListener("click", vaciarCarrito);


/* =====================================
   INICIAR APLICACIÓN
===================================== */

// Mostrar catálogo y carrito al abrir la página

mostrarCatalogo();

mostrarCarrito();
