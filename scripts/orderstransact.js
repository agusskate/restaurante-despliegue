$(document).ready(function () {
    let total = 0;

    $(".item__button").click(function () {
        const itemName = $(this).closest(".item").find(".item__title").text();
        const itemPrice = parseFloat($(this).closest(".item").find(".item__price").text().replace(" €", ""));

        const cartItem = `<div class="cart-item">
                            <span class="product-name">${itemName}</span>
                            <span class="product-price">${itemPrice.toFixed(2)} €</span>
                        </div>`;


        $("#cart-items-list").append(cartItem);

        total += itemPrice;
        $("#total-price").text(total.toFixed(2) + " €");

        $(".popup-overlay").fadeIn();
    });

    $(".popup-overlay").hide();
    $(".cesta-icon").click(function () {
        $(".popup-overlay").fadeIn();
    });

    $(".popup-close-btn").click(function () {
        $(".popup-overlay").fadeOut();
    });


    let session = localStorage.getItem("session") || "Anónimo";


    //tramitar pedido
    $(".checkout-btn").click(function () {
        let cartItems = [];
        let total = 0;
        let username = localStorage.getItem("session") || "Anónimo";
    
        // Recorrer los productos en el carrito
        $("#cart-items-list .cart-item").each(function () {
            let itemName = $(this).find(".product-name").text().trim();
            let itemPrice = parseFloat($(this).find(".product-price").text().replace(" €", "").trim());
    
            cartItems.push({
                name: itemName,
                price: itemPrice
            });
    
            total += itemPrice;
        });
    
        if (cartItems.length === 0) {
            alert("⚠️ El carrito está vacío.");
            return;
        }
    
        let orderData = {
            username: username,
            products: cartItems,
            total: total.toFixed(2)
        };
    
        // Enviar pedido a la API
        $.ajax({
            type: "POST",
            url: "https://yonko-api.vercel.app/api/order",
            contentType: "application/json",
            dataType: "json",
            processData: false,
            data: JSON.stringify(orderData),
            success: function (response) {
                if (response.success) {
                    alert("✅ Pedido realizado correctamente.");
    
                    // Limpiar carrito
                    localStorage.removeItem("cartData");
                    $("#cart-items-list").empty();
                    loadOrders(); // Actualizar lista de pedidos
                } else {
                    alert("❌ Error en la compra: " + response.message);
                }
            },
            error: function (error) {
                alert("⚠️ Error al conectar con el servidor.");
                console.error("Error:", error);
            }
        });
    });

    
    function loadOrders() {
        $.ajax({
            type: "GET",
            url: "https://yonko-api.vercel.app/api/orders",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $(".orders-list").empty(); // Limpiar la lista antes de agregar nuevos pedidos
                    
                    response.orders.forEach(order => {
                        let productsHTML = order.products.map(p => `<li>${p.name} - ${p.price} €</li>`).join("");
    
                        let orderHTML = `
                            <div class="reservation-card">
                                <div class="reservation-name">
                                    <span class="label">Cliente:</span>
                                    <span class="value">${order.username}</span>
                                </div>
                                <div class="reservation-total">
                                    <span class="label">Total:</span>
                                    <span class="value">${order.total} €</span>
                                </div>
                                <div class="reservation-products">
                                    <span class="label">Productos:</span>
                                    <ul class="reservation-products-list">
                                        ${productsHTML}
                                    </ul>
                                </div>
                                <div class="reservation-status">
                                    <span class="label">Estado:</span>
                                    <span class="value">${order.status}</span>
                                </div>
                                <div class="reservation-actions">
                                    <button class="accept-btn">Aceptar</button>
                                    <button class="decline-btn">Declinar</button>
                                </div>
                            </div>
                        `;
                        $(".orders-list").append(orderHTML);
                    });
                } else {
                    alert("❌ No se pudieron cargar los pedidos.");
                }
            },
            error: function (error) {
                alert("⚠️ Error al conectar con el servidor.");
                console.error("Error:", error);
            }
        });
    }
    
    // Cargar los pedidos cuando la página se inicie
    $(document).ready(function () {
        loadOrders();
    });
    
    
    
});
