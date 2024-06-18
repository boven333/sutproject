$(document).ready(function () {
  $("#loginForm").submit(function (event) {
    event.preventDefault();
    const username = $("#username").val();
    const password = $("#password").val();
   
    $.ajax({
      url: "http://localhost:2020/api/login", // Update URL if needed
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ username, password }),
      success: function (response) {
        const { token } = response;
        localStorage.setItem("jwtToken", token);
        $("#message").text(response.message);
        // Redirect or handle success as needed
        window.location.href = "./pages/home.html";
      },
      error: function (xhr, status, error) {
        $("#message").text("Error: " + xhr.responseText);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-start",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "Invalid uername or email"
        });
      },
    });
  });
});
