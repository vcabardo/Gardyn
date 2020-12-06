//Inserts user data into Realtime database Users>Collected
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

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      firebase.database().ref('Users/' + user.displayName + '/Collected/' + pName).set({
        productName: pName,
        productCategory: pCat,
        productPurchaseDate: pPurDate,
        productExperationDate: pExpDate,
        productInfo: pInfo,
        quantity: 1
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
} //end writeUserData

function resetForm() {
  document.getElementById("myForm").reset();
  location.reload();
}

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

function doesFileExist(urlToFile) {
  var xhr = new XMLHttpRequest();
  xhr.open('HEAD', urlToFile, false);
  xhr.send();
  if (xhr.status == "404") {
      return false;
  }
  return true;
}//end doesFileExist

function getAllElementsOfChild_myList(childName, id) {
  var config = {
    apiKey: " AIzaSyAxfhLzaQgDEY-QFO8dc7LZ2aQTXc2fg3k ",
    authDomin: "gardynapp.firebaseapp.com",
    databaseURL: "https://gardynapp.firebaseio.com/",
    storageBucket: "gardynapp.appspot.com"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }

  document.getElementById("d1").innerHTML = "";

  var db = firebase.database();
  var ref = db.ref(childName);

  ref.on("value", function (snapshot) {
    document.getElementById("d1").innerHTML = "";
    snapshot.forEach((child) => {
      var pE = child.val().productExperationDate;
      var pN = child.val().productName;
      var pC = child.val().productCategory;
      var pP = child.val().productPurchaseDate;
      var pNotes = child.val().productInfo;
      var quantity = child.val().quantity;


      if (pN != undefined) {
        var card = document.createElement("div");
        card.classList.add("card");
        card.style.backgroundColor = "#b3614b";

        var cardImage = document.createElement("img");
        cardImage.classList.add("card-img-top");


        //Add image for random
        const path = './img/' + pN + '.jpg';
        var result = doesFileExist(path);

        if (result == true) {
            // yay, file exists!
            cardImage.setAttribute("src", "./img/" + pN + ".jpg");
            console.log(pN);
        } else {
            // file does not exist!
            cardImage.setAttribute("src", "./img/" + "veggieMix" + ".PNG");
        }


        var cardHeader = document.createElement("div");
        cardHeader.classList.add("card-header");
        cardHeader.classList.add("row");
        var nameDiv = document.createElement("div")
        nameDiv.classList.add("col-sm-8");
        nameDiv.id = "number";
        var nameText = document.createTextNode(pN);

        var quantityDiv = document.createElement("div");
        quantityDiv.id = "quantityID" + pN;
        var quantityText = document.createTextNode(" x " + quantity);
        quantityDiv.appendChild(quantityText);

        nameDiv.appendChild(nameText);
        nameDiv.appendChild(quantityDiv);

        var addButton = document.createElement("BUTTON");
        addButton.innerHTML = "+";
        addButton.onclick = function () {
          firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
              // User is signed in.
              var updates = {};
              updates[pN + '/quantity'] = quantity + 1;
              ref.update(updates);

              document.getElementById("quantityID" + pN).innerHTML = " x " + (quantity + 1);
            } else {
              // No user is signed in.
            }
          });
        };
        addButton.classList.add("btn");
        addButton.classList.add("btn-outline-light");
        addButton.classList.add("col-sm-2");
        addButton.setAttribute("data-toggle", "tooltip");
        addButton.setAttribute("data-placement", "top");
        addButton.setAttribute("title", "Click to add another " + pN + " to your list");

        var removeButton = document.createElement("BUTTON");
        removeButton.innerHTML = "-";
        removeButton.onclick = function () {
            //Remove entry from myList
            firebase.auth().onAuthStateChanged(function (user) {
              if (user) {
                // User is signed in.
                var updates = {};
                updates[pN + '/quantity'] = quantity - 1;
                ref.update(updates);

                  document.getElementById("quantityID" + pN).innerHTML = " x " + (quantity - 1);
              } else {
                // No user is signed in.
              }
            });
        };
        removeButton.classList.add("btn");
        removeButton.classList.add("btn-outline-light");
        removeButton.classList.add("col-sm-2");
        removeButton.setAttribute("data-toggle", "tooltip");
        removeButton.setAttribute("data-placement", "top");
        removeButton.setAttribute("title", "Click to remove a(n) " + pN + " from your list");

        var removeEntryButton = document.createElement("BUTTON");
        removeEntryButton.innerHTML = "Remove";
        removeEntryButton.onclick = function () {
          //Remove entry from myList
          firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
              // User is signed in.
              firebase.database().ref('Users/' + user.displayName + '/Collected/' + pN).remove();
              location.reload();
            } else {
              // No user is signed in.
            }
          });
        };

        removeEntryButton.classList.add("btn");
        removeEntryButton.classList.add("btn-outline-light");
        removeEntryButton.classList.add("col-sm-4");
        removeEntryButton.classList.add("float-right");

        cardHeader.appendChild(nameDiv);
        cardHeader.appendChild(removeButton);
        cardHeader.appendChild(addButton);
        cardHeader.style.backgroundColor = "#b3614b";
        card.classList.add("text-light");

        var cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        cardBody.style.backgroundColor = "#b3614b";
        cardBody.classList.add("text-light");
        var node = document.createTextNode("Purchase Date: " + pP);
        cardBody.appendChild(node);

        var cardFooter = document.createElement("div");
        cardFooter.classList.add("card-body");
        cardFooter.style.backgroundColor = "#b3614b";
        cardFooter.classList.add("text-light");
        cardFooter.appendChild(removeEntryButton);

        card.appendChild(cardImage);
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        card.appendChild(cardFooter);

        var entry = document.createElement("div");
        entry.classList.add("col-12");
        entry.classList.add("my-sm-3");
        entry.appendChild(card);

        var element = document.getElementById(id);
        element.appendChild(entry);
      } //end if
    });
  });

  // Attach an asynchronous callback to read the data at our posts reference
  ref.on("value", function (snapshot) {
    console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}

function getAllElementsOfChild_search(childName, id) {
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

  ref.on("value", function (snapshot) {
    snapshot.forEach((child) => {
      var name = child.val().Name;
      var shelfLife = child.val().ShelfLife;

      if (name != undefined) {
        var card = document.createElement("div");
        card.classList.add("card");
        // card.classList.add("bg-secondary");
        card.style.backgroundColor = "#b3614b";

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
        cardHeader.classList.add("row");
        cardHeader.style.backgroundColor = "#b3614b";

        var nameDiv = document.createElement("div")
        nameDiv.classList.add("col-md-10");
        var nameText = document.createTextNode(name);
        nameDiv.appendChild(nameText);
        var addButton = document.createElement("BUTTON");
        addButton.innerHTML = "+";
        addButton.setAttribute("data-toggle", "modal");
        addButton.setAttribute("data-target", "#formModal");
        addButton.classList.add("btn");
        addButton.classList.add("btn-outline-light");

        addButton.onclick = function () {
          document.getElementById("productName").value = name;

          firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
              //user is signed in
              console.log("User signed in.");
            } else {
              //guest signed in
              console.log("Guest signed in.");
              alert("Please sign in/sign up to use this feature.");
              window.location.reload();
            }
          });
        };

        addButton.classList.add("col-md-2");

        cardHeader.appendChild(nameDiv);
        cardHeader.appendChild(addButton);

        card.classList.add("text-light");

        var cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        cardBody.classList.add("text-light");
        cardBody.style.backgroundColor = "#b3614b";

        var node = document.createTextNode("Shelf Life: " + shelfLife + " Days");

        cardBody.appendChild(node);

        card.appendChild(cardImage);
        card.appendChild(cardHeader);
        card.appendChild(cardBody);

        var entry = document.createElement("div");
        entry.classList.add("col-sm-6");
        entry.classList.add("my-sm-3");
        entry.appendChild(card);

        var element = document.getElementById(id);
        element.appendChild(entry);
      } //end if
    });
  });

  // Attach an asynchronous callback to read the data at our posts reference
  ref.on("value", function (snapshot) {
    console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    getAllElementsOfChild_myList('Users/' + user.displayName + '/Collected/', "d1");
  } else {
    document.getElementById("d1").innerHTML = "";
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

// https://stackoverflow.com/questions/11591854/format-date-to-mm-dd-yyyy-in-javascript
function getFormattedDate(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  return month + '/' + day + '/' + year;
}

function addYourOwn() {
  var element = document.getElementById("addYourOwn");
  element.classList.add("card");
  element.innerHTML = "Add Your Own Item"
  element.style.backgroundImage = "url('img/veggieMix.PNG')";
  element.style.backgroundColor = "#b3614b";
  element.style.fontWeight = "900";
  element.style.width = "100%";
  element.style.cursor = "pointer";
  element.classList.add("text-center");
  element.setAttribute("data-toggle", "modal");
  element.setAttribute("data-target", "#formModal");
}

//TODO: Write the function for searching the list

getAllElementsOfChild_search("AllItems/", "allitems");
addYourOwn();
