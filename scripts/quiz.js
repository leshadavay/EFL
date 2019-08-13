/*
* Catholic University of Korea
* Computer Science
* 201521641
* Abdulaziz
* */

//2가지 퀴즈에 대한 객체 먼저 생성
var quiz = new Object();

quiz.mode; //퀴즈 모드 -> 단어 찾기 모드 또는 문장 완성 모드
quiz.wordsE;
quiz.wordsK;
quiz.stage;
quiz.tmpEnglish;
quiz.tmpKorean;
quiz.wordsLength;
quiz.progress;
quiz.progressInPercent;
quiz.answerWords;
quiz.lastPopE;
quiz.lastPopK;
quiz.wrongWordsE=[]; //4 개 틀린 랜덤 영어 단어 추출
quiz.wrongWordsK=[]; //4 개 틀린 랜덤 한국어 단어 추출

//모드 2
quiz.dragID;
quiz.dragIndex;
quiz.currentSentence;
quiz.allSentences;
quiz.shuffleWords=[];
quiz.dropAnswers=[];

quiz.isGameStarted;

quiz.initQuiz=initQuiz;



//메인 페이지 방문 시 기존 퀴즈 모드 삭제
localStorage.removeItem("quizMode");

//퀴즈 초기화 함수
function initQuiz() {
    if (typeof (Storage) != "undefined") {
        if(localStorage.getItem("quizMode")==null){
            //저장소에서 기본 단어들이 없으면 영문 단어와 해당 단어의 올바른 의미를 로컬 스토리즈에 저장
            if(localStorage.getItem("wordsE")==null){
                quiz.wordsE="acquaint/attendant/clarify/disclose/fulfill/inquiry/liable/obscure/pursue/relevant/significant/sternly";
                quiz.wordsK="익히다, 숙지하다/안내원, 참석자/분명히 하다/밝히다, 드러내다/이행하다/질문, 문의/~하기 위운, ~할 것 같은/덮어 감추다/추구하다, 밀고 나가다/관련된/상당한, 의미 있는, 중대한/엄격하게";
                localStorage.setItem("wordsE",quiz.wordsE);
                localStorage.setItem("wordsK",quiz.wordsK);

            }
            //단어들 이미 있을 경우
            else{
                quiz.wordsE =localStorage.getItem("wordsE");
                quiz.wordsK =localStorage.getItem("wordsK");

            }
            //모드 2 -> 저장소에서 문장들 없을 경우 새로 생성
            if(localStorage.getItem("sentences")==null){
                var allSentences="I don't know what to do/it rained on my only day off, just my luck!/the brown dog with the red collar always barks loudly/working at the computer all day made David's head ache/I've read that book three times/she called him an idiot!/I saw her standing there";
                localStorage.setItem("sentences",allSentences);

            }

            quiz.answerWords= (localStorage.getItem("wordsK")).split("/");
            quiz.progress=0;
            quiz.progressInPercent=0;

            //메인 화면 출력하기
            var quizbox=document.getElementById("quiz-box");
            quizbox.innerHTML="<table><caption><h1 class='h1'>Select quiz</h1></caption>" +
                "<tr><td><input class='button-options' id='button-words' type='button' value='Match word' onclick='selectMatchWordMode()'></td><td><input class='button-options' id='button-sentences' type='button' value='Complete sentence' onclick='selectMakeSentenceMode()'></td></tr>";

            //로그인 모드가 관리자일 경우 관리자 setting 버튼 표시
            if(localStorage.getItem("userMode")==="A"){

                quizbox.innerHTML+= "<tr><td colspan='2'><input class='admin-button-options' type='submit' value='Quiz settings (Administrator mode)' onclick='selectAdministratorMode();'> </td></tr>";
            }
            quizbox.innerHTML+="</table>";
        }

    }

}
//단어 찾기 버튼을 클릭시 게임 시작해주는 함수
function selectMatchWordMode() {
    if (typeof (Storage) != "undefined") {
        localStorage.setItem("quizMode","1");
        quiz.stage = 1;
        quiz.isGameStarted=false; //  wordMatchQuiz() 함수 안에 start=true
        wordMatchQuiz();
    }

}
//문장 완성 버튼을 클릭시 게임 시작해주는 함수
function selectMakeSentenceMode() {
    if (typeof (Storage) != "undefined") {
        localStorage.setItem("quizMode","2");
        quiz.isGameStarted=false;
        makeSentenceQuiz();
    }

}
//관리자 모드 setting 버튼 클릭시
function selectAdministratorMode() {
    if (typeof (Storage) != "undefined") {
        localStorage.setItem("quizMode","3");
        settings();
    }

}
//기본적으로 13개 단어 배열로 생성됨
//단어 찾기 모드 -> 작동 구조는 모든 배열 안에 있는 단어들을 먼저 shuffle 하고 맨 마지막 요소를 추출
// (함수 매개변수에는  그 마지막 요소의 영문과 하국어 의미
function printRandomMeaning(question,answer,words) {
    quiz.lastPopE=question;
    quiz.lastPopK=answer;

    //stage 0 에서 틀린 단어 클릭 시 -> stage 0 으로 계속 유지, 틀린 단어를 배열에 다시 push
    if(quiz.progress>-1) {
        quiz.wrongWordsE.push(question);
        quiz.wrongWordsK.push(answer);
    }

    var randomNumbers="";
    var randomWords=[];

    //화면의 div 태그 id
    var quizbox = document.getElementById("quiz-box");

    //quizbox.innerHTML+="pop:"+words+"<br><br>answers: "+quiz.answerWords+"<br><br>answer is:"+answer;

    //배열(모든 단어) 에서 4개 랜덤 단어 추출
    for(var i=0;i<4;i++){
        var r;
        while (true) {//중복 단어 발생되면 다시 랜덤 추출
            r= Math.floor(Math.random() * quiz.wordsLength);
            if (!randomNumbers.includes((r.toString()))) {
                break;
            }
        }
        randomNumbers += r.toString();
        randomWords.push(quiz.answerWords[r]);

    }
    //quizbox.innerHTML+="<h3>random numbers: "+randomNumbers+"</h3>";

    //오른 단어의 위치 (1~4) 랜덤 설정
    var answerIndex=Math.floor(Math.random() * 4);
    randomWords[answerIndex]=answer;

    //quizbox.innerHTML+="<p>answer index:"+answerIndex+"</p>";

    //오른 단어와 틀린 단어 (4개) 출력
    quizbox.innerHTML+="<table><tr>";
    for(var i=0;i<4;i++){
        //오른 답 선택시
        if(i===answerIndex) quizbox.innerHTML+="<td><button class='correct-answers' id='button-answer' onclick='correctAnswer();'>"+randomWords[i]+"</button></td>";
        else {
            quizbox.innerHTML+="<td><button class='wrong-answers' onclick='wrongAnswer();'>"+randomWords[i]+"</button></td>";
        }
    }

    //progress 출력
    quizbox.innerHTML+="</tr><tr><td colspan='4'><br> <div id='quiz-progress-box'><div id='quiz-progress'><p>"+quiz.progress+" / "+quiz.wordsLength+"</p></div></div></td></tr>";

    //메인 메뉴 버튼
    quizbox.innerHTML+="<tr><td colspan='4'><button class='button-main-menu' onclick='location.reload()'>Main menu</button></td></tr></table>";
    var progress=document.getElementById("quiz-progress");
    progress.style.width=quiz.progressInPercent+"%";
}
//오른 답 선택시 다음 stage로 이동, progress 증가
function correctAnswer() {
    quiz.progressInPercent+=100/quiz.wordsLength;
    quiz.stage++;
    quiz.progress++;
    var quizProgress = document.getElementById("quiz-progress");
    quizProgress.innerHTML="<h3>"+quiz.progress+"</h3>";
    wordMatchQuiz();//퀴즈 계속 진행

}
//틀린 답 선택시 이전 stage 로 이동, progress 감소
function wrongAnswer() {

    //틀린 단어 영문과 한국어 단어를 다시 배열(남은 단어들)에 다시 push
    if(quiz.wrongWordsE.length>0){
        quiz.tmpEnglish.push(quiz.wrongWordsE.pop());
        quiz.tmpKorean.push(quiz.wrongWordsK.pop());
    }
    //2번 push 하는 이유는 틀린 거 선택쉬 이전 stage로 이동하고 거기서 다시 퀴즈 진행하기 때문
    if(quiz.wrongWordsE.length>0){
        quiz.tmpEnglish.push(quiz.wrongWordsE.pop());
        quiz.tmpKorean.push(quiz.wrongWordsK.pop());
    }
    quiz.progressInPercent-=100/quiz.wordsLength;
    quiz.stage++;
    quiz.progress--;

    if(quiz.progress<0) {
        quiz.progress=0;
        quiz.progressInPercent=0;
    }
    var quizProgress = document.getElementById("quiz-progress");
    quizProgress.innerHTML="<h3>"+quiz.progress+"</h3>";
    wordMatchQuiz();//퀴즈 계속 진행
}
//단어 찾기 메인 함수
function wordMatchQuiz() {

    if (typeof (Storage) != "undefined") {
        if (localStorage.getItem("quizMode") == "1") {
            var quizbox = document.getElementById("quiz-box");

            //모든 단어들 저장소에서 꺼내기
            if(quiz.isGameStarted===false) {
                quiz.tmpEnglish = (localStorage.getItem("wordsE").split("/"));
                quiz.tmpKorean = (localStorage.getItem("wordsK").split("/"));
                quiz.wordsLength=quiz.tmpEnglish.length;

                quiz.isGameStarted=true;
            }
            //모든 stage 완료 시 (예를 들면 단어 개수 5개일 경우 stage 5까지) 퀴즈 종료
            if(quiz.progress===quiz.wordsLength) {
                finishQuiz();
                return;
            }
            //모든 영어 단어와 한국어 단어 shuffle
            for (var i = quiz.tmpEnglish.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp1 = quiz.tmpEnglish[i];
                var temp2=quiz.tmpKorean[i];

                quiz.tmpEnglish[i] = quiz.tmpEnglish[j];
                quiz.tmpKorean[i] = quiz.tmpKorean[j];

                quiz.tmpEnglish[j] = temp1;
                quiz.tmpKorean[j] = temp2;
            }
            //맨 뒤에서 단어 추출 (이 단어들이 오른답임)
                var question=quiz.tmpEnglish.pop();
                var answer=quiz.tmpKorean.pop();
                quizbox.innerHTML = "<h1>Choose the correct meaning of the word</h1>";
                quizbox.innerHTML += "<p class='question-word'>'"+ question+"'</p>";

                //오른 답과 틀린 답 (4개) 출력 함수 호출
                printRandomMeaning(question,answer,quiz.tmpKorean);

        }
    }
}
//퀴즈 종료 함수 (2개 모드 적용)
function finishQuiz(){
    quiz.isGameStarted=false;
    var quizbox = document.getElementById("quiz-box");
    quizbox.innerHTML = "<div ><br><br><br><br><h1 style='color: darkred;font-size: 30px'>Good  Job!</h1><br><br><br><button class='button-main-menu' onclick='location.reload();'>Main menu</button></div>";
}

