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
        }
        this.general.printSubordinates();
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
            //Entfernen des future_subordinate_id vom alten Officer:
            removeSpecificSubordinateFromOfficer(future_subordinate_id, old_officer.id);
            //nachrücken der alten Subs vom future_subordinate_id zum alten Officer
            copySubordinatesToAnotherOfficer(future_subordinate_id, old_officer.id);
            //delete future_subordinate_id's old subordinates 
            officers[future_subordinate_id - 1].subordinates = [];
            //push future_subordinate_id to subordinates of future_officer_id
            officers[future_officer_id - 1].subordinates.push(officers[future_subordinate_id - 1]);
            document.getElementById('a').value = "";
            document.getElementById('b').value = "";
        }
        this.general.printSubordinates();
    };
    ArmyRankingApp.prototype.undo = function () {
        // undo last change like redo() or moveOfficer()
        console.log("doing undo");
        if (!isOfficerAlreadySubordinate(last_change_moved_officer.id, last_change_old_officer.id)) {
            //remove moved Officer from new Officers' subordinates
            removeSpecificSubordinateFromOfficer(last_change_moved_officer.id, last_change_new_officer.id);
            //push officer to old_officers' subordinated
            last_change_old_officer.subordinates.push(last_change_moved_officer);
            last_change_old_subordinates.forEach(function (el) {
                //remove old subordinates from old officer
                removeSpecificSubordinateFromOfficer(el.id, last_change_old_officer.id);
                //add old subordinates to moved_officer
                last_change_moved_officer.subordinates.push(el);
            });
        }
        else {
            console.log("Officer ", last_change_moved_officer.name, " wurde bereits zurueck zu officer ", last_change_old_officer.name, " verschoben");
        }
        this.general.printSubordinates();
    };
    ArmyRankingApp.prototype.redo = function () {
        console.log("doing redo");
        this.moveOfficer(last_change_moved_officer.id, last_change_new_officer.id);
        this.general.printSubordinates();
    };
    return ArmyRankingApp;
}());
var Officer = /** @class */ (function () {
    function Officer(id, name) {
        this.subordinates = [];
        this.id = id;
        this.name = name;
    }
    Officer.prototype.printSubordinates = function (level) {
        if (level === void 0) { level = 0; }
        var myP = document.getElementById("oop");
        //clear the HTML-element
        if (level == 0) {
            myP.innerHTML = "";
        }
        //console.log(" Doing printSubordinates() now in: ", this.name, this.id);
        var br = "<br>";
        var span = "<span class='tab'></span>";
        //the in the end to be printed string
        var temp = "";
        for (var i = level; i > 0; i--) {
            //level adds the right amount of space to the left
            temp += span;
        }
        //add the current officers' name to the string
        temp = temp + this.name + " " + this.id + br;
        this.subordinates.forEach(function (element) {
            level = level + 1;
            element.printSubordinates(level);
            level = level + -1;
        });
        myP.innerHTML = temp + myP.innerHTML;
    };
    ;
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
//
//4. window.onload
//
window.onload = function () {
    console.log(app);
    console.log("Apps' General:" + app["general"].name);
    app.general.printSubordinates();
    printAllOfficersToHtml();
    app.printAllOfficersToConsole();
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
    /*
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
    
        */
    //testing of the function areAllSubordinatesAlreadySaved()
    // let already_saved: Officer[] = [peter];
    //console.log("areAllSubordinatesAlreadySaved: ", areAllSubordinatesAlreadySaved(iron, already_saved));
    //console.log("Math random: " + Math.floor(Math.random() * 10));
    //console.log("Test: ", isOfficerAlreadySubordinate(12, 12));
    //console.log("Test: ", whoIsOfficerOfSubordinate(3));
    //console.log("test: ", officers[19].subordinates[0].name);
    //removeSpecificSubordinateFromOfficer(27, 20);
    //console.log("test: ", officers[19].subordinates);
    //copySubordinatesToAnotherOfficer(18, 20);
    //console.log("test: ", officers[19].subordinates);
    //printAllOfficersToHtml();
    //app.general.printSubordinates();
    //app.printAllOfficersToConsole();
    app.general.printSubordinates();
};
