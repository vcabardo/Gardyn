//These functions handle all the particulars of authentication,
//as well as signing in/out and creating a user
function signUpUser() {
    var config = {
        apiKey: " AIzaSyAxfhLzaQgDEY-QFO8dc7LZ2aQTXc2fg3k ",
        authDomin: "gardynapp.firebaseapp.com",
        databaseURL: "https://gardynapp.firebaseio.com/",
        storageBucket: "gardynapp.appspot.com"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    //Pulling data from signup page
    var email = document.getElementById('inputEmail').value;
    var password = document.getElementById('inputPassword').value;
    var userName = document.getElementById('inputUser').value;
    var switchVal = document.getElementById("inputSwitch").value;

    //checking if switch code input is in valid format
    if (!validSwitch(switchVal)) {
        alert("Incorrect SwitchCode format Ex: 1234-5678-9876");
        return false;
    }
    //Inserting data into auth database
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
        firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    user.updateProfile({
                        displayName: userName
                    });
                }
            })
            //Inserting data into RTDB to be accessed by other pages
        firebase.database().ref('Users/' + userName).set({
            Username: userName,
            SwitchCode: switchVal,
            Collected: ""
        }).then(function() {
            document.location.href = 'home.html'
        });

    }).catch(function(error) {
        // output error message
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
    });
}
//This function signs in a user upon pressing sign in button
function signInUser() {
    var config = {
        apiKey: " AIzaSyCAMDvc-qvif4fJTuGuHbUmvj1NoN8CXBU",
        authDomin: "nookslookup.firebaseapp.com",
        databaseURL: "https://nookslookup.firebaseio.com/",
        storageBucket: "nookslookup.appspot.com"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    //accessing data from index.html
    var email = document.getElementById('signinEmail').value;
    var password = document.getElementById('signinPassword').value;

    firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
        document.location.href = 'home.html'
        var currentUser = firebase.auth().currentUser;
        //if user data is incorrect, we output error message
    }).catch(function(error) {
        console.log(error.code);
        console.log(error.message);
        alert(error.message);
    });
}
//This function will sign out a user upon pressing sign out button from hamburger menu
function signOutUser() {
    var config = {
        apiKey: " AIzaSyCAMDvc-qvif4fJTuGuHbUmvj1NoN8CXBU",
        authDomin: "nookslookup.firebaseapp.com",
        databaseURL: "https://nookslookup.firebaseio.com/",
        storageBucket: "nookslookup.appspot.com"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        document.location.href = "index.html";
    }).catch(function(error) {
        // Output error if sign out doesn't occur
        console.log(error.code);
        console.log(error.message);
        alert(error.message);
    });
}

function validSwitch(switchValue) {
    //define switch value: 1234-5678-9876
    //Regular expression to check for correct switch code format
    let regEx = /[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]/;
    if (regEx.test(switchValue)) {
        return true;
    }
    return false;
}