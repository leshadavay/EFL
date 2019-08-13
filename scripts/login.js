/*
* Catholic University of Korea
* Computer Science
* 201521641
* Abdulaziz
* */

var loginUser; //로그인한 사용자 아이디
var userMode;  //사용자 모드 (일반/관리자)

//마우스 하바시 로그인창 뛰움
function showLoginWindow() {
    //var login=document.getElementById("login-li");
    //if(login.style.ho)

    var w=document.getElementById("login-box");
    w.style.display="block"; //DOM 객체 통해 element 보여주기

    hideSigninWindow();
}
//로그인창 사라지기
function hideLoginWindow() {
    var window=document.getElementById("login-box");
    var form=document.getElementById("login-form");

    window.style.display="none"; //element 사라지기

    form.reset();
}
//sign in 창 뛰우기
function showSigninWindow() {

    hideLoginWindow();
    var window=document.getElementById("signin-box");
    var form=document.getElementById("signin-form");

    window.style.display="block";

}
//sign in 창 사라지기
function hideSigninWindow() {
    var window=document.getElementById("signin-box");
    var form=document.getElementById("signin-form");
    window.style.display="none";
    form.reset(); //폼 에서 그동안의 입력했던 데이타 초기화
    showLoginWindow();
}
//마우스 하바 아닐 경우
function leaveSigninWindow() {
    var window=document.getElementById("signin-box");
    var form=document.getElementById("signin-form");
    window.style.display="none";
    form.reset();

}
//로그인 버튼 클릭 시
function submitLogin() {
    //폼에서 디이터 가져오기
    var id = document.getElementById("id").value;
    var password = document.getElementById("password").value;
    var found = false;

    if (id != "" && password != "") {
        if (typeof (Storage) !== "undefined") {
            //저장소(local storage)에서 사용자 계정이 저장되어 있으면
            if (localStorage.getItem("accounts") != null) {
                //모든 사용자 정보 꺼내기
                var storageID = localStorage.getItem("accounts");
                var storagePW = localStorage.getItem("passwords");
                var accounts = storageID.split(",");
                var passwords = storagePW.split(",");

                //로그인할 계정 존재하는지 검사
                for (var i = 0; i < accounts.length; i++) {
                    var acc = accounts[i].slice(1);
                    var mode = accounts[i].charAt(0);

                    //찾으면 성공 매시지 출력,(사용자 모드 출력, '현재 로그인 사용자' 정보 저장
                    if (acc === id && passwords[i] === password) {
                        localStorage.setItem("loginUser", acc);

                        loginUser = acc;
                        if (mode === "U") userMode = "User";
                        else if (mode === "A") userMode = "Administrator";
                        alert("Welcome " + userMode + ": " + id);
                        found = true;
                        localStorage.setItem("userMode", userMode.charAt(0));
                        location.reload();
                        break;
                    }
                }
            }
            //계정이 없으면 경고창
            if (!found) {
                alert("Wrong Id or Password");
            }
        }
    }else alert("Prompt is empty");

}
//로그아웃 클릭시 '현재 로그인 사용자' 정보 삭재
function logOut() {
    if(typeof (Storage)!=="undefined") {
        localStorage.removeItem("loginUser");
        localStorage.removeItem("userMode");
        location.reload();
    }
}
//게정 만들기 등록 함수
function submitSignin() {
    //폼에서 데이터 가져오기
    var id = document.getElementById("id-sign").value;
    var password = document.getElementById("password-sign").value;
    var password2 = document.getElementById("password2-sign").value;
    var usermode = document.getElementById("user-mode");
    var adminmode = document.getElementById("admin-mode");
    var mode;
    //2가지 비밀번호 서로 맞아야 함
    if (id != "" && password != "") {

        if (password === password2) {
            //사용자 모드 구분
            if (usermode.checked) {
                mode = "User";
            }
            else if (adminmode.checked) {
                mode = "Administrator";
            }

            if (typeof(Storage) !== "undefined") {
                if (localStorage.getItem("loginUser") === null) {
                    //저장소에서 계정이 하나도 없을 경우
                    if (localStorage.getItem("accounts") === null) {

                        var m = mode.charAt(0);
                        localStorage.setItem("accounts", (m + id + ","));
                        localStorage.setItem("passwords", (password + ","));

                    }
                    //저장소에서 계정 1라도 이미 있을 경우
                    else {
                        //모든 계정 먼저 꺼내서 새로운 계정 합치고 다시 저장하기
                        var accounts = localStorage.getItem("accounts");
                        var passwords = localStorage.getItem("passwords");
                        var m = mode.charAt(0);
                        accounts = accounts + m + id + ",";
                        passwords = passwords + password + ",";
                        localStorage.setItem("accounts", accounts);
                        localStorage.setItem("passwords", passwords);

                    }
                }

                alert("Account successfully created!");

            }

        }
        else {
            alert("Passwords are not same, try again");
        }
    } else alert("Prompt is empty");

    showSigninWindow();
}
function errorLogin() {
    alert("Please login first");
}