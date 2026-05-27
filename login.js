document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let username = document.getElementById("username").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let password = document.getElementById("password").value.trim();

 
  let defaultUser = "Anurag Singh Yadav";
  let defaultPhone = "8303758892";
  let defaultPass = "Anurag@05";

  if (username === defaultUser && phone === defaultPhone && password === defaultPass) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userName", username);
    window.location.href = "index.html";
  } else {
    document.getElementById("errorMsg").innerText =
      "Invalid Username / Phone / Password!";
  }
});


if (localStorage.getItem("loggedIn") === "true") {
  window.location.href = "index.html";
}
