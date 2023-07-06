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
        //app.moveOfficer(id, 1);
        document.getElementById('name').value = "";
        printAllOfficers();
        printAllOfficersToHtml();
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
function printLeftRight() {
    var myP = document.getElementById("leftrightp");
    var already_saved = [];
    var to_use_els = [mmp];
    var removed_from_to_use_els = [];
    var first_element = 1;
    var temp = "";
    var safety_rounds = 30;
    var level = 0;
    var br = "<br>";
    var span = "<span class='tab'></span>";
    var safe = 40;
    var found_end = false;
    var el;
    while (safe >= 1) {
        el = to_use_els[to_use_els.length - 1];
        console.log("use next: ", el.name, "continue_with: ", to_use_els.map(function (a) { return a.name; }));
        console.log("to use next: ", el);
        console.log("to_use_els_continue_names: ", to_use_els.map(function (a) { return a.name; }));
        console.log("to_use_els_continue_length: ", to_use_els.length);
        //console.log("to_use_els_continue_stringify: ", JSON.stringify(to_use_els));
        console.log("already_saved_names: ", already_saved.map(function (a) { return a.name; }));
        console.log("removed_from_to_use_els_names: ", removed_from_to_use_els.map(function (a) { return a.name; }));
        console.log("found_end: ", found_end);
        if (!isOfficerInArray(el, already_saved) &&
            !isOfficerInArray(el, removed_from_to_use_els)) {
            temp += el.name + br;
            already_saved.push(el);
            if (el.subordinates.length === 0) {
                found_end = true;
                if (found_end && isOfficerInArray(el, already_saved)) {
                    to_use_els.pop();
                    removed_from_to_use_els.push(el);
                    found_end = false;
                }
            }
            else if (el.subordinates.length !== 0) {
                el.subordinates.forEach(function (el) {
                    to_use_els.push(el);
                });
            }
            console.log("found_end: ", found_end);
        }
        if (isOfficerInArray(el, already_saved) &&
            areAllSubordinatesAlreadySaved(el, already_saved) &&
            areAllSubordinatesAlreadySaved(el, removed_from_to_use_els)) {
            to_use_els.pop();
            removed_from_to_use_els.push(el);
        }
        safe = safe - 1;
    }
    myP.innerHTML = temp;
}
/*
function printLeftRight() {
    let myP = document.getElementById("leftrightp");

    let already_seen: Officer[] = [];
    let possible_elements: Officer[] = [mmp];
    let first_element = 1;
    let temp = "";
    let safety_rounds = 30;

    while (safety_rounds >= 1) {
        //while (already_seen.length !== officers.length || safety_rounds >= 1) {
        safety_rounds = safety_rounds - 1;

        possible_elements.forEach(el_possible => {
            safety_rounds = safety_rounds - 1;

            officers.forEach(el_officers => {
                safety_rounds = safety_rounds - 1;

                if (el_possible == el_officers && !isOfficerInArray(el_officers, already_seen)) {
                    console.log("gefunden");
                    temp += el_officers.name + '<br>';
                    already_seen.push(el_officers);
                    
                    if (possible_elements.length === 1) {
                        possible_elements = []

                        el_officers.subordinates.forEach(elements_next => {
                            possible_elements.push(elements_next);
                            console.log("already_seen.length: " + already_seen.length);
                            console.log("possible_elements.length: " + possible_elements.length);

                        })
                    }
                }
            })



            /*
                        officers.forEach(el_officers => {
            
                            console.log("already_seen.length: " + already_seen.length);
                                console.log("possible_elements.length: " + possible_elements.length);
            
                                if (el_officers == el_possible && !isOfficerInArray(el_officers, already_seen)) {
                                    temp += el_officers.name + '<br>';
            
                                    already_seen.push(el_officers);
            
                                    if (possible_elements.length === 1) {
                                        possible_elements = []
            
                                        el_officers.subordinates.forEach(elements_next => {
                                            possible_elements.push(elements_next);
                                            console.log("already_seen.length: " + already_seen.length);
                                            console.log("possible_elements.length: " + possible_elements.length);
            
                                        })
                                    }
                                }
                            })
        })
    }
    myP.innerHTML = temp;

}
*/
/*
function printLeftRight() {
    // simple try.. only specific loops when programmed...
    let myP = document.getElementById("leftrightp");
    let temp = "test";
    //myP.innerHTML = temp;
 
    temp += "MMP";
    
    mmp.subordinates.forEach(el => {
        temp += "<br><span class='tab'></span>" + el.name;
 
        el.subordinates.forEach(el => {
            temp += "<br><span class='tab'></span><span class='tab'></span>" + el.name;
 
            el.subordinates.forEach(el => {
                temp += "<br><span class='tab'></span><span class='tab'></span><span class='tab'></span>" + el.name;
    
                el.subordinates.forEach(el => {
                    temp += "<br><span class='tab'></span><span class='tab'></span><span class='tab'></span><span class='tab'></span>" + el.name;
                });
            });
        });
    });
    myP.innerHTML = temp;
}
*/
/*
function printLeftRight() {
    console.log("printLeftRight");
    let myP = document.getElementById("leftrightp");
    let temp = "";
    temp += "MMP";
 
    mmp.subordinates.forEach(el => {
        temp += "<br><span class='tab'>";
        temp += el.name;
 
        el.subordinates.forEach(el => {
            temp += "<br><span class='tab'>";
            temp += el.name;
 
            el.subordinates.forEach(el => {
                temp += "<br><span class='tab'>";
                temp += el.name;
 
                el.subordinates.forEach(el => {
                    temp += "<br><span class='tab'>";
                    temp += el.name;
                })
                temp += "</span>";
            })
            temp += "</span>";
        })
        temp += "</span>";
    })
    temp += "</span>";
 
    myP.innerHTML = temp;
}
*/
//
//4. window.onload
//
window.onload = function () {
    console.log(app);
    console.log("Apps' General:" + app["general"].name);
    //printAllOfficersToHtml();
    //initial test objects
    var peter = new Officer(2, "Peter");
    var an = new Officer(3, "an");
    var johan = new Officer(4, "Johannes");
    var superman = new Officer(5, "superman");
    var iron = new Officer(6, "iron");
    var Garfield = new Officer(7, "Garfield");
    officers.push(peter);
    officers.push(an);
    officers.push(johan);
    officers.push(superman);
    officers.push(iron);
    officers.push(Garfield);
    //officers.push(an);
    //officers.push(new Officer(2, "Peter"));
    //officers.push(new Officer(3, "An"));
    //officers.push(new Officer(4, "Johannes"));
    //officers.push(new Officer(5, "superman"));
    //officers.push(new Officer(6, "iron man"));
    //officers.push(new Officer(7, "Garfield"));
    // officers.push(new Officer(8, "Frodo"));
    //officers.push(new Officer(9, "Gandalf"));
    //officers.push(new Officer(10, "Legolas"));
    //officers.push(new Officer(11, "Gimli"));
    // officers.push(new Officer(12, "Katze"));
    officers[0].subordinates.push(officers[1]);
    officers[0].subordinates.push(officers[2]);
    officers[1].subordinates.push(officers[3]);
    officers[1].subordinates.push(officers[4]);
    officers[1].subordinates.push(officers[5]);
    officers[2].subordinates.push(officers[6]);
    // officers[2].subordinates.push(officers[7]);
    // officers[0].subordinates.push(officers[8]);
    //officers[1].subordinates.push(officers[9]);
    // officers[1].subordinates.push(officers[10]);
    // officers[5].subordinates.push(officers[11]);
    var already_saved = [peter];
    console.log("areAllSubordinatesAlreadySaved: ", areAllSubordinatesAlreadySaved(iron, already_saved));
    console.log("Math random: " + Math.floor(Math.random() * 10));
    //printTopBottom();
    //printLeftRight();
    //printAllOfficers();
};
