/*
    main.ts
    missmp_army_ranking
    Frontend assignment
    by Peter Stadler
    05.07.2023, 22:45 Uhr
*/
var test4 = "main.ts works test3";
console.log(test4);
var officers = [];
/*
interface Officer {
    readonly id: number;
    readonly name: string;
    subordinates: Officer[]
}*/
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
    officers.push(new Officer(id, name));
    printAllOfficers();
    printAllOfficersToHtml();
    document.getElementById('name').value = "";
}
function printAllOfficers() {
    officers.forEach(function (element) {
        console.log(element.name, element.id);
    });
}
function printAllOfficersToHtml() {
    var temp = "";
    officers.forEach(function (element) { temp += element.name + "<br>"; });
    document.getElementById("officers").innerHTML = temp;
}
//initial test objects
officers.push(new Officer(1, "Peter"));
officers.push(new Officer(2, "An"));
officers.push(new Officer(3, "Johannes"));
window.onload = function () { printAllOfficersToHtml(); };
