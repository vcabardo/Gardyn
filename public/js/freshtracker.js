//Populate the DOM with a dynamic list of Bootstrap card elements,
//with data taken from the RTDB
function chooseCategory(input) {
  if (input == 1) return "Fruits & Veggies";
  else if (input == 2) return "Meat & Protein";
  else if (input == 3) return "Breads & Cereals";
  else if (input == 4) return "Milk & Dairy";
  else if (input == 5) return "Junk Food";
  else if (input == 6) return "Misc.";
  else return "null";
}

function getAllElementsOfChildFT(childName) {
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
      var ref = db.ref('Users/' + user.displayName + '/Collected/');

      ref.on("value", function (snapshot) {
        snapshot.forEach((child) => {
          var pE = child.val().productExperationDate;
          var pN = child.val().productName;
          var pC = child.val().productCategory;
          var pP = child.val().productPurchaseDate;
          var pNotes = child.val().productInfo;

            if(pN != undefined){
              var currentDate = new Date();
              var expirationDate = new Date(
                parseInt(pE.substring(6, 10)),
                parseInt(pE.substring(0, 2)) - 1,
                parseInt(pE.substring(3, 5)));

              var purchaseDate = new Date(
                parseInt(pP.substring(6, 10)),
                parseInt(pP.substring(0, 2)) - 1,
                parseInt(pP.substring(3, 5)));

              const DAY_IN_MILLI = 1000 * 60 * 60 * 24;
              var timeUntilExpiration = Math.floor(Math.abs(expirationDate - currentDate) / DAY_IN_MILLI);
              var totalTime = Math.floor(Math.abs(expirationDate - purchaseDate) / DAY_IN_MILLI);

              var progress = document.createElement("div");
              progress.classList.add("progress");

              var progressBar = document.createElement("div");
              progressBar.classList.add("progress-bar");
              progressBar.setAttribute("role", "progressbar");
              progressBar.setAttribute("aria-valuemin", 0);
              progressBar.setAttribute("aria-valuemax", totalTime);
              progressBar.setAttribute("aria-valuenow", 50);
              progressBar.setAttribute('style','width:'+ ((timeUntilExpiration / totalTime) * 100) +'%');

              if(timeUntilExpiration <= 3) {
                progressBar.classList.add("bg-danger");
              } else if (timeUntilExpiration <= 7) {
                progressBar.classList.add("bg-warning");
              } else {
                progressBar.classList.add("bg-success");
              }

              var card = document.createElement("div");
              card.classList.add("card");
              card.classList.add("bg-secondary");

              var cardHeader = document.createElement("div");
              cardHeader.classList.add("card-header");
              var name = document.createTextNode(pN);
              cardHeader.appendChild(name);
              cardHeader.classList.add("bg-secondary");
              card.classList.add("text-light");

              var cardBody = document.createElement("div");
              cardBody.classList.add("card-body");
              cardBody.classList.add("bg-secondary");
              cardBody.classList.add("text-light");

              progress.appendChild(progressBar);
              cardBody.appendChild(progress);

              var cardFooter = document.createElement("div");
              cardFooter.classList.add("card-footer");
              cardFooter.classList.add("bg-secondary");
              cardFooter.classList.add("container");

              var expirationDateDiv = document.createElement("div");
              expirationDateDiv.classList.add("text-center");
              var expirationDateNode = document.createTextNode(timeUntilExpiration + " Days Left!");
              expirationDateDiv.appendChild(expirationDateNode);
              cardBody.appendChild(expirationDateDiv);

              //TODO: Access the freshtracker for a particular user and mark
              //entries as thrown away or used - add to stat page
              var usedButton = document.createElement("BUTTON");
              usedButton.innerHTML = "Use";
              usedButton.onclick = function () {
                   let dref = db.ref('addItem/' + pN);
                   dref.remove()
                   location.reload();
              };

              usedButton.classList.add("col-sm-6");
              usedButton.classList.add("btn");
              usedButton.classList.add("btn-light");

              var throwawayButton = document.createElement("BUTTON");
              throwawayButton.innerHTML = "Thrown Away";
              throwawayButton.onclick = function () {
                   let dref = db.ref('addItem/' + pN);
                   dref.remove()
                   location.reload();
              };

              throwawayButton.classList.add("col-sm-6");
              throwawayButton.classList.add("btn");
              throwawayButton.classList.add("btn-light");

              //TODO: space buttons evenly and style buttons
              cardFooter.appendChild(usedButton);
              cardFooter.appendChild(throwawayButton);

              card.appendChild(cardHeader);
              card.appendChild(cardBody);
              card.appendChild(cardFooter);

              var entry = document.createElement("div");
              entry.classList.add("col-lg-6");
              entry.classList.add("my-sm-3");
              entry.appendChild(card);

              var element = document.getElementById("d1");
              element.appendChild(entry);
          }//end if
        });
      });

    } else {
      // No user is signed in.
    }
  });

  // Attach an asynchronous callback to read the data at our posts reference
  ref.on("value", function (snapshot) {
    console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

}

function writeUserData() {
    var pName = document.getElementById("productName").value;
    var pCat = document.getElementById("productCategory").value;
    var pPurDate = document.getElementById("datePurchased").value;
    var pExpDate = document.getElementById("dateExpire").value;
    var pInfo = document.getElementById("productInfo").value;

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
        // User is signed in.
        firebase.database().ref('Users/' + user.displayName + '/Collected/' + pName).set({
          productName: pName,
          productCategory: pCat,
          productPurchaseDate: pPurDate,
          productExperationDate: pExpDate,
          productInfo: pInfo
        }, (error) => {
          if (error) {
            console.log("Error: Did not insert into database.");
          } else {
            console.log("Success");
            resetForm();
          }
        });
      } else {
        // No user is signed in.
      }
    });
}

getAllElementsOfChildFT("addItem/");
