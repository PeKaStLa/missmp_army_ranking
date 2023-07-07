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
    //move A under B//Move officerID under managerID//Push A to B's subordinates.
    //but prevent the general to be moved under somebody
    ArmyRankingApp.prototype.moveOfficer = function (future_subordinate_id, future_officer_id) {
        //console.log("inside of moceOfficer");
        if (officers[future_subordinate_id - 1] !== app["general"] && !isOfficerAlreadySubordinate(future_subordinate_id, future_officer_id)) {
            console.log("Not MMP and not already in subordinates. Now move officer:" + officers[future_subordinate_id - 1].name + " under " + officers[future_officer_id - 1].name);
            officers[future_officer_id - 1].subordinates.push(officers[future_subordinate_id - 1]);
        }
        else if (officers[future_subordinate_id - 1] === app["general"]) {
            console.log("You cannot move the general MMP under somebody!");
        }
        else if (isOfficerAlreadySubordinate(future_subordinate_id, future_officer_id)) {
            console.log("Officer is already Subordinate of the manager.");
        }
        printAllOfficers();
    };
    ArmyRankingApp.prototype.undo = function () {
        console.log("doing undo");
    };
    ArmyRankingApp.prototype.redo = function () {
        console.log("doing redo");
    };
    return ArmyRankingApp;
}());
var Officer = /** @class */ (function () {
    function Officer(id, name) {
        this.subordinates = [];
        this.id = id;
        this.name = name;
    }
    return Officer;
}());
//
//2. variable declarations
//
var test = "test main.ts works";
console.log(test);
var officers = [];
var mmp = new Officer(1, "MMP");
officers.push(mmp);
var app = new ArmyRankingApp(mmp);
//
//3. functions
//
function moveSubordinatesToAnotherOfficer(old_officer_id, future_officer_id) {
    return true;
}
function removeSubordinateFromOfficer(old_subordinate_id, old_officer_id) {
    return true;
}
function isOfficerAndSubordinateTheSame(future_subordinate_id, future_officer_id) {
    return true;
}
// check isOfficerAlreadySubordinate(), to prevent that one subordinate can get moved under the same officer multiple times
function isOfficerAlreadySubordinate(future_subordinate_id, future_officer_id) {
    // return true if future_subordinate is already in subordinates of future_officer
    // return true if officers[future_subordinate_id - 1] is already in officers[future_officer_id - 1].subordinates
    return officers[future_officer_id - 1].subordinates.some(function (e) { return e === officers[future_subordinate_id - 1]; });
}
//create Office by name from the formular-input. The ID gets assigned automatically
function createOfficer() {
    console.log("inside createOfficer");
    var id = officers.length + 1;
    var name = document.getElementById('name').value;
    //prevent empty officer-names
    if (name != "") {
        officers.push(new Officer(id, name));
        //console.log("can we move officer:" + officers[id - 1].name);
        // here: move every freshly created officer under MMP-General!
        app.moveOfficer(id, 1);
        document.getElementById('name').value = "";
        printAllOfficers();
        printAllOfficersToHtml();
        printVisualHierarchyTopLeftToRightBottom();
    }
}
function printAllOfficers() {
    officers.forEach(function (element) {
        console.log(element.name, element.id, element.subordinates);
    });
}
function printAllOfficersToHtml() {
    var temp = "";
    temp += "Apps' General:" + app["general"].name + app["general"].id + "<br>";
    officers.forEach(function (element) { temp += "officer: " + element.name + element.id + "<br>"; });
    document.getElementById("officers").innerHTML = temp;
    //printLeftRight();
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
//first working algorithm
function printLeftRight() {
    var myP = document.getElementById("leftrightp");
    var already_saved = [];
    var to_use_els = [mmp];
    var removed_from_to_use_els = [];
    var temp = "";
    var br = "<br>";
    var span = "<span class='tab'></span>";
    var level = 0;
    var found_end = false;
    var el;
    var reached_end = false;
    while (!reached_end) {
        el = to_use_els[to_use_els.length - 1];
        console.log("to_use_els_continue_names: ", to_use_els.map(function (a) { return a.name; }));
        console.log("use next: ", el.name, "continue_with: ", to_use_els.map(function (a) { return a.name; }));
        console.log("to_use_els_continue_length: ", to_use_els.length);
        console.log("to use next: ", el);
        console.log("to_use_els_continue_length: ", to_use_els.length);
        console.log("already_saved_names: ", already_saved.map(function (a) { return a.name; }));
        console.log("removed_from_to_use_els_names: ", removed_from_to_use_els.map(function (a) { return a.name; }));
        console.log("start found_end: ", found_end);
        myP.innerHTML = temp;
        if (!isOfficerInArray(el, already_saved) && !isOfficerInArray(el, removed_from_to_use_els)) {
            temp += el.name + br;
            already_saved.push(el);
            if (el.subordinates.length === 0) {
                found_end = true;
            }
            else if (el.subordinates.length !== 0) {
                found_end = false;
                el.subordinates.forEach(function (el) {
                    to_use_els.push(el);
                });
            }
            console.log("found_end: ", found_end);
        }
        if (found_end && isOfficerInArray(el, already_saved) && areAllSubordinatesAlreadySaved(el, already_saved) && areAllSubordinatesAlreadySaved(el, removed_from_to_use_els)) {
            to_use_els.pop();
            removed_from_to_use_els.push(el);
            if (el.name == "MMP") {
                console.log("Wieder bei MMP angelangt. FINISH!");
                console.log("all_officers: ", officers.map(function (a) { return a.name; }));
                reached_end = true;
            }
        }
    }
    myP.innerHTML = temp;
}
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
// try the algorithm with visualization now:
function printVisualHierarchyTopLeftToRightBottom() {
    var myP = document.getElementById("leftrightp");
    var already_saved = [];
    var to_use_els = [mmp];
    var removed_from_to_use_els = [];
    var temp = "";
    var br = "<br>";
    var span = "<span class='tab'></span>";
    var level = 0;
    var found_end = false;
    var el;
    var reached_end = false;
    while (!reached_end) {
        el = to_use_els[to_use_els.length - 1];
        console.log("to_use_els_continue_names: ", to_use_els.map(function (a) { return a.name; }));
        console.log("use next: ", el.name, "continue_with: ", to_use_els.map(function (a) { return a.name; }));
        console.log("to_use_els_continue_length: ", to_use_els.length);
        console.log("to use next: ", el);
        console.log("to_use_els_continue_length: ", to_use_els.length);
        console.log("already_saved_names: ", already_saved.map(function (a) { return a.name; }));
        console.log("removed_from_to_use_els_names: ", removed_from_to_use_els.map(function (a) { return a.name; }));
        console.log("start found_end: ", found_end);
        myP.innerHTML = temp;
        if (!isOfficerInArray(el, already_saved) && !isOfficerInArray(el, removed_from_to_use_els)) {
            for (var i = level; i > 0; i--) {
                temp += span;
            }
            temp += el.name + br;
            already_saved.push(el);
            level = level + 1;
            if (el.subordinates.length === 0) {
                found_end = true;
            }
            else if (el.subordinates.length !== 0) {
                found_end = false;
                el.subordinates.forEach(function (el) {
                    to_use_els.push(el);
                });
            }
            console.log("found_end: ", found_end);
        }
        if (found_end && isOfficerInArray(el, already_saved) && areAllSubordinatesAlreadySaved(el, already_saved) && areAllSubordinatesAlreadySaved(el, removed_from_to_use_els)) {
            to_use_els.pop();
            removed_from_to_use_els.push(el);
            level = level - 1;
            if (el.name == "MMP") {
                console.log("Wieder bei MMP angelangt. FINISH!");
                console.log("all_officers: ", officers.map(function (a) { return a.name; }));
                reached_end = true;
            }
        }
    }
    myP.innerHTML = temp;
}
///////////////////////////////////////////////////////////////////////////////////////////////////
//
//4. window.onload
//
window.onload = function () {
    console.log(app);
    console.log("Apps' General:" + app["general"].name);
    //initial test objects
    var peter = new Officer(2, "Peter");
    var an = new Officer(3, "An");
    var johan = new Officer(4, "Rex the dog");
    var superman = new Officer(5, "Superman");
    var iron = new Officer(6, "Ironman");
    var Garfield = new Officer(7, "Garfield");
    officers.push(peter);
    officers.push(an);
    officers.push(johan);
    officers.push(superman);
    officers.push(iron);
    officers.push(Garfield);
    officers.push(new Officer(8, "Frodo"));
    officers.push(new Officer(9, "Gandalf"));
    officers.push(new Officer(10, "Legolas"));
    officers.push(new Officer(11, "Gimli"));
    officers.push(new Officer(12, "Johannes"));
    officers.push(new Officer(13, "John Lennon"));
    officers.push(new Officer(14, "Harry Potter"));
    officers.push(new Officer(15, "Treebeard"));
    officers.push(new Officer(16, "Darth Vader"));
    officers.push(new Officer(17, "Han Solo"));
    officers.push(new Officer(18, "Ahsoka Tano"));
    officers.push(new Officer(19, "King of Thailand"));
    officers.push(new Officer(20, "Olaf Scholz"));
    officers.push(new Officer(21, "Leonardo DiCaprio"));
    officers.push(new Officer(22, "Amelie"));
    officers.push(new Officer(23, "John Biden"));
    officers.push(new Officer(24, "Neil Armstrong"));
    officers.push(new Officer(25, "Audrey Hepburn"));
    officers.push(new Officer(26, "Macron"));
    officers.push(new Officer(27, "Lukas"));
    officers.push(new Officer(28, "Karsten"));
    officers.push(new Officer(29, "Alien"));
    officers.push(new Officer(30, "Polarbear"));
    officers[0].subordinates.push(officers[1]);
    officers[0].subordinates.push(officers[2]);
    officers[1].subordinates.push(officers[3]);
    officers[1].subordinates.push(officers[4]);
    officers[1].subordinates.push(officers[5]);
    officers[2].subordinates.push(officers[6]);
    officers[3].subordinates.push(officers[7]);
    officers[9].subordinates.push(officers[8]);
    officers[3].subordinates.push(officers[9]);
    officers[3].subordinates.push(officers[10]);
    officers[0].subordinates.push(officers[11]);
    officers[20].subordinates.push(officers[12]);
    officers[1].subordinates.push(officers[13]);
    officers[2].subordinates.push(officers[14]);
    officers[11].subordinates.push(officers[15]);
    officers[11].subordinates.push(officers[16]);
    officers[12].subordinates.push(officers[17]);
    officers[11].subordinates.push(officers[18]);
    officers[15].subordinates.push(officers[19]);
    officers[7].subordinates.push(officers[20]);
    officers[6].subordinates.push(officers[21]);
    officers[17].subordinates.push(officers[22]);
    officers[18].subordinates.push(officers[23]);
    officers[23].subordinates.push(officers[24]);
    officers[24].subordinates.push(officers[25]);
    officers[19].subordinates.push(officers[26]);
    officers[20].subordinates.push(officers[27]);
    officers[25].subordinates.push(officers[28]);
    officers[28].subordinates.push(officers[29]);
    //testing of the function areAllSubordinatesAlreadySaved()
    // let already_saved: Officer[] = [peter];
    //console.log("areAllSubordinatesAlreadySaved: ", areAllSubordinatesAlreadySaved(iron, already_saved));
    console.log("Math random: " + Math.floor(Math.random() * 10));
    //printAllOfficers();
    printVisualHierarchyTopLeftToRightBottom();
};
