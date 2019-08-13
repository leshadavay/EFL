/*
* Catholic University of Korea
* Computer Science
* 201521641
* Abdulaziz
* */
function addNewAccount(object) {
    accounts.push(object);
}

function getAccountObject(index) {
    return accounts[index];
}

function checkDuplicate(id) {
    for(var i=0;i<accounts.length;i++){
        if(accounts[i].getId===id){
            alert("This ID is already existed. Enter another ID");
            return false;
        }
    }
    return true;
}
function logInAccount() {
    alert(accounts.length);
    var id=document.getElementById("id").value;
    var password=document.getElementById("password").value;
    var found=false;

    for(var i=0;i<accounts.length;i++){

        if(id===accounts[i].getId&&password=== accounts[i].getPassword()) {
            document.write(accounts[i].getId() + " " + accounts[i].getPassword() + " | " + id + " " + password);
            found = true;
            localStorage.setItem("loginUser", accounts[i].getId);
            alert("Welcome " + accounts[i].mode + ": " + accounts[i].getId);
            break;
        }
    }
    if(!found){
        alert("Wrong ID or Password");
    }

}
function createNewAccout() {
    alert("create");
    var id=document.getElementById("id-sign").value;
    var password=document.getElementById("password-sign").value;
    var password2=document.getElementById("password2-sign").value;
    var usermode=document.getElementById("user-mode");
    var adminmode=document.getElementById("admin-mode");
    var mode;

    if (checkDuplicate(id)) {

        if (password === password2) {
            if (usermode.checked) {
                mode = "User";
            }
            else if (adminmode.checked) {
                mode = "Administrator";
            }
            function getId() {
                return this.id;
            }
            function getPassword() {
                return this.password;
            }
            var account = new Object();
            account.id = id;
            account.password = password;
            account.mode = mode.charAt(0);
            account.eventDate;
            account.eventDetails;
            account.getId=getId;
            account.getPassword=getPassword;
            account.setEvent = setEvent;
            account.removeEvent = removeEvent;
            addNewAccount(account);
            alert("Account successfully created!");
        }

        else {
            alert("Wrong ID or Password");
        }
    }
}

function setEvent(date,details) {
    if(localStorage.getItem("isEvent")==="yes"){
        this.eventDate+=date+"/";
        this.eventDetails+=details+"/";
        alert(this.eventDate+" "+this.eventDetails);
    }
    else {
        this.eventDate=date+"/";
        this.eventDetails=details+"/";
        alert(this.eventDate+" "+this.eventDetails);
    }
}
function removeEvent(date) {
    var tmp=eventDate.split("/");
    for(var i=0;i<tmp.length;i++){
        if(date===tmp[i]){
            alert("found");

        }
    }
}