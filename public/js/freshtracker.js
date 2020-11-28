var usedUp=0;
var thrownAway=0;

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
                var currentDate = new Date();
                var expirationDate = new Date(
                  parseInt(pE.substring(6, 10)),
                  parseInt(pE.substring(0, 2)) - 1,
                  parseInt(pE.substring(3, 5)));
  
                var purchaseDate = new Date(
                  parseInt(pP.substring(6, 10)),
                  parseInt(pP.substring(0, 2)) - 1,
                  parseInt(pP.substring(3, 5)));
  
                const DAY_IN_MILLI = 1000 * 60 * 60 * 24
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
                var progressLabel = document.createTextNode(timeUntilExpiration + " / " + totalTime + " Days Left");
                progressBar.appendChild(progressLabel);
  
                if((timeUntilExpiration / totalTime) <= 0.33) {
                  progressBar.classList.add("bg-danger");
                } else if ((timeUntilExpiration / totalTime) <= 0.7) {
                  progressBar.classList.add("bg-warning");
                } else if ((timeUntilExpiration / totalTime) < 1) {
                  progressBar.classList.add("bg-success");
                }
  
                var card = document.createElement("div");
                card.classList.add("card");
                card.classList.add("bg-secondary");
  
                var cardHeader = document.createElement("div");
                cardHeader.classList.add("card-header");
                var name = document.createTextNode(pN);
                cardHeader.appendChild(name);
                progress.appendChild(progressBar);
                cardHeader.appendChild(progress);
                cardHeader.classList.add("bg-secondary");
                card.classList.add("text-light");
  
                var cardBody = document.createElement("div");
                cardBody.classList.add("card-body");
                cardBody.classList.add("bg-secondary");
                cardBody.classList.add("text-light");
  
                var cardFooter = document.createElement("div");
                cardFooter.classList.add("card-footer");
  
                var node = document.createTextNode( "Product Category: " + chooseCategory(pC) +
                                                  "\nPurchase Date: " + pP +
                                                  "\nExpiration Date: " + pE +
                                                  "\nNotes: " + pNotes
  
                );
  
                cardBody.appendChild(node);
  
                //TODO: Access the freshtracker for a particular user and mark
                //entries as thrown away or used
                var usedButton = document.createElement("BUTTON");
                usedButton.innerHTML = "Use";
                usedButton.onclick = function(){
                      usedUp = usedUp + 1;
                      let dref = db.ref('addItem/' + pN);
                      dref.remove()  
                      location.reload(); 
                };
  
                var throwawayButton = document.createElement("BUTTON");
                throwawayButton.innerHTML = "Thrown Away";
                throwawayButton.onclick = function(){
                      thrownAway= thrownAway + 1;
                      let dref = db.ref('addItem/' + pN);
                      dref.remove()  
                      location.reload(); 
                };
  
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
  
        // Attach an asynchronous callback to read the data at our posts reference
        ref.on("value", function (snapshot) {
          console.log(snapshot.val());
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
  
      }