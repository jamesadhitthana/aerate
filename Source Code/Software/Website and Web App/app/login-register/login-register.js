
//-------Login Stuff James March2020--------//
function showError(err) {
    console.log("[firebase]: An error happened: ")
    console.log(err)
}
//------FIREBASE STUFF STARTS HERE------//
var auth = firebase.auth();
auth.onAuthStateChanged(function (user) {//Listen if user is logged in//
    if (user) { //If a user is logged in
        //List of user variables: name, email, photoUrl, uid, emailVerified;
        console.group("--[fbAuth]: " + user.email + " Logged in--")
        console.log("  Name: " + user.displayName);
        console.log("  Email: " + user.email);
        console.log("  Photo URL: " + user.photoURL);
        console.log("  UID: " + user.uid);
        console.log("  emailVerified: " + user.emailVerified);
        console.groupEnd()

        if (user.displayName != null) {
            iziToast.success({ message: "Welcome back " + user.displayName + " (" + user.email + ")" });
        }


        if (registerPage == false) {
            var doSomethingAtStartup = waitAndThenRedirect()
        } else {
            //Disable Register Input and Buttons if already logged in
            document.getElementById("inputEmail").disabled = true;
            document.getElementById("inputName").disabled = true;
            document.getElementById("inputPassword").disabled = true;
            document.getElementById("signUpButton").disabled = true;
            //Enable signout button if already logged in
            document.getElementById("signOutButton").disabled = false;
            document.getElementById("signUpButton").title = "Be logged out to be able to register an account"
        }

    } else { //If no user
        console.log("[fbAuth]: No user is logged in")
        iziToast.warning({ message: "Login to enjoy all of aerate's functionalities" });
        //Disable Register Input and Buttons if already logged in
        document.getElementById("inputEmail").disabled = false;
        document.getElementById("inputName").disabled = false;
        document.getElementById("inputPassword").disabled = false;
        document.getElementById("signUpButton").disabled = false;
        //Enable signout button if already logged in
        document.getElementById("signOutButton").disabled = true;
        document.getElementById("signOutButton").title = "Be logged in to be able to sign out"
    }
})
//^^--------------------------------------------------------^^//
//------------Runtime------------//
function waitAndThenRedirect() { //DEPRECEATED, moved to doWhenDatabaseRawIsUpdated()//
    // Setup interval to try to load chart and refresh every 1 second at startup
    //Setup interval to try to load chart on target date and refresh every 1 second
    return setInterval(function () {
        window.location.href = "index.html";
        clearInterval(doSomethingAtStartup);
    }, 3000);
}
//--Login--//
function handleLogin() {
    console.log('Pressed login button');
    //Login user from email and password
    auth.signInWithEmailAndPassword(inputEmail.value, inputPassword.value) //get from the text input
        //If successful, get the data received back and then print in the log
        .then(function (data) {
            console.log("--Logged in-- ")
            console.log(data)
        })
        //If NOT successful, get the error message
        .catch(function (err) {
            console.log(err)
            iziToast.error({ message: err.message });
        })
}
//--LogOut--//
function handleLogout() {
    //Sign Out/Logouts the user
    auth.signOut()
        .then(function (data) {
            console.log("--Logged Out--")
            console.log(data)
        })
        .catch(function (err) {
            console.log(err)
            iziToast.error({ message: err.message });
        })
}
//------SIGNUP and UPDATE------//
function handleSignUp() {
    // console.log(inputName.value);
    auth.createUserWithEmailAndPassword(inputEmail.value, inputPassword.value)
        .then(function (data) {
            console.log("--signup success--")
            console.log(data)

            console.log("--updating profile name--")
            // here you can use either the returned user object or       firebase.auth().currentUser. I will use the returned user object
            auth.currentUser.updateProfile({
                displayName: inputName.value
            }).then(function () {
                console.log("updateProfile name successful with name:" + inputName.value)
                iziToast.success({ message: "Welcome " + inputName.value });
                waitAndThenRedirect();
            }).catch(function (error) {
                console.log("An error happened while updating user profile " + error)
            });
            console.log("--profile name updated--")
        })
        .catch(function (err) {
            console.log("--error signing up--")
            console.log(err)
            iziToast.error({ message: err.message });
        })
}
//------------Runtime------------//