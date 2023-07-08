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

//
//1. Interfaces and classes
//

interface ArmyRankingAppInterface {
    general: Officer
    displayHierarchy(): void
    printAllOfficersToConsole(): void
    createOfficer(): void
    moveOfficer(future_subordinate_id: number, future_officer_id: number): void
    undo(): void
    redo(): void
}

class ArmyRankingApp implements ArmyRankingAppInterface {
    general: Officer

    constructor(general: Officer) {
        this.general = general;
    }

    displayHierarchy(): void {
        mmp.printSubordinates();
    }


    printAllOfficersToConsole(): void {
        officers.forEach(element => {
            console.log(element.name, element.id, element.subordinates);
        });
    }

    //create Office by name from the formular-input. The ID gets assigned automatically
    createOfficer(): void {
        console.log("inside createOfficer")
        let id = officers.length + 1;
        let name = (<HTMLInputElement>document.getElementById('name')).value;

        //prevent empty officer-names
        if (name != "") {
            officers.push(new Officer(id, name));
            // here: push every freshly created officer to MMP-General's subordinates on default!
            app.general.subordinates.push(officers[id - 1]);
            (<HTMLInputElement>document.getElementById('name')).value = "";
            app.displayHierarchy();
        }
    }

    //move A under B. Move future_subordinate_id under future_officer_id 
    //Push future_subordinate_id to future_officer_id's subordinates.
    moveOfficer(future_subordinate_id: number, future_officer_id: number): void {
        console.log("inside of moceOfficer");

        if (future_subordinate_id == future_officer_id) {
            console.log("You cannot move an Officer under itself.");

        } else if (future_subordinate_id == 1) {
            console.log("You cannot move the general MMP under somebody!");

        } else if (isOfficerAlreadySubordinate(future_subordinate_id, future_officer_id)) {
            console.log("future_subordinate_id is already Subordinate of the future_officer_id.");

        } else {
            console.log("Not MMP, not already in subordinates, A and B is not the same one. Now move officer:" + officers[future_subordinate_id - 1].name + " under " + officers[future_officer_id - 1].name);
            let old_officer = whoIsOfficerOfSubordinate(future_subordinate_id);

            last_change_old_officer = old_officer;
            last_change_moved_officer = officers[future_subordinate_id - 1];
            last_change_new_officer = officers[future_officer_id - 1];

            //remove future_subordinate_id from its old Officer:
            removeSpecificSubordinateFromOfficer(future_subordinate_id, old_officer.id);

            //copy the own subordinates from future_subordinate to its old officer
            copySubordinatesToAnotherOfficer(future_subordinate_id, old_officer.id)

            //delete future_subordinate_id's old subordinates 
            officers[future_subordinate_id - 1].subordinates = [];

            //push future_subordinate_id to future_officer_id's subordinates
            officers[future_officer_id - 1].subordinates.push(officers[future_subordinate_id - 1]);

            (<HTMLInputElement>document.getElementById('a')).value = "";
            (<HTMLInputElement>document.getElementById('b')).value = "";

            app.displayHierarchy();

        }

    }

    undo(): void {
        // undo last change like redo() or moveOfficer()
        console.log("doing undo");
        //console.log("last_change_moved_officer: ", last_change_moved_officer)
        //console.log("last_change_old_officer: ", last_change_old_officer)
        if (last_change_old_officer == undefined) {
            console.log("cannot undo an action because no action was done yet.");

        } else if (isOfficerAlreadySubordinate(last_change_moved_officer.id, last_change_old_officer.id)) {
            console.log("Officer ", last_change_moved_officer.name, " wurde bereits zurueck zu officer ", last_change_old_officer.name, " verschoben")

        } else {
            //remove moved Officer from its new Officers' subordinates
            removeSpecificSubordinateFromOfficer(last_change_moved_officer.id, last_change_new_officer.id);

            //move back the moved Officer to its old original Officer's subordinates
            last_change_old_officer.subordinates.push(last_change_moved_officer);

            last_change_old_subordinates.forEach(el => {
                //remove old subordinates from moved_officers' old original officer
                removeSpecificSubordinateFromOfficer(el.id, last_change_old_officer.id);
                //add old subordinates to moved_officers' subordinates
                last_change_moved_officer.subordinates.push(el);
            })
            app.displayHierarchy();
        }
    }

    redo(): void {
        console.log("doing redo");
        if (last_change_old_officer == undefined) {
            console.log("cannot redo an action because no action was done yet.");

        } else {
            console.log("cannot redo an action because no action was done yet.");
            //move back the moved Officer to its last new Officer
            this.moveOfficer(last_change_moved_officer.id, last_change_new_officer.id);
            app.displayHierarchy();
        }

    }
}


interface OfficerInterface {
    readonly id: number;
    readonly name: string;
    subordinates: Officer[];
    printSubordinates(): void;
}