//drag & drop 가능하게
function allowDrop(ev) {
    ev.preventDefault();
}
//선택된 드래그 단어의 인덱스 저장
function drag(ev,dragIndex) {
    quiz.dragID=ev.target.id;
    quiz.dragIndex=dragIndex;
}
//빈 박스에 들어갈 요소들
function drop(ev,dropIndex) {
    ev.target.append(document.getElementById(quiz.dragID));
    //alert(quiz.dragIndex+" "+dropIndex);
    quiz.dropAnswers[dropIndex]=quiz.shuffleWords[quiz.dragIndex];

    //모든 단어들이 올바르게 했으면  다음 stage 로
    if(quiz.dropAnswers.join(' ')===quiz.currentSentence) {
        quiz.progress++;
        quiz.progressInPercent+=100/quiz.allSentences.length;
        document.getElementById("reset-sentence").outerHTML = "";
        var progress=document.getElementById("quiz-progress");
        var quizbox = document.getElementById("quiz-box");
        var qp = document.getElementById("qp");
        qp.innerHTML=quiz.progress+"/"+quiz.allSentences.length;
        progress.style.width=quiz.progressInPercent+"%";

        quizbox.innerHTML+=" <button class='button-next-sentence' onclick='nextStage();'>Next sentence</button> ";

    }
}
//다음 단계로 이동
function nextStage() {
    quiz.stage++;

     makeSentenceQuiz();
}
function makeSentenceQuiz() {

    if (typeof (Storage) != "undefined") {
        if (localStorage.getItem("quizMode") == "2") {
            if(quiz.isGameStarted===false){
                quiz.isGameStarted = true;
                var allSentences;
                //먼저 저장소에서 모든 단어들을 꺼내기
                if(localStorage.getItem("sentences")!=null) {
                    allSentences = localStorage.getItem("sentences");
                    quiz.allSentences = allSentences.split("/");

                    //문장을 shuffle
                    for (var i =  quiz.allSentences.length - 1; i > 0; i--) {
                        var j = Math.floor(Math.random() * (i + 1));
                        var temp =  quiz.allSentences[i];
                        quiz.allSentences[i] =  quiz.allSentences[j];
                        quiz.allSentences[j] = temp;
                    }


                    quiz.stage = 0;
                    quiz.progress = 0;
                    quiz.progressInPercent = 0;
                }
            }
            //모든 문장을 맞추면 퀴즈 종료
            if(quiz.stage==quiz.allSentences.length) finishQuiz();
            var quizbox = document.getElementById("quiz-box");
            var sentenceTmp =quiz.allSentences[quiz.stage];
            var sentence = sentenceTmp.split(" ");
            quiz.dropAnswers=new Array(sentence.length);

            quiz.currentSentence=sentenceTmp;
            quizbox.innerHTML = "<h1>Complete the sentences with the words</h1>";

            quizbox.innerHTML +="<div id='drag-container'>";

            //문장이 들어갈 빈 박스 출력
            for (var i = 0; i < sentence.length; i++) {
                quizbox.innerHTML += "<div class='word-box-empty' id='drop-word-"+i+"' ondrop='drop(event,"+i+")' ondragover='allowDrop(event)'><div > </div></div>";
            }
            quizbox.innerHTML +="</div><br>";

            //각 문장의 단어 순서를 shuffle
            for (var i = sentence.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = sentence[i];
                sentence[i] = sentence[j];
                sentence[j] = temp;
            }
            quiz.shuffleWords=sentence;

            /*
            for (var i = 0; i < sentence.length; i++) {
                while(true){
                    var r= Math.floor(Math.random() * sentence.length);
                    if(!quiz.shuffleWords.includes(r)) {
                        quiz.shuffleWords.push(r);
                        break;
                    }
                }
            }
            */
            //문장의 해당되는 shuffle 된 단어들을 출력
            for (var i = 0; i < sentence.length; i++) {
                quizbox.innerHTML += "<div class='word-box'id='drag-word-"+i+"' draggable='true' ondragstart='drag(event,"+i+")' ><div >" + sentence[i] + "</div></div>";
            }
            //진행률 출력
            quizbox.innerHTML+="<br><br><br><br><div id='quiz-progress-box'><div id='quiz-progress'><p id='qp'>"+quiz.progress+" / "+quiz.allSentences.length+"</p></div></div>";
            var progress=document.getElementById("quiz-progress");
            progress.style.width=quiz.progressInPercent+"%";

            quizbox.innerHTML+="<br> <button class='button-main-menu' onclick='location.reload()'>Main menu</button> ";
            quizbox.innerHTML+="<button id='reset-sentence' class='button-reset' onclick='makeSentenceQuiz();'>Reset</button> ";


        }
    }
}

