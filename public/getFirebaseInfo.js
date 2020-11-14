//Populate the DOM with a dynamic list of Bootstrap card elements,
//with data taken from the RTDB
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

    // Attach an asynchronous callback to read the data at our posts reference
    ref.on("value", function(snapshot) {
        var index = 1;
        snapshot.forEach((child) => {
            //display all elements in a dynamic list of bootstrap cards
            var listGroup = document.getElementsByClassName('list-group')[0];
            var newListItem = document.createElement("div");
            newListItem.classList.add("list-group-item");

            //a card populated with information is nested in each list item
            var card = document.createElement("div");
            card.classList.add("card");

            //populate the header with the element's name
            var cardHeader = document.createElement("div");
            cardHeader.classList.add("card-header");

            var cardTop = document.createElement("label")

            //Adjusting the contents of the title based on the contents of the DB
            var titleString = typeof child.val().Number === 'undefined' ? "" : "#" + child.val().Number + ": "
            cardTop.innerText = titleString + typeof child.val().Name === 'undefined' ? child.val().Island : child.val().Name;
            cardTop.style.paddingLeft = "10px"
            cardTop.style.fontSize = "35px"

            cardHeader.appendChild(cardTop);

            var cardBody = document.createElement("div");
            cardBody.classList.add("card-body");
            cardBody.style.fontSize = "25px"


            for (var key of Object.keys(child.val())) {
                //filtering out unecessary info
                if (key == "Number" || key == "Name" || key == "ID" ||
                    key == "Collected" || key == "Northern" || key == "Southern") continue;

                var pNode = document.createElement("li");
                var cardTop = document.createTextNode(key + ": " + child.val()[key]);
                pNode.appendChild(cardTop);
                cardBody.appendChild(pNode);
            }

            card.appendChild(cardHeader);
            card.appendChild(cardBody);
            newListItem.appendChild(card);

            listGroup.appendChild(newListItem);

            index++;
        });
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

//Query the database for all fish that are currently available to the user based
//on the current time
function getAllAvailable(childName) {
    var config = {
        apiKey: " AIzaSyCAMDvc-qvif4fJTuGuHbUmvj1NoN8CXBU",
        authDomin: "nookslookup.firebaseapp.com",
        databaseURL: "https://nookslookup.firebaseio.com/",
        storageBucket: "nookslookup.appspot.com"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    var db = firebase.database();
    var ref = db.ref(childName);

    var availableFish = [];

    ref.on("value", function(snapshot) {
        snapshot.forEach((child) => {
            // Check for current time and hemisphere
            var selector = childName == "Fish" ? 'Month' : 'Hemisphere';
            if (child.val()[selector] == "Year-round (Northern and Southern)") {

                availableFish.push({
                    name: child.val()['Name'],
                    id: child.val()['Number']
                });
            }
        });

        var checkList = document.getElementsByClassName('card-body ' + childName)[0];

        //create a checklist element for every available item
        for (var i = 0; i < availableFish.length; i++) {
            var container = document.createElement("div");
            container.classList.add("form-check");



            var label = document.createElement("label");
            label.classList.add("form-check-label");


            //add a checkbox
            var checkBox = document.createElement("input");
            checkBox.classList.add("form-check-input");
            checkBox.type = "checkbox";

            checkBox.id = availableFish[i].id;



            if (!firebase.apps.length) {
                firebase.initializeApp(config);
            }

            var username;

            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    username = user.displayName;

                    var collected = firebase.database().ref('Users/' + username + "/Collected/");
                    collected.on("value", function(snapshot) {
                        snapshot.forEach((child) => {
                            if (document.getElementById(child.val().id) !== null)
                                document.getElementById(child.val().id).checked = true;
                        });
                    });
                } else {
                    checkList.innerHTML = "Only available for users with an account";
                }
            });

            //This listener listens for a click even and sends the id of the clicked
            //element to the Users/Collected child in the rtdb
            checkBox.addEventListener('click', function(e) {
                    //get the element that was clicked
                    e = e || window.event;
                    var target = e.target || e.srcElement;

                    var username;

                    firebase.auth().onAuthStateChanged(function(user) {
                        if (user) {
                            username = user.displayName;

                            // Must ensure that unchecking removes elements from the list
                            // so that the checklist is always accurate
                            if (!target.checked) {
                                var entry = firebase.database().ref('Users/' + username + "/Collected");

                                entry.on("value", function(snapshot) {
                                    snapshot.forEach((child) => {
                                        if (child.val().id === target.id) {
                                            var reference = firebase.database().ref('Users/' + username + "/Collected/" + child['key'])

                                            //some weird behavior is happening when elements are checked
                                            //and unchecked quickly, reloading solves the problem but bad
                                            //user experience
                                            if (typeof reference !== 'undefined') {
                                                var node = reference.remove();
                                                window.location.reload(false);
                                            }
                                        }
                                    });
                                });
                            }

                            // Push the id of the clicked element to the users node of the rtdb
                            // to construct an individualized list of collected elements for
                            // each user
                            if (target.checked) {
                                var entry = firebase.database().ref('Users/' + username + "/Collected/").push();
                                entry.set({
                                    id: target.id
                                });
                            }


                        } else {
                            checkList.innerHTML = "Only available for users with an account";
                        }
                    });
                }),
                function(errorObject) {
                    console.log("The read failed: " + errorObject.code);
                }

            //dynamically append element to list
            var textNode = document.createTextNode(availableFish[i].name);

            label.appendChild(checkBox);
            label.appendChild(textNode);
            container.appendChild(label);
            checkList.appendChild(container);
        }
    });
}


