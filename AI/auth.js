function signup(){
  let email=document.getElementById("email").value;
  let pass=document.getElementById("password").value;

  localStorage.setItem(email,pass);
  alert("Signup successful!");
}

function login(){
  let email=document.getElementById("email").value;
  let pass=document.getElementById("password").value;

  if(localStorage.getItem(email)===pass){
    localStorage.setItem("user",email);
    window.location="dashboard.html";
  }else{
    alert("Invalid login");
  }
}

function logout(){
  localStorage.removeItem("user");
  window.location="index.html";
}