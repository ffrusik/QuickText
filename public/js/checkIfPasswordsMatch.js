document.getElementById('register-form').addEventListener('submit', function (e) {
  const password = document.getElementById('pass').value;
  const repeat = document.getElementById('repeatPass').value;

  if (password !== repeat) {
    e.preventDefault();
    alert("Passwords do not match");
  }
});