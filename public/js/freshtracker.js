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

//checks if files exist in the working directory, primarily used for fetching images in search.html
function doesFileExist(urlToFile) {
  var xhr = new XMLHttpRequest();
  xhr.open('HEAD', urlToFile, false);
  xhr.send();
  if (xhr.status == "404") {
      return false;
  }
  return true;
}//end doesFileExist

//populates the freshtracker with signed in users added items
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

  var db = firebase.database();
  var ref = db.ref(childName);

  //checks if user is signed in
  firebase.auth().onAuthStateChanged(function (user) {
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


          if (pN != undefined) {
            //start populating freshtracker HTML
            var currentDate = new Date();
            var expirationDate = new Date(pE);

            var purchaseDate = new Date(pP);

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
            progressBar.setAttribute('style', 'width:' + ((timeUntilExpiration / totalTime) * 100) + '%');

            if (timeUntilExpiration <= 3) {
              progressBar.classList.add("bg-danger");
            } else if (timeUntilExpiration <= 7) {
              progressBar.classList.add("bg-warning");
            } else {
              progressBar.classList.add("bg-success");
            }

            var card = document.createElement("div");
            card.classList.add("card");
            card.style.backgroundColor = "#b3614b";

            var cardImage = document.createElement("img");
            cardImage.classList.add("card-img-top");

            const path = './img/' + pN + '.jpg';
            var result = doesFileExist(path);

            if (result == true) {
                //file exists!
                cardImage.setAttribute("src", "./img/" + pN + ".jpg");
            } else {
                //file does not exist!
                cardImage.setAttribute("src", "./img/" + "veggieMix" + ".PNG");
            }

            var cardHeader = document.createElement("div");
            cardHeader.classList.add("card-header");
            cardHeader.classList.add("row");
            cardHeader.style.backgroundColor = "#b3614b";

            var nameDiv = document.createElement("div")
            nameDiv.classList.add("col-md-10");
            nameDiv.classList.add("text-light");
            var nameText = document.createTextNode(pN);
            nameDiv.appendChild(nameText);
            cardHeader.appendChild(nameDiv);

            var cardBody = document.createElement("div");
            cardBody.classList.add("card-body");
            cardBody.classList.add("text-light");
            cardBody.style.backgroundColor = "#b3614b";
            progress.appendChild(progressBar);
            cardBody.appendChild(progress);


            var cardFooter = document.createElement("div");
            cardFooter.classList.add("card-footer");
            cardFooter.classList.add("container");

            var expirationDateDiv = document.createElement("div");
            expirationDateDiv.classList.add("text-center");
            var expirationDateNode = document.createTextNode(timeUntilExpiration + " Days Left!");
            expirationDateDiv.appendChild(expirationDateNode);
            cardBody.appendChild(expirationDateDiv);

            var userNotes = document.createTextNode(pNotes);
            var notesTitle = document.createTextNode("My Notes: ");
            cardBody.appendChild(notesTitle);
            cardBody.appendChild(userNotes);

            var usedButton = document.createElement("BUTTON");
            usedButton.innerHTML = "Use";
            usedButton.setAttribute("data-toggle", "modal");
            usedButton.setAttribute("data-target", "#useItemModal");

            usedButton.onclick = function () {
              document.getElementById("productNameUse").value = pN;
              document.getElementById("dateUsed").value = getFormattedDate(currentDate);
              document.getElementById("useConfirm").setAttribute("onclick", "useItem(\"" + pN + "\", \"" + getFormattedDate(currentDate) + "\");");
            };

            usedButton.classList.add("col-sm-6");
            usedButton.classList.add("btn");
            usedButton.classList.add("btn-light");

            var throwawayButton = document.createElement("BUTTON");
            throwawayButton.innerHTML = "Thrown Away";
            throwawayButton.setAttribute("data-toggle", "modal");
            throwawayButton.setAttribute("data-target", "#throwAwayModal");

            throwawayButton.onclick = function () {
              document.getElementById("productNameThrowAway").value = pN;
              document.getElementById("dateThrownAway").value = getFormattedDate(currentDate);
              document.getElementById("throwAwayConfirm").setAttribute("onclick", "throwAwayItem(\"" + pN + "\", \"" + getFormattedDate(currentDate) + "\");");
            };
            throwawayButton.classList.add("col-sm-6");
            throwawayButton.classList.add("btn");
            throwawayButton.classList.add("btn-light");

            cardFooter.appendChild(usedButton);
            cardFooter.appendChild(throwawayButton);

            card.appendChild(cardImage);
            card.appendChild(cardHeader);
            card.appendChild(cardBody);
            card.appendChild(cardFooter);

            var entry = document.createElement("div");
            entry.classList.add("col-sm-6");
            entry.classList.add("my-sm-3");
            entry.appendChild(card);

            var element = document.getElementById("d1");
            element.appendChild(entry);
          } //end if
        });
      });

    } else {
      //no user is signed in
      document.getElementById("d1").innerHTML = "";
      var messageDiv = document.createElement("div");
      messageDiv.classList.add("text-white");
      messageDiv.classList.add("col");
      var messageDivChild = document.createElement("div");
      messageDiv.classList.add("text-center");
      var messageNode = document.createTextNode("Please sign into an account to add items to your list");
      messageDivChild.appendChild(messageNode);
      messageDiv.appendChild(messageDivChild);
      document.getElementById("d1").appendChild(messageDiv);
    }
  });

      // Attach an asynchronous callback to read the data at our posts reference
      ref.on("value", function (snapshot) {
        console.log(snapshot.val());
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

}// end getAllElementsOfChildFT

//format date
function getFormattedDate(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  return month + '/' + day + '/' + year;
}

//remove item from users list and add to users "Used database
function useItem(name, date) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      firebase.database().ref('Users/' + user.displayName + '/Collected/' + name).remove();
      firebase.database().ref('Users/' + user.displayName + '/Stats/Used/' + name).set({
        Name: name,
        Date: date
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

//remove item from users list and add to users "ThrownAway" database
function throwAwayItem(name, date) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      firebase.database().ref('Users/' + user.displayName + '/Collected/' + name).remove();
      firebase.database().ref('Users/' + user.displayName + '/Stats/ThrownAway/' + name).set({
        Name: name,
        Date: date
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

//reloads the html page
function resetForm() {
  location.reload();
}

//populates freshtracker
getAllElementsOfChildFT("addItem/");
