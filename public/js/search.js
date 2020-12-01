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
          var name = document.createTextNode(pN);

          var addButton = document.createElement("BUTTON");
          addButton.innerHTML = "+";
          addButton.onclick = function () {
            //TODO: set a listener to add the entry to the users list
            //TODO: style button
          };

          var removeButton = document.createElement("BUTTON");
          removeButton.innerHTML = "-";
          removeButton.onclick = function () {
            //TODO: set a listener to remove the entry from the users list
            //TODO: style button
          };

          cardHeader.appendChild(name);
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

          var cardHeader = document.createElement("div");
          cardHeader.classList.add("card-header");
          var nameText = document.createTextNode(name);
          var addButton = document.createElement("BUTTON");
          addButton.innerHTML = "+";
          addButton.setAttribute("data-toggle", "modal");
          addButton.setAttribute("data-target", "#formModal");

          addButton.onclick = function() {
            document.getElementById("productName").value = name;
          };

          cardHeader.appendChild(addButton);
          cardHeader.appendChild(nameText);

          cardHeader.classList.add("bg-secondary");
          card.classList.add("text-light");

          var cardBody = document.createElement("div");
          cardBody.classList.add("card-body");
          cardBody.classList.add("bg-secondary");
          cardBody.classList.add("text-light");

          var node = document.createTextNode( "Shelf Life: " + shelfLife + " Days");

          cardBody.appendChild(node);

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
