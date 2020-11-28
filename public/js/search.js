

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


      firebase.database().ref('addItem/' + pName).set({
        productName: pName,
        productCategory: pCat,
        productPurchaseDate: pPurDate,
        productExperationDate: pExpDate,
        productInfo: pInfo
      }, (error) => {
        if (error) {
          console.log("Error: Did not insert into database.");
        } else {
          resetForm();
        }
      });

    
  }
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

function getAllElementsOfChild(childName) {

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

  //TODO: Access the fresh tracker on a user basis
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
          cardHeader.appendChild(name);
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
          entry.classList.add("col-lg-6");
          entry.classList.add("my-sm-3");
          entry.appendChild(card);

          var element = document.getElementById("d1");
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

getAllElementsOfChild("addItem/");
