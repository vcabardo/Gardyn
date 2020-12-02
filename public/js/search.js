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

function resetForm(){
  document.getElementById("myForm").reset();
  location.reload();
}

//Populate the DOM with a dynamic list of Bootstrap card elements,
//with data taken from the RTDB
function chooseCategory(input){
  if(input == 1) return "Fruits & Veggies";
  else if (input == 2) return "Meat & Protein";
  else if (input == 3) return "Breads & Cereals";
  else if (input == 4) return "Milk & Dairy";
  else if (input == 5) return "Junk Food";
  else if (input == 6) return "Misc.";
  else return "null";
}

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

  var db = firebase.database();
  var ref = db.ref(childName);

  ref.on("value", function (snapshot) {
    snapshot.forEach((child) => {
      var pE = child.val().productExperationDate;
      var pN = child.val().productName;
      var pC = child.val().productCategory;
      var pP = child.val().productPurchaseDate;
      var pNotes = child.val().productInfo;

        if(pN != undefined){
          var card = document.createElement("div");
          card.classList.add("card");
          card.classList.add("bg-secondary");

          var cardHeader = document.createElement("div");
          cardHeader.classList.add("card-header");
          cardHeader.classList.add("row");
          var nameDiv = document.createElement("div")
          nameDiv.classList.add("col-lg-10");
          var nameText = document.createTextNode(pN);
          nameDiv.appendChild(nameText);

          var addButton = document.createElement("BUTTON");
          addButton.innerHTML = "+";
          addButton.onclick = function () {
            //TODO: set a listener to add the entry to the users list
            //TODO: style button
          };
          addButton.classList.add("btn");
          addButton.classList.add("btn-outline-light");
          addButton.classList.add("col-lg-1");

          var removeButton = document.createElement("BUTTON");
          removeButton.innerHTML = "-";
          removeButton.onclick = function () {
            //TODO: set a listener to remove the entry from the users list
            //TODO: style button
          };
          removeButton.classList.add("btn");
          removeButton.classList.add("btn-outline-light");
          removeButton.classList.add("col-lg-1");

          cardHeader.appendChild(nameDiv);
          cardHeader.appendChild(addButton);
          cardHeader.appendChild(removeButton);
          cardHeader.classList.add("bg-secondary");
          card.classList.add("text-light");

          var cardBody = document.createElement("div");
          cardBody.classList.add("card-body");
          cardBody.classList.add("bg-secondary");
          cardBody.classList.add("text-light");

          var node = document.createTextNode( "Product Category: " + chooseCategory(pC));

          cardBody.appendChild(node);

          card.appendChild(cardHeader);
          card.appendChild(cardBody);

          var entry = document.createElement("div");
          entry.classList.add("col-12");
          entry.classList.add("my-sm-3");
          entry.appendChild(card);

          var element = document.getElementById(id);
          element.appendChild(entry);
      }//end if
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

        if(name != undefined){
          var card = document.createElement("div");
          card.classList.add("card");
          card.classList.add("bg-secondary");

          var cardImage = document.createElement("img");
          cardImage.classList.add("card-img-top");
          cardImage.setAttribute("src", "/public/img/" + name + ".jpg");

          var cardHeader = document.createElement("div");
          cardHeader.classList.add("card-header");
          cardHeader.classList.add("row");

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

          addButton.onclick = function() {
            document.getElementById("productName").value = name;
            firebase.auth().onAuthStateChanged(function(user) {
              if (user) {

              } else {
                alert("Please sign in to use this feature");
                document.getElementById("formModal").style.display = "none";
              }
            });
          };
          addButton.classList.add("col-md-2");

          cardHeader.appendChild(nameDiv);
          cardHeader.appendChild(addButton);

          cardHeader.classList.add("bg-secondary");
          card.classList.add("text-light");

          var cardBody = document.createElement("div");
          cardBody.classList.add("card-body");
          cardBody.classList.add("bg-secondary");
          cardBody.classList.add("text-light");

          var node = document.createTextNode( "Shelf Life: " + shelfLife + " Days");

          cardBody.appendChild(node);

          card.appendChild(cardImage);
          card.appendChild(cardHeader);
          card.appendChild(cardBody);

          var entry = document.createElement("div");
          entry.classList.add("col-lg-6");
          entry.classList.add("my-sm-3");
          entry.appendChild(card);

          var element = document.getElementById(id);
          element.appendChild(entry);
      }//end if
    });
  });

  // Attach an asynchronous callback to read the data at our posts reference
  ref.on("value", function (snapshot) {
    console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    getAllElementsOfChild_myList('Users/' + user.displayName + '/Collected/', "d1");
  } else {
    // No user is signed in.
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

//TODO: Write the function for searching the list

getAllElementsOfChild_search("AllItems/", "allitems");
