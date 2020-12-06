//help: https://canvasjs.com/html5-javascript-pie-chart/

//'Users/' + user.displayName + '/Stats/Used/'
//'Users/' + user.displayName + '/Stats/ThrownAway/'

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

      ref.on("value", function (snapshot) {
        snapshot.forEach((child) => {

          var date = child.val().Date;
          var name = child.val().Name;

          if (name != undefined) {
            var card = document.createElement("div");
            card.classList.add("card");
            card.classList.add("bg-secondary");

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

  // Attach an asynchronous callback to read the data at our posts reference
  // ref.on("value", function (snapshot) {
  //   console.log(snapshot.val());
  // }, function (errorObject) {
  //   console.log("The read failed: " + errorObject.code);
  // });
}


function loadPieChart(usedCount) {

  console.log("++++++" + usedCount);
  //console.log("-----" + taCount);

 // var total = usedCount + taCount;
  //var usedT = usedCount / total;
 // var thrownT = taCount / total;

  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    title: {
      text: "Total Food Used and Thrown Away"
    },
    data: [{
      type: "pie",
      startAngle: 240,
      yValueFormatString: "##0\"\"",
      indexLabel: "{label} {y}",
      dataPoints: [{
          y: 3,
          label: "Used"
        },
        {
          y: 10,
          label: "Thrown Away"
        }
      ]
    }]
  });
  chart.render();
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    getAllElementsOfChild('Users/' + user.displayName + '/Stats/Used/', "d1");
    getAllElementsOfChild('Users/' + user.displayName + '/Stats/ThrownAway/', "d2");
    loadPieChart();
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