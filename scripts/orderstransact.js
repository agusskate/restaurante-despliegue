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


    $(".popup-overlay-noti").hide();
    $(".notification-icon").click(function () {
        $(".popup-overlay-noti").fadeIn();
    });

    $(".popup-close-btn").click(function () {
        $(".popup-overlay-noti").fadeOut();
    });

    let session = localStorage.getItem("session") || "Anónimo";


    //tramitar pedido
    $(".checkout-btn").click(function () {
        let cartItems = [];
        let total = 0;
        let username = localStorage.getItem("session") || "Anónimo";
    
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
    
                    localStorage.removeItem("cartData");
                    $("#cart-items-list").empty();
                    $("#total-price").html("00.00");
                    loadOrders();
                    loadNotifications()
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

    //ORDERS
    function loadOrders() {
        $.ajax({
            type: "GET",
            url: "https://yonko-api.vercel.app/api/orders",
            dataType: "json",
            success: function (response) {
                console.log(response);
                
                if (response.success) {
                    $(".orders-list").empty();
                    
                    let hasPending = false;
                    
                    response.orders.forEach(order => {
                        // Solo mostrar pedidos con transact: false
                        if (order.transact === false) {
                            hasPending = true;
                            
                            let productsHTML = order.products.map(p => `<li>${p.name} - ${p.price} €</li>`).join("");
    
                            let orderHTML = `
                                <div class="reservation-card">
                                    <div class="reservation-id">
                                        <span class="label">ID del Pedido:</span>
                                        <span class="value order-id">${order._id}</span>
                                    </div>
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
                                    <div class="reservation-actions">
                                        <button class="accept-btn">Aceptar</button>
                                        <button class="decline-btn">Declinar</button>
                                    </div>
                                </div>
                            `;
                            $(".orders-list").append(orderHTML);
                        }
                    });
    
                    // Si no hay pedidos con transact: false
                    if (!hasPending) {
                        $(".orders-list").append(`
                            <div class="no-orders">
                                <p>✅ No hay pedidos pendientes.</p>
                            </div>
                        `);
                    }
    

                    $(".accept-btn").click(function () {
                        let orderId = $(this).closest(".reservation-card").find(".order-id").text();
                        acceptOrder(orderId);
                    });
    
                    $(".decline-btn").click(function () {
                        let orderId = $(this).closest(".reservation-card").find(".order-id").text();
                        declineOrder(orderId);
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
    

    function acceptOrder(orderId) {
        $.ajax({
            type: "POST",
            url: "https://yonko-api.vercel.app/api/order/accept",
            contentType: "application/json",
            data: JSON.stringify({ order_id: orderId }),
            success: function (response) {
                if (response.success) {
                    alert("✅ Order aceptada.");
                    loadOrders();
                } else {
                    alert("❌ Error: " + response.message);
                }
            },
            error: function (error) {
                alert("⚠️ Error al conectar con el servidor.");
                console.error("Error:", error);
            }
        });
    }
    function declineOrder(orderId) {
        $.ajax({
            type: "POST",
            url: "https://yonko-api.vercel.app/api/order/decline",
            contentType: "application/json",
            data: JSON.stringify({ order_id: orderId }),
            success: function (response) {
                if (response.success) {
                    alert("❌ Order rechazada y eliminada.");
                    loadOrders();
                } else {
                    alert("❌ Error al eliminar: " + response.message);
                }
            },
            error: function (error) {
                alert("⚠️ Error al conectar con el servidor.");
                console.error("Error:", error);
            }
        });
    }

//Cargar Reservas
function loadReservations() {
    $.ajax({
        type: "GET",
        url: "https://yonko-api.vercel.app/api/reservations",
        dataType: "json",
        success: function (response) {
            if (response.success) {
                $(".reservations-list").empty();
                
                let hasPending = false

                response.reservations.forEach(reservation => {
                    if (reservation.transact === false) {
                        hasPending = true;

                        let reservationHTML = `
                            <div class="reservation-card">
                                <div class="reservation-id" data-id="${reservation._id}">
                                    <span class="label">ID de la Reserva:</span>
                                    <span class="reservation-id-class">${reservation._id}</span>
                                </div>
                                <div class="reservation-owner">
                                    <span class="label">Propietario:</span>
                                    <span class="value">${reservation.owner}</span>
                                </div>
                                <div class="reservation-date">
                                    <span class="label">Fecha:</span>
                                    <span class="value">${reservation.date}</span>
                                </div>
                                <div class="reservation-time">
                                    <span class="label">Hora:</span>
                                    <span class="value">${reservation.time}</span>
                                </div>
                                <div class="reservation-people">
                                    <span class="label">Personas:</span>
                                    <span class="value">${reservation.people}</span>
                                </div>
                                <div class="reservation-actions">
                                    <button class="id-accept">Aceptar</button>
                                    <button class="id-decline">Declinar</button>
                                </div>
                            </div>
                        `;
                        $(".reservations-list").append(reservationHTML);
                    }
                });


                if (!hasPending) {
                    $(".reservations-list").append(`
                        <div class="no-reservations">
                            <p>✅ No hay reservas pendientes.</p>
                        </div>
                    `);
                }

 
                $(".id-accept").click(function () {
                    let reservationId = $(this).closest(".reservation-card").find(".reservation-id-class").text();
                    acceptReservation(reservationId);
                });

                $(".id-decline").click(function () {
                    let reservationId = $(this).closest(".reservation-card").find(".reservation-id-class").text();
                    declineReservation(reservationId);
                });

            } else {
                alert("❌ No se pudieron cargar las reservas.");
            }
        },
        error: function (error) {
            alert("⚠️ Error al conectar con el servidor.");
            console.error("Error:", error);
        }
    });
}

    
    function acceptReservation(reservationId) {
        $.ajax({
            type: "POST",
            url: "https://yonko-api.vercel.app/api/reservation/accept",
            contentType: "application/json",
            data: JSON.stringify({ reservation_id: reservationId }),
            success: function (response) {
                if (response.success) {
                    alert("✅ Reserva aceptado. Se ha enviado un correo al cliente.");
                    loadReservations();; // Refrescar lista
                } else {
                    alert("❌ Error al aceptar pedido: " + response.message);
                }
            },
            error: function (error) {
                alert("⚠️ Error al conectar con el servidor.");
                console.error("Error:", error);
            }
        });
    }

    function declineReservation(reservationId) {
        $.ajax({
            type: "POST",
            url: "https://yonko-api.vercel.app/api/reservation/decline",
            contentType: "application/json",
            data: JSON.stringify({ reservation_id: reservationId }),
            success: function (response) {
                if (response.success) {
                    alert("❌ Reserva rechazada y eliminada.");
                    loadReservations();
                } else {
                    alert("❌ Error al eliminar: " + response.message);
                }
            },
            error: function (error) {
                alert("⚠️ Error al conectar con el servidor.");
                console.error("Error:", error);
            }
        });
    }
    


    function loadNotifications() {
        let session = localStorage.getItem("session") || "Anónimo";
    
        $("#notifications-items-list").empty();
    
        $.ajax({
            type: "GET",
            url: "https://yonko-api.vercel.app/api/reservations",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    response.reservations.forEach(reservation => {
                        if (reservation.owner === session) {
                            let reservationHTML = `
                                <div class="notification-item">
                                    <span class="label">Reserva:</span>
                                    <span class="value">${reservation.date} a las ${reservation.time}</span>
                                                                        
                                    <span class="label">Estado:</span>
                                    <span class="status">${reservation.status}</span>
                                </div>
                            `;
                            $("#notifications-items-list").append(reservationHTML);
                        }
                    });
                }
            },
            error: function (error) {
                console.error("Error al cargar reservas:", error);
            }
        });
    
        $.ajax({
            type: "GET",
            url: "https://yonko-api.vercel.app/api/orders",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    response.orders.forEach(order => {
                        if (order.username === session) {
                            let orderHTML = `
                                <div class="notification-item">
                                    <span class="label">Pedido: ${order._id}</span>
                                    <span class="value">${order.total} €</span>
                                    <span class="label">Estado:</span>
                                    <span class="status">${order.status}</span>
                                </div>
                            `;
                            $("#notifications-items-list").append(orderHTML);
                        }
                    });
                }
            },
            error: function (error) {
                console.error("Error al cargar pedidos:", error);
            }
        });
    }
    

    //Cargar
    loadNotifications()
    loadReservations();
    loadOrders();
});
