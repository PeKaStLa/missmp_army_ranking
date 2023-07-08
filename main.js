/*
    main.ts
    missmp_army_ranking
    Frontend assignment
    by Peter Stadler
    05.07.2023, 22:45 Uhr

    1. Interfaces and classes with OOP functions
    2. variable declarations
    3. single functions
    4. window.onload
*/
var ArmyRankingApp = /** @class */ (function () {
    function ArmyRankingApp(general) {
        this.general = general;
    }
    ArmyRankingApp.prototype.displayHierarchy = function () {
        mmp.printSubordinates();
    };
    ArmyRankingApp.prototype.printAllOfficersToConsole = function () {
        officers.forEach(function (el) {
            console.log(el.name, el.id, el.subordinates);
        });
    };
    //create Office by name from the formular-input. The ID gets assigned automatically
    ArmyRankingApp.prototype.createOfficer = function () {
        var id = officers.length + 1;
        var name = document.getElementById('name').value;
        //prevent empty officer-names
        if (name != "") {
            //create new Officer and push it to the officers-array
            officers.push(new Officer(id, name));
            //push every freshly created officer to MMP-General's subordinates on default!
            app.general.subordinates.push(officers[id - 1]);
            //clear the input-field
            document.getElementById('name').value = "";
            app.displayHierarchy();
        }
    };
    //Move future_subordinate_id to future_officer_id's subordinates.
    ArmyRankingApp.prototype.moveOfficer = function (future_subordinate_id, future_officer_id) {
        if (future_subordinate_id == future_officer_id) {
            console.log("You cannot move an Officer under itself.");
        }
        else if (future_subordinate_id == 1) {
            console.log("You cannot move the general MMP under somebody!");
        }
        else if (isOfficerAlreadySubordinate(future_subordinate_id, future_officer_id)) {
            console.log("future_subordinate_id is already Subordinate of the future_officer_id.");
        }
        else {
            //for moving an Officer under an other officer we need to do 4 tasks.
            var old_officer = whoIsOfficerOfSubordinate(future_subordinate_id);
            //save these variables in case the Geeneral want to undo() its action.
            last_change_old_officer = old_officer;
            last_change_moved_officer = officers[future_subordinate_id - 1];
            last_change_new_officer = officers[future_officer_id - 1];
            //1. remove future_subordinate_id from its old Officer:
            removeSpecificSubordinateFromOfficer(future_subordinate_id, old_officer.id);
            //2. copy the own subordinates from future_subordinate to its old officer
            copySubordinatesToAnotherOfficer(future_subordinate_id, old_officer.id);
            //3. delete future_subordinate_id's old subordinates 
            officers[future_subordinate_id - 1].subordinates = [];
            //4. push future_subordinate_id to future_officer_id's subordinates
            officers[future_officer_id - 1].subordinates.push(officers[future_subordinate_id - 1]);
            //clear the input-fields
            document.getElementById('a').value = "";
            document.getElementById('b').value = "";
            app.displayHierarchy();
        }
    };
    ArmyRankingApp.prototype.undo = function () {
        //Check if an officer was moved before and if there is a past action to undo
        if (last_change_old_officer == undefined) {
            console.log("cannot undo an action because no action was done yet.");
        }
        else if (isOfficerAlreadySubordinate(last_change_moved_officer.id, last_change_old_officer.id)) {
            console.log("Officer ", last_change_moved_officer.name, " already was pushed back to its old officer ", last_change_old_officer.name);
        }
        else {
            //Undo the last action. Therefore we need to undo 4 tasks.
            //1. remove moved Officer from its new Officers' subordinates
            removeSpecificSubordinateFromOfficer(last_change_moved_officer.id, last_change_new_officer.id);
            //2. move back the moved Officer to its old original Officer's subordinates
            last_change_old_officer.subordinates.push(last_change_moved_officer);
            last_change_old_subordinates.forEach(function (el) {
                //3. remove old subordinates from moved_officers' old original officer
                removeSpecificSubordinateFromOfficer(el.id, last_change_old_officer.id);
                //4. add old subordinates to moved_officers' subordinates
                last_change_moved_officer.subordinates.push(el);
            });
            app.displayHierarchy();
        }
    };
    ArmyRankingApp.prototype.redo = function () {
        //Check if an officer was moved before and if there is a past action to undo
        if (last_change_old_officer == undefined) {
            console.log("cannot redo an action because no action was done yet.");
        }
        else {
            console.log("cannot redo an action because no action was done yet.");
            //move back the moved Officer to its last new Officer
            this.moveOfficer(last_change_moved_officer.id, last_change_new_officer.id);
            app.displayHierarchy();
        }
    };
    return ArmyRankingApp;
}());
var Officer = /** @class */ (function () {
    function Officer(id, name) {
        this.subordinates = [];
        this.id = id;
        this.name = name;
    }
    //print this officers' subordinates and also their subordinates inside the visual-div.
    Officer.prototype.printSubordinates = function (level) {
        if (level === void 0) { level = 0; }
        //create needed elements
        var visual = document.getElementById("visual");
        var box = document.createElement("div");
        var text = document.createElement("p");
        var tab = document.createElement("span");
        //add css-style classes 
        box.classList.add("box");
        tab.classList.add("tab");
        text.classList.add("box");
        //clear the HTML-element every time the function gets called
        if (level == 0) {
            visual.innerHTML = "";
        }
        //add the current officers' name to the string
        text.innerHTML = this.name + " (" + this.id + ")";
        //add the correct space to the left of the Officer for making the Hierarchy
        for (var i = level; i > 0; i--) {
            if (i == 1) {
                tab.innerHTML += "&emsp;|_________";
            }
            if (i != 1) {
                tab.innerHTML += "&emsp; &emsp; &emsp; &emsp; &emsp; &emsp;";
            }
        }
        //append the created elements with officer-data and spaces into the line
        box.appendChild(tab);
        box.appendChild(text);
        //tell everysubordinate to do the same
        this.subordinates.forEach(function (element) {
            level = level + 1;
            element.printSubordinates(level);
            level = level + -1;
        });
        //insert all lines to the visual DIV to build up the Hierarchy
        visual.insertBefore(box, visual.firstChild);
    };
    ;
    return Officer;
}());
//
//2. variable declarations
//
var officers = [];
var mmp = new Officer(1, "MMP");
officers.push(mmp);
var app = new ArmyRankingApp(mmp);
var last_change_old_subordinates = [];
var last_change_old_officer;
var last_change_moved_officer;
var last_change_new_officer;
//
//3. single functions
//
function copySubordinatesToAnotherOfficer(old_officer_id, future_officer_id) {
    //clear the old_subordinates every time so every action can be undon correctly
    last_change_old_subordinates = [];
    //call all subordinates and push them to the other officer
    officers[old_officer_id - 1].subordinates.forEach(function (el) {
        officers[future_officer_id - 1].subordinates.push(el);
        //save all pushed subordinates in case General MMP wants to undo its action later
        last_change_old_subordinates.push(el);
    });
}
function removeSpecificSubordinateFromOfficer(old_subordinate_id, old_officer_id) {
    //find out which index the old subordinate has in the officers' subordinate-array
    var index = officers[old_officer_id - 1].subordinates.indexOf(officers[old_subordinate_id - 1]);
    //use the index to cut out the subordinate
    officers[old_officer_id - 1].subordinates.splice(index, 1);
}
function whoIsOfficerOfSubordinate(subordinate_id) {
    var officer;
    //call all officers and look through their subordinates and compare them
    officers.forEach(function (el) {
        if (isOfficerAlreadySubordinate(subordinate_id, el.id)) {
            officer = el;
        }
    });
    //return the subordinates' localised officer.
    return officer;
}
//use isOfficerAlreadySubordinate(), to prevent that one subordinate can get moved under the same officer multiple times
function isOfficerAlreadySubordinate(future_subordinate_id, future_officer_id) {
    // return true if future_subordinate is already in subordinates of future_officer
    return officers[future_officer_id - 1].subordinates.some(function (e) { return e === officers[future_subordinate_id - 1]; });
}
function isOfficerInArray(officer, array) {
    // check if officer-object is in the array
    return array.some(function (e) { return e === officer; });
}
// 
function areAllSubordinatesAlreadySaved(officer, array) {
    //set the variable to true. It can only get set false one way, so that its function is save.
    var all_in_array = true;
    //compare all of the subordinates to the Officers in the array
    officer.subordinates.forEach(function (el) {
        //it is enough if at least one officer is found in the array and seta the variable to false.
        if (!array.some(function (e) { return e === el; })) {
            all_in_array = false;
        }
    });
    return all_in_array;
}
//
//4. window.onload
//
window.onload = function () {
    console.log(app);
    console.log("Apps' General:" + app["general"].name);
    app.displayHierarchy();
};
