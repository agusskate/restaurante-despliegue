$(document).ready(function () {
    // Obtnemos la fecha actual
    let today = new Date().toISOString().split("T")[0];
    // Ponemos la fecha de hoy como la minima del input
    $(".fecha").attr("min", today);

    // Recuperamos el nombre de usuario de la sesión
    let session = localStorage.getItem("session") || "Anónimo";

    $("#reserves-form").submit(function (e) {
        e.preventDefault();

        // Recuperar los datos del formulario
        let clientReserves = {
            owner: session,
            date: $(".fecha").val(),
            time: $(".horario").val(),
            name: $(".nombre").val(),
            tlfn: parseInt($(".telefono").val(), 10),
            people: $(".personas").val()
        }

        // Verificamos que el telefono tenga 9 digitos
        let tlfnValid = (tlfn) => /^\d{9}/.test(tlfn);

        /* Funcion para verificar que la reserva tiene una
        hora y fecha válida y no pasada */
        let dataValid = (date, time) => {
            // Fecha seleccionadoa por el usuario
            let selectDate = new Date(date + " " + time);
            // Fecha actual
            let actualDate = new Date();

            /* Añadimos 30min a la fecha actual porque 
            como minimo se dede resevar con media hora de antelación */
            actualDate.setMinutes(actualDate.getMinutes() + 30);

            // Verificamos que la reserva se pueda realizar
            return selectDate >= actualDate;
        }

        // Vaidaciones de tlfn y fecha
        if (!tlfnValid(clientReserves.tlfn)) {
          $(".info-error").text("Número de teléfono inválido. Debe contener 9 dígitos.");
          $(".message-fallido").show();

          setTimeout(() => {
            $(".message-fallido").hide();
            $(".telefono").val("");
            return;
          }, 500);
        }

        if (!dataValid(clientReserves.date, clientReserves.time)) {
          $(".info-error").text("La reserva debe hacerse con al menos 30 minutos de anticipación.");
          $(".message-fallido").show();

          setTimeout(() => {
            $(".message-fallido").hide();
            $(".fecha").val("");
            $(".horario").val("");
            return;
          }, 500);
        }

        console.log(clientReserves);

        $.ajax({
            type: "POST",
            url: "https://yonko-api.vercel.app/api/reservation",
            contentType: "application/json",
            dataType: "json",
            processData: false,
            data: JSON.stringify( clientReserves ),
            success: function (response) {
              if (response.success) {
                $(".message-exito").show();
                setTimeout(() => {
                  $(".message-exito").hide();
                  window.location.href = "https://yonko-eta.vercel.app/";
                }, 500);
              } else {
                console.log(response.message);
                $(".info-error").text(response.message);
                $(".message-fallido").show();
                setTimeout(() => {
                  $(".message-exito").hide();
                  window.location.href = "https://yonko-eta.vercel.app/pages/reserves.html";
                }, 500);
              }
            },
            error: function (error) {
              console.log("Error al conectarse a la base de datos.");
              $(".info-error").text("Error al conectarse a la base de datos.");
              $(".message-fallido").show();
              setTimeout(() => {
                $(".message-exito").hide();
                window.location.href = "https://yonko-eta.vercel.app/pages/reserves.html";
              }, 500);
            },
          });
    });
});

