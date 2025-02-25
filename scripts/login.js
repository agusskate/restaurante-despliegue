$(document).ready(function () {
    $("#login-form").submit(function (e) {
      e.preventDefault();
      $("#error-message").empty();
  
      let uri = "https://yonko-api.vercel.app/login";
  
      // Recuperar los datos del formulario
      let username = $(".username-field").val();
      let password = $(".password-field").val();
  
      $.ajax({
        type: "GET",
        url: uri,
        contentType: "application/json",
        dataType: "json",
        processData: false,
        data: JSON.stringify({ username, password }),
        success: function (response) {
          if (response.success) {
            let messageAccess = `<div class="card">
                      <div class="icon-container-access">
                        <i class="bx bx-check-circle icon-access"></i>
                      </div>
                    
                      <div class="message-text-container">
                        <p class="message-text-access">Success</p>
                        <p class="sub-text">Login approved</p>
                      </div>
                    
                      <i class="bx bx-x cross-icon"></i>
                  </div>`;
            $("#error-message").append(messageAccess);
            setTimeout(() => {
              window.location.href = "../pages/index.html";
            }, 500);
            
          } else if (response.message === "Incorrect password") {
            $(".password-field").val("");    
            let messageError = `<div class="card">
                      <div class="icon-container">
                        <i class="bx bxs-error icon"></i>
                      </div>
                    
                      <div class="message-text-container">
                        <p class="message">Error</p>
                        <p class="sub-text">${response.message}</p>
                      </div>
                    
                      <i class="bx bx-x cross-icon"></i>
                  </div>`;
            $("#error-message").append(messageError);
          } else {
            $(".username-field").val("");
            $(".password-field").val("");    
            let messageError = `<div class="card">
                      <div class="icon-container">
                        <i class="bx bxs-error icon"></i>
                      </div>
                    
                      <div class="message-text-container">
                        <p class="message-text">Error</p>
                        <p class="sub-text">${response.message}</p>
                      </div>
                    
                      <i class="bx bx-x cross-icon"></i>
                  </div>`;
            $("#error-message").append(messageError);
          }
        },
        error: function (error) {
          $(".username-field").val("");
            $(".password-field").val("");    
            let messageError = `<div class="card">
                      <div class="icon-container">
                        <i class="bx bxs-error icon"></i>
                      </div>
                    
                      <div class="message-text-container">
                        <p class="message-text">Error</p>
                        <p class="sub-text">Error al conectarse a la base de datos.</p>
                      </div>
                    
                      <i class="bx bx-x cross-icon"></i>
                  </div>`;
            $("#error-message").append(messageError);
        },
      });
    });
  
    $("#error-message").on("click", ".cross-icon", function () {
      $(this).parent().fadeOut();
    });
  
    // Mostrar u ocultar la contraseña
    $(".action-password").click(function () {
      let passwordField = $(".password-field");
      let type = passwordField.attr("type");
  
      if (type === "password") {
        passwordField.attr("type", "text");
        $(this).removeClass("bx-hide").addClass("bx-show");
      } else {
        passwordField.attr("type", "password");
        $(this).removeClass("bx-show").addClass("bx-hide");
      }
    });
});