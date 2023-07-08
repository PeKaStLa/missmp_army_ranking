/*
    main.ts
    missmp_army_ranking
    Frontend assignment
    by Peter Stadler
    05.07.2023, 22:45 Uhr

    1. Interfaces and classes
    2. variable declarations
    3. functions
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
        officers.forEach(function (element) {
            console.log(element.name, element.id, element.subordinates);
        });
    };
    //create Office by name from the formular-input. The ID gets assigned automatically
    ArmyRankingApp.prototype.createOfficer = function () {
        console.log("inside createOfficer");
        var id = officers.length + 1;
        var name = document.getElementById('name').value;
        //prevent empty officer-names
        if (name != "") {
            officers.push(new Officer(id, name));
            // here: push every freshly created officer to MMP-General's subordinates on default!
            app.general.subordinates.push(officers[id - 1]);
            document.getElementById('name').value = "";
            app.displayHierarchy();
        }
    };
    //move A under B. Move future_subordinate_id under future_officer_id 
    //Push future_subordinate_id to future_officer_id's subordinates.
    ArmyRankingApp.prototype.moveOfficer = function (future_subordinate_id, future_officer_id) {
        console.log("inside of moceOfficer");
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
            console.log("Not MMP, not already in subordinates, A and B is not the same one. Now move officer:" + officers[future_subordinate_id - 1].name + " under " + officers[future_officer_id - 1].name);
            var old_officer = whoIsOfficerOfSubordinate(future_subordinate_id);
            last_change_old_officer = old_officer;
            last_change_moved_officer = officers[future_subordinate_id - 1];
            last_change_new_officer = officers[future_officer_id - 1];
            //remove future_subordinate_id from its old Officer:
            removeSpecificSubordinateFromOfficer(future_subordinate_id, old_officer.id);
            //copy the own subordinates from future_subordinate to its old officer
            copySubordinatesToAnotherOfficer(future_subordinate_id, old_officer.id);
            //delete future_subordinate_id's old subordinates 
            officers[future_subordinate_id - 1].subordinates = [];
            //push future_subordinate_id to future_officer_id's subordinates
            officers[future_officer_id - 1].subordinates.push(officers[future_subordinate_id - 1]);
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
        var visual = document.getElementById("visual");
        var box = document.createElement("div");
        var text = document.createElement("p");
        var tab = document.createElement("span");
        box.classList.add("box");
        tab.classList.add("tab");
        text.classList.add("box");
        //clear the HTML-element
        if (level == 0) {
            visual.innerHTML = "";
        }
        //add the current officers' name to the string
        text.innerHTML = this.name + " (" + this.id + ")";
        for (var i = level; i > 0; i--) {
            if (i == 1) {
                tab.innerHTML += "&emsp;|_________";
            }
            if (i != 1) {
                tab.innerHTML += "&emsp; &emsp; &emsp; &emsp; &emsp; &emsp;";
            }
        }
        box.appendChild(tab);
        box.appendChild(text);
        this.subordinates.forEach(function (element) {
            level = level + 1;
            element.printSubordinates(level);
            level = level + -1;
        });
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
//3. functions
//
function copySubordinatesToAnotherOfficer(old_officer_id, future_officer_id) {
    last_change_old_subordinates = [];
    officers[old_officer_id - 1].subordinates.forEach(function (el) {
        officers[future_officer_id - 1].subordinates.push(el);
        last_change_old_subordinates.push(el);
    });
}
function removeSpecificSubordinateFromOfficer(old_subordinate_id, old_officer_id) {
    var index = officers[old_officer_id - 1].subordinates.indexOf(officers[old_subordinate_id - 1]);
    officers[old_officer_id - 1].subordinates.splice(index, 1);
}
function whoIsOfficerOfSubordinate(subordinate_id) {
    var officer;
    officers.forEach(function (el) {
        if (isOfficerAlreadySubordinate(subordinate_id, el.id)) {
            officer = el;
        }
    });
    return officer;
}
// check isOfficerAlreadySubordinate(), to prevent that one subordinate can get moved under the same officer multiple times
function isOfficerAlreadySubordinate(future_subordinate_id, future_officer_id) {
    // return true if future_subordinate is already in subordinates of future_officer
    // return true if officers[future_subordinate_id - 1] is already in officers[future_officer_id - 1].subordinates
    return officers[future_officer_id - 1].subordinates.some(function (e) { return e === officers[future_subordinate_id - 1]; });
}
function isOfficerInArray(officer, array) {
    return array.some(function (e) { return e === officer; });
}
function areAllSubordinatesAlreadySaved(officer, array) {
    var all_in_array = true;
    officer.subordinates.forEach(function (el) {
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
    //app.printAllOfficersToConsole();
    //initial test objects
    var peter = new Officer(2, "Peter");
    var an = new Officer(3, "An");
    var johan = new Officer(4, "Johannes");
    var superman = new Officer(5, "Superman");
    var iron = new Officer(6, "Ironman");
    var garfield = new Officer(7, "Garfield");
    officers.push(peter);
    officers.push(an);
    officers.push(johan);
    officers.push(superman);
    officers.push(iron);
    officers.push(garfield);
    officers[0].subordinates.push(officers[1]);
    officers[0].subordinates.push(officers[2]);
    officers[0].subordinates.push(officers[3]);
    officers[2].subordinates.push(officers[4]);
    officers[3].subordinates.push(officers[5]);
    officers[3].subordinates.push(officers[6]);
    //////////////////////////////////////////////////
    //tested until Here 
    ///////////////////////////////////////////////////
    app.displayHierarchy();
};