//관리자 모드 함수
function settings() {
    if(typeof (Storage)!="undefined") {
        if (localStorage.getItem("quizMode") == "3") {
            //저장소에 있는 모든 영문 단어와 한국어 단어 출력, 모든 문장 출력
            if(localStorage.getItem("userMode")=="A") {
                var wordListE;
                var wordListK;
                var allSentences;
                if (localStorage.getItem("wordsE") != null) {
                    var tmpWordListE=localStorage.getItem("wordsE");
                    var tmpWordListK=localStorage.getItem("wordsK");
                    wordListE=tmpWordListE.split("/");
                    wordListK=tmpWordListK.split("/");
                }
                if (localStorage.getItem("sentences") != null) {
                    var tmpAllSentences=localStorage.getItem("sentences");
                    allSentences=tmpAllSentences.split("/");
                }
                var quizContainer = document.getElementById("quiz-container");
                var quizbox = document.getElementById("quiz-box");
                var wordList,sentenceList;

                quizContainer.style.width="100%";
                quizContainer.style.height="230%";

                quizContainer.style.background="linear-gradient(#333  ,#734037)";

                quizbox.innerHTML = "<h1 style='color:#d23d3b'>Quiz page settings</h1> ";
                quizbox.innerHTML+="<button class='button-main-menu' onclick='location.reload()' style='margin-top: 0'>Back to main menu</button>  ";

                //단어 출력
                wordList = "<div id='list-container'><div id='word-list-container'><table> <th colspan='3'>Word list</th>";

                for(var i=0;i<wordListE.length;i++){
                    wordList += "<tr><td>"+(i+1)+"</td><td>"+wordListE[i]+"</td><td>"+wordListK[i]+"</td></tr>";
                }
                wordList+= "</table>";
                wordList+="<button  class='button-main-menu' onclick='addNewWord();'>Add new word</button> ";
                wordList+= "</div>";

                //문장 출력
                sentenceList="<div id='sentence-list-container'><table><th colspan='2'>Sentence list</th>";
                for(var i=0;i<allSentences.length;i++){
                    sentenceList+="<tr><td>"+(i+1)+"</td><td>"+allSentences[i]+"</td></tr>";
                }
                sentenceList+="</table>";
                sentenceList+="<button  class='button-main-menu' onclick='addNewSentence();'>Add new sentence</button> ";
                sentenceList+="</div></div>";
                quizbox.innerHTML+=wordList;
                quizbox.innerHTML+=sentenceList;
            }
            else{
                location.reload();
            }
        }
    }
}
//관리자로부터 새로운 당어와 그 당어 의미 입력
function addNewWord() {
    var englishWord=prompt("Input new word in English (don't use '/'): ");

    if(isNaN(englishWord)&&!englishWord.includes("/")){
        var koreanWord=prompt("Input meaning in Korean (don't use '/'): ");
        if(isNaN(koreanWord)&&!koreanWord.includes("/")){
            if(typeof (Storage)!="undefined"){
                if(localStorage.getItem("wordsE")!=null){
                    var allEnglish=localStorage.getItem("wordsE");
                    var allKorean=localStorage.getItem("wordsK");
                    localStorage.setItem("wordsE",allEnglish+"/"+englishWord);
                    localStorage.setItem("wordsK",allKorean+"/"+koreanWord);
                    alert("New word is successfully saved");
                    settings();
                }
            }
        }
        else  alert("Wrong input");
    }
    else alert("Wrong input");
}
//관리자로부터 새로운 문장 입력
function addNewSentence() {
    var newSentence=prompt("Input new sentence (don't use '/'): ");
    if(isNaN(newSentence)&&!newSentence.includes("/")){
        if(typeof (Storage)!="undefined"){
            if(localStorage.getItem("sentences")!=null){
                var allSentences=localStorage.getItem("sentences");
                localStorage.setItem("sentences",allSentences+"/"+newSentence);
                alert("New sentence is successfully saved");
                settings();
            }
        }
    }
    else alert("Wrong input");
}
