/*
 * Copyright (c) 2024 Your Company Name
 * All rights reserved.
 */

// Elementos del DOM
const carritoBtn = document.getElementById('carrito-btn');
const carritoContenedor = document.getElementById('carrito');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const listaCarrito = document.getElementById('lista-carrito');
const botonesAgregar = document.querySelectorAll('.boton-item');
const contadorCarrito = document.getElementById('contador-carrito');
const comprarBtn = document.getElementById('comprar-btn');

// Variables para almacenar el carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || {};  // Guardar carrito en localStorage para persistencia

// Función para mostrar el carrito
function mostrarCarrito() {
    listaCarrito.innerHTML = '';  // Limpiar lista

    if (Object.keys(carrito).length === 0) {
        listaCarrito.innerHTML = '<li>El carrito está vacío.</li>';
        return;
    }

    let total = 0;
    Object.keys(carrito).forEach((titulo) => {
        const producto = carrito[titulo];
        const li = document.createElement('li');
        li.innerHTML = `
            ${producto.titulo} - $${producto.precio} 
            <button class="restar-item" data-titulo="${titulo}">-</button>
            ${producto.cantidad} 
            <button class="sumar-item" data-titulo="${titulo}">+</button>
            = $${producto.precio * producto.cantidad}
            <button class="eliminar-item" data-titulo="${titulo}">Eliminar</button>
        `;
        listaCarrito.appendChild(li);
        total += producto.precio * producto.cantidad;
    });

    const descuento = calcularDescuento(total);
    const totalConDescuento = total - descuento;

    const totalElemento = document.createElement('li');
    totalElemento.textContent = `Total: $${total}`;
    listaCarrito.appendChild(totalElemento);

    if (descuento > 0) {
        const descuentoElemento = document.createElement('li');
        descuentoElemento.textContent = `Descuento: -$${descuento}`;
        listaCarrito.appendChild(descuentoElemento);

        const totalConDescuentoElemento = document.createElement('li');
        totalConDescuentoElemento.textContent = `Total con descuento: $${totalConDescuento}`;
        listaCarrito.appendChild(totalConDescuentoElemento);
    }

    // Mostrar mensaje de total sin descuento si no hay descuento
    if (descuento === 0) {
        const totalSinDescuento = document.createElement('li');
        totalSinDescuento.textContent = `Total sin descuento: $${total}`;
        listaCarrito.appendChild(totalSinDescuento);
    }

    contadorCarrito.textContent = Object.values(carrito).reduce((acc, producto) => acc + producto.cantidad, 0);

    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Mostrar/ocultar el carrito cuando se haga clic en el icono del carrito
carritoBtn.addEventListener('click', () => {
    carritoContenedor.classList.toggle('visible');
});

// Agregar productos al carrito
botonesAgregar.forEach(boton => {
    boton.addEventListener('click', agregarAlCarrito);
});

// Eliminar productos del carrito
listaCarrito.addEventListener('click', (event) => {
    if (event.target.classList.contains('eliminar-item')) {
        const titulo = event.target.getAttribute('data-titulo');
        eliminarProducto(titulo);
    }

    if (event.target.classList.contains('sumar-item')) {
        const titulo = event.target.getAttribute('data-titulo');
        sumarCantidad(titulo);
    }

    if (event.target.classList.contains('restar-item')) {
        const titulo = event.target.getAttribute('data-titulo');
        restarCantidad(titulo);
    }
});

// Vaciar el carrito
vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

// Función para agregar un producto al carrito
function agregarAlCarrito(event) {
    const boton = event.target;
    const item = boton.parentElement;
    const titulo = item.querySelector('.titulo-item').textContent;
    const precio = parseInt(item.querySelector('.precio-item').textContent.replace('$', ''));

    if (carrito[titulo]) {
        carrito[titulo].cantidad++;
    } else {
        carrito[titulo] = { titulo, precio, cantidad: 1 };
    }

    mostrarCarrito();
}

// Función para eliminar un producto del carrito
function eliminarProducto(titulo) {
    delete carrito[titulo];
    mostrarCarrito();
}

// Función para vaciar el carrito
function vaciarCarrito() {
    carrito = {};
    mostrarCarrito();
}

// Función para sumar la cantidad de un producto
function sumarCantidad(titulo) {
    carrito[titulo].cantidad++;
    mostrarCarrito();
}

// Función para restar la cantidad de un producto
function restarCantidad(titulo) {
    if (carrito[titulo].cantidad > 1) {
        carrito[titulo].cantidad--;
    } else {
        eliminarProducto(titulo);
    }
    mostrarCarrito();
}

// Función para calcular el descuento según el total
function calcularDescuento(total) {
    if (total >= 400000) {
        return total * 0.15;
    } else if (total >= 300000) {
        return total * 0.10;
    } else if (total >= 100000) {
        return total * 0.05;
    }
    return 0;
}

// Redirigir al usuario a la página de ingreso (ingrese.html) al hacer clic en "Comprar"
comprarBtn.addEventListener('click', () => {
    // Verificamos si el carrito tiene productos. Si no, mostramos un mensaje o redirigimos inmediatamente.
    if (Object.keys(carrito).length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de comprar.');
        return;
    }

    // Redirigir a la página de ingreso (ingrese.html)
    window.location.href = '/html/ingrese.html';  // REDIRIGE 

    // Mostrar carrito inicial
    mostrarCarrito();
});

// Función de búsqueda
function toggleSearch() {
    const searchInput = document.getElementById("search-input");
    searchInput.classList.toggle("show"); // Alterna la clase 'show' para mostrar/ocultar el input
}

 // Función para manejar el inicio de sesión
 function checkLogin() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let rememberMe = document.getElementById("rememberMe").checked;

    // Si el usuario quiere recordar sus datos, guardamos las cookies
    if (rememberMe) {
        setCookie("username", username, 30); // La cookie expira en 30 días
        setCookie("password", password, 30);
    } else {
        // Si no, eliminamos las cookies
        setCookie("username", "", -1);
        setCookie("password", "", -1);
    }

    // Aquí podrías agregar la validación para la autenticación real
    alert("Inicio de sesión exitoso");

    return false; // Prevenir el envío del formulario por defecto
}

// Función para guardar cookies
function setCookie(name, value, days) {
    let d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
    // Función para mostrar u ocultar el formulario de registro
    function toggleRegisterForm() {
        const registerForm = document.getElementById('registerForm');
        registerForm.style.display = (registerForm.style.display === 'none' || registerForm.style.display === '') ? 'block' : 'none';
    }
