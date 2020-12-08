//global variables to track number of used and number of thrown away elements
var used = 0, thrownaway = 0;

//gets number of used elements
function numUsedElements() {
  return new Promise(function (resolve, reject) {
    var usedCount = 0;
    var config = {
      apiKey: " AIzaSyAxfhLzaQgDEY-QFO8dc7LZ2aQTXc2fg3k ",
      authDomin: "gardynapp.firebaseapp.com",
      databaseURL: "https://gardynapp.firebaseio.com/",
      storageBucket: "gardynapp.appspot.com"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        var db = firebase.database();
        var childName = 'Users/' + user.displayName + '/Stats/Used/';
        var ref = db.ref(childName);

        ref.on("value", function (snapshot) {
          used = snapshot.numChildren();
          return resolve();
        });

      } else {
        // No user is signed in.
        return reject();
      }
    });

    return usedCount;
  });
} //end get used


//gets number of thrown away elements
function numThrownawayElements() {
  return new Promise(function (resolve, reject) {
    var usedCount = 0;
    var config = {
      apiKey: " AIzaSyAxfhLzaQgDEY-QFO8dc7LZ2aQTXc2fg3k ",
      authDomin: "gardynapp.firebaseapp.com",
      databaseURL: "https://gardynapp.firebaseio.com/",
      storageBucket: "gardynapp.appspot.com"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        var db = firebase.database();
        var childName = 'Users/' + user.displayName + '/Stats/ThrownAway/';
        var ref = db.ref(childName);

        ref.on("value", function (snapshot) {
          thrownaway = snapshot.numChildren();
          return resolve();
        });

      } else {
        // No user is signed in.
        return reject();
      }
    });

    return usedCount;
  });
} //end get used

//populates the list of all elements stored in users RTDB under used, and thrown away
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

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var db = firebase.database();
      var ref = db.ref(childName);
      var numChildren = 0;

      ref.on("value", function (snapshot) {
        snapshot.forEach((child) => {

          var date = child.val().Date;
          var name = child.val().Name;

          if (name != undefined) {
            var card = document.createElement("div");
            card.classList.add("card");
            card.classList.add("bg-secondary");

            var cardImage = document.createElement("img");
            cardImage.classList.add("card-img-top");

            //Add image for random
            const path = './img/' + name + '.jpg';
            var result = doesFileExist(path);

            if (result == true) {
              // yay, file exists!
              cardImage.setAttribute("src", "./img/" + name + ".jpg");
            } else {
              // file does not exist!
              cardImage.setAttribute("src", "./img/" + "veggieMix" + ".PNG");
            }

            var cardHeader = document.createElement("div");
            cardHeader.classList.add("card-header");
            cardHeader.classList.add("text-light");
            var nameNode = document.createTextNode(name);
            cardHeader.appendChild(nameNode);
            cardHeader.style.backgroundColor = "#b3614b";

            var cardBody = document.createElement("div");
            cardBody.classList.add("card-body");
            cardBody.classList.add("text-light");
            cardBody.style.backgroundColor = "#b3614b";

            var dateNode = document.createTextNode("Date: " + date);
            cardBody.appendChild(dateNode);

            card.appendChild(cardImage);
            card.appendChild(cardHeader);
            card.appendChild(cardBody);

            var entry = document.createElement("div");
            entry.classList.add("my-sm-3");
            entry.appendChild(card);

            var element = document.getElementById(divName);
            element.appendChild(entry);
          } //end if
        });
      });

    } else {
      // No user is signed in.
    }
  });
}

//displays the users stats in the form of a pie chart
function loadPieChart(numUsed, numThrownaway) {
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    backgroundColor: "#4f734f",
    data: [{
      type: "pie",
      startAngle: 240,
      yValueFormatString: "##0\"\"",
      indexLabel: "{label} {y}",
      dataPoints: [{
          y: numUsed,
          label: "Used"
        },
        {
          y: numThrownaway,
          label: "Thrown Away"
        }
      ]
    }]
  });
  chart.render();
} //end loadPieChart

//checks if files exist in the working directory, primarily used for fetching images in search.html
function doesFileExist(urlToFile) {
  var xhr = new XMLHttpRequest();
  xhr.open('HEAD', urlToFile, false);
  xhr.send();
  if (xhr.status == "404") {
    return false;
  }
  return true;
} //end doesFileExist


//main: displays all elements and loads pie chart
firebase.auth().onAuthStateChanged(function (user) {
  var input1 = 0;

  if (user) {
    // User is signed in.
    getAllElementsOfChild('Users/' + user.displayName + '/Stats/Used/', "d1");
    getAllElementsOfChild('Users/' + user.displayName + '/Stats/ThrownAway/', "d2");

    numUsedElements()
      .then(numThrownawayElements()
        .then(function () {
          loadPieChart(used, thrownaway);
        })
        .catch(function () {
          console.log("error");
        }));

  } else {
    //user not signed in
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