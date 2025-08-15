// Import the functions you need from the SDKs you need
//import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
//import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
//import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

//import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
//import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, TwitterAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
//import { getDatabase, ref, set, onValue, update, remove, child, get } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, TwitterAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, set, onValue, update, remove, child, get } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const dbRef = ref(database);
var FailedCount=0;


/************************SIGN IN***************************************/

SignIn.addEventListener('click', (e) => {

    var email = document.getElementById('emailIn').value;
    var password = document.getElementById('passwordIn').value;
    var rank;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user.uid);
            update(ref(database, 'Users/' + user.uid), {
                last_login: Date()
            });

            get(child(dbRef, 'Users/' + user.uid)).then((snapshot) => {
                rank = Number(snapshot.val().rank);

                window.localStorage.setItem("UserId",user.uid);
                //alert(window.localStorage.getItem("UserId"));
                //console.log(window.localStorage.getItem("UserId"))
                
                if (rank == 1) {
                    window.location.href = "MainAdmin.html";
                    var $key = $(this).data("key");
                    window.localStorage.setItem("rank",$key);

                    console.log($key);
                }
                else {
                    window.location.href = "MainPage.html";
                        var $key = $(this).data("key");
                        window.localStorage.setItem("rank",$key);
                        console.log($key);
                    
                }

                alert('Login is successfully!');
            })

            swal({
                title: "Login is successfully!",
                icon: "success",
                button: "Lets go!",
              });
        })
        
        .catch(function (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            FailedCount=FailedCount+1;
            swal({
                title: "Login failed!",
                text: errorMessage,
                text: "Count of wrong attempts:" + FailedCount,
                icon: "error",
              });
              if(FailedCount==3)
              {
                  document.getElementById('PasswordResetForm').style.display = 'block';
                  document.getElementById('SignUpForm').style.display = 'none';
                  document.getElementById('SignInForm').style.display = 'none';
                  FailedCount=0;
              }
        });
});



/************************SIGN UP***************************************/

SignUp.addEventListener('click', (e) => {
    var username = document.getElementById('usernameUp').value;
    var email = document.getElementById('emailUp').value;
    var password = document.getElementById('passwordUp').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            set(ref(database, 'Users/' + user.uid), {
                username: username,
                email: email,
                rank: '0',
                last_login: Date.now()
            })
            swal({
                title: "Registration is successful!",
                icon: "success"
              });
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            //alert(errorMessage);
            swal({
                title: "Registration failed!",
                text:(errorMessage + ' , ' + errorCode),
                icon: "warning",
              });
        });
});



/************************RESET PASSWORD***************************************/

resetbtn.addEventListener('click', (e) => {
    var email = document.getElementById('resetEmail').value;

    sendPasswordResetEmail(auth, email)
        .then(() => {
            //alert('Password reset email sent successfully');
            swal({
                title: "Password reset email sent successfully",
                icon: "success"
              });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            swal({
                title: "Failed to send password reset email",
                text:(errorMessage + ' , ' + errorCode),
                icon: "error"
              });
        });
});


    

/***************************Login page transitions*************************/

fromSignIntoSignUp.addEventListener('click', (e) => {

    document.getElementById('SignUpForm').style.display = 'block';
    document.getElementById('SignInForm').style.display = 'none';
    document.getElementById('PasswordResetForm').style.display = 'none';
})

fromSignUptoSignIn.addEventListener('click', (e) => {
    document.getElementById('SignInForm').style.display = 'block';

    document.getElementById('SignUpForm').style.display = 'none';
    document.getElementById('PasswordResetForm').style.display = 'none';
})
fromResettoSignIn.addEventListener('click', (e) => {
    document.getElementById('SignInForm').style.display = 'block';

    document.getElementById('SignUpForm').style.display = 'none';
    document.getElementById('PasswordResetForm').style.display = 'none';
})

resetbutton.addEventListener('click', (e) => {
    document.getElementById('PasswordResetForm').style.display = 'block';

    document.getElementById('SignUpForm').style.display = 'none';
    document.getElementById('SignInForm').style.display = 'none';
})

