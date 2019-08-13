/*
* Catholic University of Korea
* Computer Science
* 201521641
* Abdulaziz
* */
function getResult() {
    var correctAnswerIndexes=[3,5,8,14,17,22,24,31,35,37,40,47,49,54,56,60,67,71,73,76,80,86,88,95,98,100,105,109,115,119,123,124,131,134,137,142,144,149,153,159,162,167,171,175,177,180,187,189,193,197];
    var userAnswers=document.getElementsByClassName("answers");
    var correctAnswerCount=0;
    for(var i=0;i<correctAnswerIndexes.length;i++){
        if(userAnswers[correctAnswerIndexes[i]].checked){
            correctAnswerCount++;
        }
    }
    var level;
    if(correctAnswerCount<50) {
        if (correctAnswerCount < 40) {
            if (correctAnswerCount < 30) {
                if (correctAnswerCount < 20) {
                    if (correctAnswerCount < 10) {
                        if (correctAnswerCount < 3) {
                            level = 0;
                        }
                        else level=1;
                    }
                    else level=2;
                }
                else level=3;
            }
            else level=4;
        }
        else level=5;
    }
    alert("Correct answer count: "+correctAnswerCount+"\nYour level is: "+level);
}