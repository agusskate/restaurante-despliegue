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
});
