$(document).ready(function () {
    $("#register-form").submit(function (e) {
      e.preventDefault();
      $("#error-message").empty();
  
      // Recuperar los datos del formulario
      let email = $(".email-field").val();
      let username = $(".username-field").val();
      let password = $(".password-field").val();
      let confirmPassword = $(".confirm-password-field").val();
  
      // Validar que las contraseñas coincidan
      if (password !== confirmPassword) {
        $(".password-field").val("");
        $(".confirm-password-field").val("");
        let messagePasswordError = `<div class="card">
                      <div class="icon-container">
                        <i class="bx bxs-error icon"></i>
                      </div>
                    
                      <div class="message-text-container">
                        <p class="message-text">Error</p>
                        <p class="sub-text">Passwords do not match</p>
                      </div>
                    
                      <i class="bx bx-x cross-icon"></i>
                  </div>`;
        $("#error-message").append(messagePasswordError);
        return;
      }

      let newClient = {
        email: email,
        username: username,
        password: password
      }
  
      $.ajax({
        type: "POST",
        url: "https://yonko-api.vercel.app/api/register",
        contentType: "application/json",
        dataType: "json",
        processData: false,
        data: JSON.stringify( newClient ),
        success: function (response) {
          if (response.success) {
            let messageAccess = `<div class="card">
                      <div class="icon-container-access">
                        <i class="bx bx-check-circle icon-access"></i>
                      </div>
                    
                      <div class="message-text-container">
                        <p class="message-text-access">Success</p>
                        <p class="sub-text">Account created successfully</p>
                      </div>
                    
                      <i class="bx bx-x cross-icon"></i>
                  </div>`;
            $("#error-message").append(messageAccess);
            setTimeout(() => {
              window.location.href = "https://yonko-eta.vercel.app/pages/login.html";
            }, 500);
            
          } else if (response.message === "This username is already in use") {
            $(".username-field").val("");
            let messageError = `<div class="card">
                      <div class="icon-container-warning">
                        <i class="bx bxs-error icon-warning"></i>
                      </div>
                    
                      <div class="message-text-container">
                        <p class="message-text-warning">Upss...</p>
                        <p class="sub-text">${response.message}</p>
                      </div>
                    
                      <i class="bx bx-x cross-icon"></i>
                  </div>`;
            $("#error-message").append(messageError);
          } else {
            $(".email-field").val("");
            $(".username-field").val("");
            $(".password-field").val("");
            $(".confirm-password-field").val("");
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
          $(".email-field").val("");
            $(".username-field").val("");
            $(".password-field").val("");
            $(".confirm-password-field").val("");
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
  
    $(".action-confirm").click(function () {
      let passwordField = $(".confirm-password-field");
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