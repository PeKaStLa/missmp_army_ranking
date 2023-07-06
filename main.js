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
    ArmyRankingApp.prototype.moveOfficer = function (officerID, managerID) {
        //console.log("inside of moceOfficer");
        if (officers[officerID - 1] !== app["general"]) {
            console.log("Not MMP. Now move officer:" + officers[officerID - 1].name);
            officers[managerID - 1].subordinates.push(officers[officerID - 1]);
        }
        else if (officers[officerID - 1] === app["general"]) {
            console.log("You cannot move the general MMP under somebody!");
        }
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
var a;
var b;
//
//3. functions
//
//create Office by name from the formular-input. The ID gets assigned automatically
function createOfficer() {
    console.log("inside createOfficer");
    var id = officers.length + 1;
    var name = document.getElementById('name').value;
    //prevent empty officer-names
    if (name != "") {
        officers.push(new Officer(id, name));
        //console.log("can we move officer:" + officers[id - 1].name);
        app.moveOfficer(id, 1);
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
/*
function handleClick(officer: Officer){
    console.log("A-officer:" + a);
    console.log("B-officer:" + b);
    if (a == undefined){
        a = officer;
    } else if(b == undefined){
        b = officer;
    }
    console.log("A-officer:" + a);
    console.log("B-officer:" + b);
}
*/
function printAllOfficersToHtml() {
    var temp = "";
    temp += "Apps' General:" + app["general"].name + app["general"].id + "<br>";
    officers.forEach(function (element) { temp += "officer: " + element.name + element.id + "<br>"; });
    document.getElementById("all_officers_p").innerHTML = temp;
    //let ps = [];
    var officer_div = document.getElementById('all_officers_div');
    officer_div.innerHTML = "";
    officers.forEach(function (element) {
        var temp2 = element.name + " : " + element.id;
        var p_el = document.createElement("p");
        var el_id = element.id;
        //p_el.innerHTML="";
        p_el.innerHTML = temp2;
        p_el.setAttribute("onclick", 'handleClick(element)');
        p_el.onclick = function handleClick(el_id) {
            console.log("A-officer:" + officers[a - 1]);
            console.log("B-officer:" + officers[b - 1]);
            if (a == undefined) {
                a = element.id;
            }
            else if (b == undefined) {
                b = element.id;
            }
            console.log("A-officer:" + a);
            console.log("B-officer:" + b);
        };
        //p_el.setAttribute("element", "#");
        //p_el.setAttribute("#", "element");
        p_el.setAttribute("class", "officer");
        //p_el.addEventListener('click', handleClick(element), false);
        //p_el.onclick = handleClick(this.element);
        //p_el.setAttribute("onclick","handleClick(element);");
        officer_div.appendChild(p_el);
        //officer_div?.replaceChildren(p_el);
    });
}
//
//4. window.onload
//
window.onload = function () {
    console.log(app);
    console.log("Apps' General:" + app["general"].name);
    printAllOfficersToHtml();
    //initial test objects
    /*
    let peter = new Officer(2, "Peter");
    let joh = new Officer(3, "joh");
    let an = new Officer(4, "an");

    officers.push(peter);
    officers.push(joh);
    officers.push(an);
    */
    //officers.push(new Officer(2, "Peter"));
    //officers.push(new Officer(3, "An"));
    //officers.push(new Officer(4, "Johannes"));
    //officers[1].subordinates.push(officers[2]);
    //officers[1].subordinates.push(officers[3]);
};
