let productos = [];

fetch("./js/productos.json")
.then(response => response.json())
.then(data => {
    productos = data;
    cargarProductos(productos);
})

const contenedorProductos = document.getElementById("contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.getElementById("titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

const cargarProductos = (productosElegidos) => {

    //  Agrego esto para la función lo primero que haga sea vaciar el contenedor.
    contenedorProductos.innerHTML = ``;

    productosElegidos.forEach((producto) => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button id="${producto.id}" class="producto-agregar">Agregar</button>
            </div>
        `;
        contenedorProductos.append(div);
    })
    
    actualizarBotonesAgregar();
}

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active"));

        e.currentTarget.classList.add("active");

        if( e.currentTarget.id != "todos" ){
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id)
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;

            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        }else{
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        };
    });
})

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if(productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito =[];
}

function agregarAlCarrito(e) {

    Toastify({
        text: `PRODUCTO AGREGADO AL CARRITO`,
        duration: 3000,
        gravity: "top", 
        position: "center", 
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, rgb(248, 158, 56), rgb(216, 146, 99))",
          borderRadius: "1rem",
          color: "black",
          fontSize: ".8rem",
        },
        onClick: function(){} // Callback after click
      }).showToast();
      
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }    
    actualizarNumerito(); 

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}