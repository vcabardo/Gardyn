function getAllElementsOfChild(childName, divName) {
  var config = {
    apiKey: " AIzaSyAxfhLzaQgDEY-QFO8dc7LZ2aQTXc2fg3k ",
    authDomin: "gardynapp.firebaseapp.com",
    databaseURL: "https://gardynapp.firebaseio.com/",
    storageBucket: "gardynapp.appspot.com"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var db = firebase.database();
      var ref = db.ref(childName);

      ref.on("value", function (snapshot) {
        snapshot.forEach((child) => {
          console.log(child.val());
          var date = child.val().Date;
          var name = child.val().Name;

            if(name != undefined){
              var card = document.createElement("div");
              card.classList.add("card");
              card.classList.add("bg-secondary");

              var cardHeader = document.createElement("div");
              cardHeader.classList.add("card-header");
              var nameNode = document.createTextNode(name);
              cardHeader.appendChild(nameNode);
              cardHeader.classList.add("bg-secondary");
              card.classList.add("text-light");

              var cardBody = document.createElement("div");
              cardBody.classList.add("card-body");
              cardBody.classList.add("bg-secondary");
              cardBody.classList.add("text-light");

              var dateNode = document.createTextNode("Date: " + date);
              cardBody.appendChild(dateNode);

              card.appendChild(cardHeader);
              card.appendChild(cardBody);

              var entry = document.createElement("div");
              entry.classList.add("my-sm-3");
              entry.appendChild(card);

              var element = document.getElementById(divName);
              element.appendChild(entry);
          }//end if
        });
      });

    } else {
      // No user is signed in.
    }
  });

  // Attach an asynchronous callback to read the data at our posts reference
  // ref.on("value", function (snapshot) {
  //   console.log(snapshot.val());
  // }, function (errorObject) {
  //   console.log("The read failed: " + errorObject.code);
  // });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    getAllElementsOfChild('Users/' + user.displayName + '/Stats/Used/', "d1");
    getAllElementsOfChild('Users/' + user.displayName + '/Stats/ThrownAway/', "d2");
  } else {
    document.getElementById("d1").innerHTML = "";
    document.getElementById("d2").innerHTML = "";
    var messageDiv = document.createElement("div");
    messageDiv.classList.add("text-white");
    messageDiv.classList.add("col");
    var messageDivChild = document.createElement("div");
    messageDiv.classList.add("text-center");
    var messageNode = document.createTextNode("Please sign into an account to see your statistics");
    messageDivChild.appendChild(messageNode);
    messageDiv.appendChild(messageDivChild);
    document.getElementById("d1").classList.remove("col-md-6");
    document.getElementById("d2").classList.remove("col-md-6");
    document.getElementById("d1").classList.add("col");
    document.getElementById("d1").appendChild(messageDiv);
  }
});
