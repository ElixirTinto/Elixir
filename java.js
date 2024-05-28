document.addEventListener("DOMContentLoaded", function() {
    // Función para obtener el carrito desde localStorage
    function getCartItemsFromStorage() {
        const storedCart = localStorage.getItem("cartItems");
        return storedCart ? JSON.parse(storedCart) : {};
    }

    // Función para guardar el carrito en localStorage
    function saveCartToStorage(cartItems) {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

    // Mostrar detalles del producto al hacer clic en la imagen del producto
    const productImages = document.querySelectorAll(".product-card img");

    productImages.forEach(image => {
        image.addEventListener("click", function(event) {
            const card = this.closest(".product-card");
            const title = card.getAttribute("data-title");
            const details = card.getAttribute("data-details");
            const imageUrl = this.getAttribute("src");

            document.querySelector(".modal-title").textContent = title;
            document.querySelector(".modal-details").textContent = details;
            document.querySelector(".modal-image").setAttribute("src", imageUrl);

            document.querySelector(".product-modal").style.display = "block";
            event.stopPropagation(); // Evitar que el clic se propague al contenedor de productos
        });
    });

    // Cerrar modal al hacer clic en el botón de cerrar
    document.querySelector(".close-modal").addEventListener("click", function() {
        document.querySelector(".product-modal").style.display = "none";
    });

    // Agregar evento de clic para cerrar el modal haciendo clic fuera de él
    window.addEventListener("click", function(event) {
        const modal = document.querySelector(".product-modal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Mostrar botón "Agregar al carrito" con efecto hover
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

    addToCartButtons.forEach(button => {
        button.addEventListener("mouseenter", function() {
            this.style.transform = "scale(1.2)";
        });

        button.addEventListener("mouseleave", function() {
            this.style.transform = "scale(1)";
        });

        button.addEventListener("click", function(event) {
            event.stopPropagation(); // Evitar que el clic se propague al contenedor de productos
            const productTitle = this.parentElement.parentElement.getAttribute("data-title");
            const productPrice = parseFloat(this.parentElement.parentElement.getAttribute("data-price"));
            const quantityInput = this.parentElement.parentElement.querySelector(".quantity-input");
            const quantity = parseInt(quantityInput.value);
            addToCart(productTitle, productPrice, quantity);
        });
    });

    // Variables para almacenar los productos agregados al carrito
    let cartItems = getCartItemsFromStorage();

    // Agregar productos al carrito
    function addToCart(title, price, quantity) {
        if (cartItems[title]) {
            cartItems[title].quantity += quantity;
            cartItems[title].total += price * quantity;
        } else {
            cartItems[title] = { quantity: quantity, total: price * quantity };
        }
        saveCartToStorage(cartItems);
        updateCartTotal();

        // Actualizar la cantidad de productos en el carrito en el header
        const cartItemCount = document.querySelector(".content-shopping-cart .number");
        const totalItemsInCart = Object.values(cartItems).reduce((acc, item) => acc + item.quantity, 0);
        cartItemCount.textContent = `(${totalItemsInCart})`;
    }

    // Eliminar producto del carrito
    function removeFromCart(title) {
        if (cartItems[title]) {
            cartItems[title].quantity--;
            if (cartItems[title].quantity === 0) {
                delete cartItems[title];
            } else {
                cartItems[title].total -= cartItems[title].price;
            }
            saveCartToStorage(cartItems);
            updateCartTotal();
        }
    }

    // Actualizar el total del carrito
    function updateCartTotal() {
        const cartTotalElement = document.getElementById("cart-total");
        const total = Object.values(cartItems).reduce((acc, item) => acc + item.total, 0);
        cartTotalElement.textContent = total.toLocaleString('es-CO'); // Mostrar el total con puntos y comas
    }

    // Mostrar el detalle de los productos al hacer clic en "Ver compra"
    document.getElementById("view-cart").addEventListener("click", function(event) {
        event.preventDefault(); // Evitar que el enlace cambie de página

        let popupContent = "<h2>Detalle de la compra:</h2>";

        Object.entries(cartItems).forEach(([title, item], index) => {
            popupContent += `<p>${title} x${item.quantity} - $${item.total.toLocaleString('es-CO')}</p>`; // Mostrar el total con puntos y comas
        });

        const total = Object.values(cartItems).reduce((acc, item) => acc + item.total, 0);
        popupContent += `<p><strong>Total:</strong> $${total.toLocaleString('es-CO')}</p>`; // Mostrar el total con puntos y comas

        // Agregar botón para borrar los productos del carrito
        popupContent += `<button id="clear-cart">Borrar Carrito</button>`;

        // Abrir ventana emergente con el contenido del carrito
        const popupWindow = window.open("", "_blank", "width=600,height=400");
        popupWindow.document.write(popupContent);

        // Agregar evento de clic al botón "Borrar Carrito"
        popupWindow.document.getElementById("clear-cart").addEventListener("click", function() {
            cartItems = {}; // Limpiar el carrito
            saveCartToStorage(cartItems); // Guardar el carrito vacío en localStorage
            updateCartTotal(); // Actualizar el total del carrito
            popupWindow.location.reload(); // Recargar la ventana emergente para reflejar los cambios
        });
    });

    // Ajustar estilos del botón del carrito
    const cartButton = document.getElementById("cart-button");
    cartButton.style.fontSize = "2rem"; // Ajustar tamaño de fuente
    cartButton.style.padding = "15px 30px"; // Ajustar relleno

});
