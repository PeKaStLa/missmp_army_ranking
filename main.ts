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
    moveOfficer(officerID: number, managerID: number): void
    undo(): void
    redo(): void
}

class ArmyRankingApp implements ArmyRankingAppInterface {
    general: Officer

    constructor(general: Officer) {
        this.general = general;
    }

    //move A under B//Move officerID under managerID//Push A to B's subordinates.
    //but prevent the general to be moved under somebody
    moveOfficer(future_subordinate_id: number, future_officer_id: number) {
        //console.log("inside of moceOfficer");
        if (officers[future_subordinate_id - 1] !== app["general"] && !isOfficerAlreadySubordinate(future_subordinate_id, future_officer_id)) {
            console.log("Not MMP and not already in subordinates. Now move officer:" + officers[future_subordinate_id - 1].name + " under " + officers[future_officer_id - 1].name);
            officers[future_officer_id - 1].subordinates.push(officers[future_subordinate_id - 1]);

        } else if (officers[future_subordinate_id - 1] === app["general"]) {
            console.log("You cannot move the general MMP under somebody!");

        } else if (isOfficerAlreadySubordinate(future_subordinate_id, future_officer_id)) {
            console.log("Officer is already Subordinate of the manager.");
        }
        printAllOfficers();
    }

    undo(): void {
        console.log("doing undo");
    }

    redo(): void {
        console.log("doing redo");
    }

}


interface OfficerInterface {
    readonly id: number;
    readonly name: string;
    subordinates: Officer[]
}

class Officer implements OfficerInterface {
    readonly id: number;
    readonly name: string;
    subordinates: Officer[] = [];

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

//
//2. variable declarations
//

var test: string = "test main.ts works";
console.log(test);

var officers: Officer[] = [];

const mmp: Officer = new Officer(1, "MMP");
officers.push(mmp);
const app: ArmyRankingApp = new ArmyRankingApp(mmp);

//
//3. functions
//

function moveSubordinatesToAnotherOfficer(old_officer_id: number, future_officer_id: number): boolean {
    return true;
}

function removeSubordinateFromOfficer(old_subordinate_id: number, old_officer_id: number): boolean {
    return true;
}

function isOfficerAndSubordinateTheSame(future_subordinate_id: number, future_officer_id: number) {
    return true;
}

// check isOfficerAlreadySubordinate(), to prevent that one subordinate can get moved under the same officer multiple times
function isOfficerAlreadySubordinate(future_subordinate_id: number, future_officer_id: number): boolean {
    // return true if future_subordinate is already in subordinates of future_officer
    // return true if officers[future_subordinate_id - 1] is already in officers[future_officer_id - 1].subordinates
    return officers[future_officer_id - 1].subordinates.some(e => e === officers[future_subordinate_id - 1]);
}


//create Office by name from the formular-input. The ID gets assigned automatically
function createOfficer() {
    console.log("inside createOfficer")
    let id = officers.length + 1;
    let name = (<HTMLInputElement>document.getElementById('name')).value;
    //prevent empty officer-names
    if (name != "") {
        officers.push(new Officer(id, name));
        //console.log("can we move officer:" + officers[id - 1].name);

        // here: move every freshly created officer under MMP-General!
        //app.moveOfficer(id, 1);
        (<HTMLInputElement>document.getElementById('name')).value = "";
        printAllOfficers();
        printAllOfficersToHtml();
    }
}

function printAllOfficers() {
    officers.forEach(element => {
        console.log(element.name, element.id, element.subordinates);
    });
}

function printAllOfficersToHtml() {
    let temp = "";
    temp += "Apps' General:" + app["general"].name + app["general"].id + "<br>";
    officers.forEach(element => { temp += "officer: " + element.name + element.id + "<br>"; });
    document.getElementById("officers").innerHTML = temp;
    //printLeftRight();
}


function isOfficerInArray(officer: Officer, array: Officer[]) {
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


function printLeftRight() {
    let myP = document.getElementById("leftrightp");

    let already_saved: Officer[] = [];
    let to_use_els: Officer[] = [mmp];
    let removed_from_to_use_els: Officer[] = [];
    let first_element = 1;
    let temp = "";
    let safety_rounds = 30;
    let level = 0;
    let br = "<br>";
    let span = "<span class='tab'></span>";
    let safe = 50;
    let found_end = false;
    let el;


    while (safe >= 1) {

        el = to_use_els[to_use_els.length - 1];
        console.log("to_use_els_continue_names: ", to_use_els.map(a => a.name));

        console.log("use next: ", el.name, "continue_with: ", to_use_els.map(a => a.name));
        console.log("to_use_els_continue_length: ", to_use_els.length);

        console.log("to use next: ", el);
        console.log("to_use_els_continue_length: ", to_use_els.length);
        //console.log("to_use_els_continue_stringify: ", JSON.stringify(to_use_els));
        console.log("already_saved_names: ", already_saved.map(a => a.name));
        console.log("removed_from_to_use_els_names: ", removed_from_to_use_els.map(a => a.name));
        console.log("start found_end: ", found_end);
        myP.innerHTML = temp;

        if (!isOfficerInArray(el, already_saved) &&
            !isOfficerInArray(el, removed_from_to_use_els)) {

            temp += el.name + br;
            already_saved.push(el);

            if (el.subordinates.length === 0) {
                found_end = true;
            } else if (el.subordinates.length !== 0) {
                found_end = false;
                el.subordinates.forEach(el => {
                    to_use_els.push(el);
                })
            }
            printAllOfficers();

            console.log("found_end: ", found_end);
        }

        if (found_end && isOfficerInArray(el, already_saved) &&
            areAllSubordinatesAlreadySaved(el, already_saved) &&
            areAllSubordinatesAlreadySaved(el, removed_from_to_use_els)) {
            to_use_els.pop();
            removed_from_to_use_els.push(el);
            //found_end = false;
            if (el.name=="MMP"){
                console.log("Wieder bei MMP angelangt. FINISH!");
                console.log("all_officers: ", officers.map(a => a.name));
                break;
            }
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
    console.log(app)
    console.log("Apps' General:" + app["general"].name)
    //printAllOfficersToHtml();

    //initial test objects
    let peter = new Officer(2, "Peter");
    let an = new Officer(3, "An");
    let johan = new Officer(4, "Rex the dog");
    let superman = new Officer(5, "Superman");
    let iron = new Officer(6, "Ironman");
    let Garfield = new Officer(7, "Garfield");
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
   // let already_saved: Officer[] = [peter];
    //console.log("areAllSubordinatesAlreadySaved: ", areAllSubordinatesAlreadySaved(iron, already_saved));
    console.log("Math random: " + Math.floor(Math.random() * 10));


    //printTopBottom();



    printLeftRight();
    printAllOfficers();


}