//Modify so user can select  months for Fish
function getAllAvailableFish(monthNum, hemisphere) {
    var config = {
        apiKey: " AIzaSyCAMDvc-qvif4fJTuGuHbUmvj1NoN8CXBU",
        authDomin: "nookslookup.firebaseapp.com",
        databaseURL: "https://nookslookup.firebaseio.com/",
        storageBucket: "nookslookup.appspot.com"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    var childName = "Fish"

    var db = firebase.database();
    var ref = db.ref(childName);

    var availableFish = [];

    ref.on("value", function(snapshot) {
        snapshot.forEach((child) => {
            //Check for current time and hemisphere
            if (child.val()[hemisphere].includes(monthNum)) {

                availableFish.push({
                    name: child.val()['Name'],
                    id: child.val()['Number']
                });
            }
        });

        var checkList = document.getElementsByClassName('card-body ' + childName)[0];

        //create a checklist element for every available item
        for (var i = 0; i < availableFish.length; i++) {
            var container = document.createElement("div");
            container.classList.add("form-check");



            var label = document.createElement("label");
            label.classList.add("form-check-label");


            //add a checkbox
            var checkBox = document.createElement("input");
            checkBox.classList.add("form-check-input");
            checkBox.type = "checkbox";

            checkBox.id = availableFish[i].id;



            if (!firebase.apps.length) {
                firebase.initializeApp(config);
            }

            var username;

            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    username = user.displayName;

                    var collected = firebase.database().ref('Users/' + username + "/Collected/");
                    collected.on("value", function(snapshot) {
                        snapshot.forEach((child) => {
                            if (document.getElementById(child.val().id) !== null)
                                document.getElementById(child.val().id).checked = true;
                        });
                    });
                } else {
                    checkList.innerHTML = "Only available for users with an account";
                }
            });

            //This listener listens for a click even and sends the id of the clicked
            //element to the Users/Collected child in the rtdb
            checkBox.addEventListener('click', function(e) {
                    //get the element that was clicked
                    e = e || window.event;
                    var target = e.target || e.srcElement;

                    var username;

                    firebase.auth().onAuthStateChanged(function(user) {
                        if (user) {
                            username = user.displayName;

                            // Must ensure that unchecking removes elements from the list
                            // so that the checklist is always accurate
                            if (!target.checked) {
                                var entry = firebase.database().ref('Users/' + username + "/Collected");

                                entry.on("value", function(snapshot) {
                                    snapshot.forEach((child) => {
                                        if (child.val().id === target.id) {
                                            var reference = firebase.database().ref('Users/' + username + "/Collected/" + child['key'])

                                            //some weird behavior is happening when elements are checked
                                            //and unchecked quickly, reloading solves the problem but bad
                                            //user experience
                                            if (typeof reference !== 'undefined') {
                                                var node = reference.remove();
                                                window.location.reload(false);
                                            }
                                        }
                                    });
                                });
                            }

                            // Push the id of the clicked element to the users node of the rtdb
                            // to construct an individualized list of collected elements for
                            // each user
                            if (target.checked) {
                                var entry = firebase.database().ref('Users/' + username + "/Collected/").push();
                                entry.set({
                                    id: target.id
                                });
                            }


                        } else {
                            checkList.innerHTML = "Only available for users with an account";
                        }
                    });
                }),
                function(errorObject) {
                    console.log("The read failed: " + errorObject.code);
                }

            //dynamically append element to list
            var textNode = document.createTextNode(availableFish[i].name);

            label.appendChild(checkBox);
            label.appendChild(textNode);
            container.appendChild(label);
            checkList.appendChild(container);
        }
    });
}