class Officer implements OfficerInterface {
    readonly id: number;
    readonly name: string;
    subordinates: Officer[] = [];

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    printSubordinates(level: number = 0): void {
        console.log("This.name: " + this.name + " ID: " + this.id + " Level: " + level);
        //console.log("level: ", level)
        console.log("start")

        //the in the end to be printed string
        let br = "<br>";
        let span = "<span class='tab'></span>";
        let counter = 0;
        let visual = document.getElementById("visual");
        let box = document.createElement("div");
        let empty_line_box = document.createElement("div");
        let text = document.createElement("p");
        let tab = document.createElement("span");
        //let already: { [id: string] : [level: number] } = {};

        //already: [] = [ "id": 1, "levels": 0 ];
        box.classList.add("box");
        tab.classList.add("tab");
        text.classList.add("box");

        //clear the HTML-element
        if (level == 0) { visual.innerHTML = ""; already_id = []; already_level = []; }

        //add the current officers' name to the string
        text.innerHTML = this.name + " (" + this.id + ")";
        console.log("bitte specihern jetzt")
        already_id.push(this.id);
        already_level.push(level);

        let set = false;
        for (let i = level; i > 0; i--) {
            tab.innerHTML += "&emsp;";

            already_id.forEach(el => {
                if (!set) {

                    let all_subs_displayed = true;

                    officers[el - 1].subordinates.forEach(element => {

                        if (already_id.some(e => e == element.id)) {
                            console.log("aktueller officers[el - 1]: ", officers[el - 1])
                            console.log("sub is saved: ", element.name)
                        } else {
                            all_subs_displayed = false;
                        }
                    })

                    
                    if (!all_subs_displayed) {
                        if (already_level[already_id.indexOf(el)] == level) {
                            //tab.innerHTML += "|";
                            set = true;
                        }
                    } else {
                        console.log("all_subs_displayed is true: ", all_subs_displayed)
                    }
                }
            })

            set = false;
            if (i != 1) { tab.innerHTML += "&emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp;"; }

            if (i == 1) {
                tab.innerHTML += "&emsp;|";
                // without this last line here, all end-officers have this line missing..
                //tab.innerHTML += "&emsp;|";
                tab.innerHTML += "_________";
            }
            //until here for i in level
        }

        box.appendChild(tab);
        box.appendChild(text);

        this.subordinates.forEach(element => {
            level = level + 1;
            counter = counter + 1;
            element.printSubordinates(level);
            level = level + - 1;
        });
        //visual.appendChild(box);
        visual.insertBefore(box, visual.firstChild);
        //until here function printSubordinates
    };
}

//
//2. variable declarations
//

var test: string = "test main.ts works";
console.log(test);

var officers: Officer[] = [];
var already_id = [];
var already_level = [];


const mmp: Officer = new Officer(1, "MMP");
officers.push(mmp);
const app: ArmyRankingApp = new ArmyRankingApp(mmp);

var last_change_old_subordinates: Officer[] = [];
var last_change_old_officer: Officer;
var last_change_moved_officer: Officer;
var last_change_new_officer: Officer;

//
//3. functions
//

function copySubordinatesToAnotherOfficer(old_officer_id: number, future_officer_id: number): void {
    last_change_old_subordinates = [];
    officers[old_officer_id - 1].subordinates.forEach(el => {
        officers[future_officer_id - 1].subordinates.push(el);
        last_change_old_subordinates.push(el)
    })
}

function removeSpecificSubordinateFromOfficer(old_subordinate_id: number, old_officer_id: number): void {
    let index = officers[old_officer_id - 1].subordinates.indexOf(officers[old_subordinate_id - 1]);
    officers[old_officer_id - 1].subordinates.splice(index, 1);
}


function whoIsOfficerOfSubordinate(subordinate_id: number): Officer {
    let officer;
    officers.forEach(el => {
        if (isOfficerAlreadySubordinate(subordinate_id, el.id)) {
            officer = el;
        }
    })
    return officer;
}

// check isOfficerAlreadySubordinate(), to prevent that one subordinate can get moved under the same officer multiple times
function isOfficerAlreadySubordinate(future_subordinate_id: number, future_officer_id: number): boolean {
    // return true if future_subordinate is already in subordinates of future_officer
    // return true if officers[future_subordinate_id - 1] is already in officers[future_officer_id - 1].subordinates
    return officers[future_officer_id - 1].subordinates.some(e => e === officers[future_subordinate_id - 1]);
}





function printAllOfficersToHtml() {
    let temp = "";
    temp += "Apps' General:" + app["general"].name + app["general"].id + "<br>";
    officers.forEach(element => { temp += "officer: " + element.name + element.id + "<br>"; });
    document.getElementById("officers").innerHTML = temp;
    //printLeftRight();
}

function isOfficerInArray(officer: Officer, array: Officer[]): boolean {
    return array.some(e => e === officer);
}

function areAllSubordinatesAlreadySaved(officer: Officer, array: Officer[]): boolean {
    let all_in_array = true;
    officer.subordinates.forEach(el => {
        if (!array.some(e => e === el)) {
            all_in_array = false;
        }
    })
    return all_in_array;
}


//
//4. window.onload
//

window.onload = function () {
    console.log(app)
    console.log("Apps' General:" + app["general"].name)

    //printAllOfficersToHtml();
    //app.printAllOfficersToConsole();

    //initial test objects
    let peter = new Officer(2, "Peter");
    let an = new Officer(3, "An");
    let johan = new Officer(4, "Johannes");
    let superman = new Officer(5, "Superman");
    let iron = new Officer(6, "Ironman");
    let garfield = new Officer(7, "Garfield");

    officers.push(peter);
    officers.push(an);
    officers.push(johan);
    officers.push(superman);
    officers.push(iron);
    officers.push(garfield);

    /*
    officers[0].subordinates.push(officers[1]);
    officers[0].subordinates.push(officers[2]);
    officers[0].subordinates.push(officers[3]);
    officers[2].subordinates.push(officers[4]);
    officers[3].subordinates.push(officers[5]);
    officers[3].subordinates.push(officers[6]);
*/

    //////////////////////////////////////////////////
    //tested until Here 
    ///////////////////////////////////////////////////

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

    app.displayHierarchy();

}


