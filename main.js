/*
    main.ts
    missmp_army_ranking
    Frontend assignment
    by Peter Stadler
    05.07.2023, 22:45 Uhr
*/
var test = "test main.ts works";
console.log(test);
var officers = [];
var general;
var mmp;
var General = /** @class */ (function () {
    function General(general, id, name) {
        this.general = general;
        this.id = id;
        this.name = name;
    }
    General.prototype.moveOfficer = function (officerID, managerID) {
        officers[managerID].subordinates.push(officers[officerID]);
    };
    return General;
}());
var Officer = /** @class */ (function () {
    function Officer(id, name) {
        this.id = id;
        this.name = name;
    }
    return Officer;
}());
function createOfficer() {
    var id = officers.length + 1;
    var name = document.getElementById('name').value;
    //prevent empty officer-names
    if (name != "") {
        officers.push(new Officer(id, name));
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
    officers.forEach(function (element) { temp += element.name + "<br>"; });
    document.getElementById("officers").innerHTML = temp;
}
//initial test objects
mmp = new Officer(1, "MMP");
officers.push(mmp);
general = new General(mmp, 1, "MMP");
//general = new General(1, "MMP");
officers.push(new Officer(2, "Peter"));
officers.push(new Officer(3, "An"));
officers.push(new Officer(4, "Johannes"));
window.onload = function () {
    printAllOfficersToHtml();
};