//Modify so user can select months for Bugs
function getAllAvailableBugs(monthNum, hemisphere) {
    var config = {
        apiKey: " AIzaSyCAMDvc-qvif4fJTuGuHbUmvj1NoN8CXBU",
        authDomin: "nookslookup.firebaseapp.com",
        databaseURL: "https://nookslookup.firebaseio.com/",
        storageBucket: "nookslookup.appspot.com"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    console.log("here")
    var childName = "Bugs"

    var db = firebase.database();
    var ref = db.ref(childName);

    var availableBugs = [];

    ref.on("value", function(snapshot) {
        snapshot.forEach((child) => {
            //TODO: Check for current time and hemisphere
            if (child.val()[hemisphere].includes(monthNum)) {

                availableBugs.push({
                    name: child.val()['Name'],
                    id: child.val()['Number']
                });
            }
        });

        var checkList = document.getElementsByClassName('card-body ' + childName)[0];

        //create a checklist element for every available item
        for (var i = 0; i < availableBugs.length; i++) {
            var container = document.createElement("div");
            container.classList.add("form-check");



            var label = document.createElement("label");
            label.classList.add("form-check-label");


            //add a checkbox
            var checkBox = document.createElement("input");
            checkBox.classList.add("form-check-input");
            checkBox.type = "checkbox";

            checkBox.id = availableBugs[i].id;



            if (!firebase.apps.length) {
                firebase.initializeApp(config);
            }

            var username;

            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    username = user.displayName;

                    var collected = firebase.database().ref('Users/' + username + "/Collected/");
                    collected.on("value", function(snapshot) {
                        snapshot.forEach((child) => {
                            if (document.getElementById(child.val().id) !== null)
                                document.getElementById(child.val().id).checked = true;
                        });
                    });
                } else {
                    checkList.innerHTML = "Only available for users with an account";
                }
            });

            //This listener listens for a click even and sends the id of the clicked
            //element to the Users/Collected child in the rtdb
            checkBox.addEventListener('click', function(e) {
                    //get the element that was clicked
                    e = e || window.event;
                    var target = e.target || e.srcElement;

                    var username;

                    firebase.auth().onAuthStateChanged(function(user) {
                        if (user) {
                            username = user.displayName;

                            // Must ensure that unchecking removes elements from the list
                            // so that the checklist is always accurate
                            if (!target.checked) {
                                var entry = firebase.database().ref('Users/' + username + "/Collected");

                                entry.on("value", function(snapshot) {
                                    snapshot.forEach((child) => {
                                        if (child.val().id === target.id) {
                                            var reference = firebase.database().ref('Users/' + username + "/Collected/" + child['key'])

                                            //some weird behavior is happening when elements are checked
                                            //and unchecked quickly, reloading solves the problem but bad
                                            //user experience
                                            if (typeof reference !== 'undefined') {
                                                var node = reference.remove();
                                                window.location.reload(false);
                                            }
                                        }
                                    });
                                });
                            }

                            // Push the id of the clicked element to the users node of the rtdb
                            // to construct an individualized list of collected elements for
                            // each user
                            if (target.checked) {
                                var entry = firebase.database().ref('Users/' + username + "/Collected/").push();
                                entry.set({
                                    id: target.id
                                });
                            }


                        } else {
                            checkList.innerHTML = "Only available for users with an account";
                        }
                    });
                }),
                function(errorObject) {
                    console.log("The read failed: " + errorObject.code);
                }

            //dynamically append element to list
            var textNode = document.createTextNode(availableBugs[i].name);

            label.appendChild(checkBox);
            label.appendChild(textNode);
            container.appendChild(label);
            checkList.appendChild(container);
        }
    });
}

function getFishNBugs(monthNum, hemi) {
    getAllAvailableBugs(monthNum, hemi);
    getAllAvailableFish(monthNum, hemi);
}