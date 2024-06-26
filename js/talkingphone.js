var talkingPhoneBtnEndCall = talkingPhoneActionsDiv.querySelector("#btnEndCall");
var talkingPhoneBtnKeyPad = talkingPhoneTop.querySelector("#btnKeyPad");
var talkingPhoneBtnHold = talkingPhoneTop.querySelector("#btnHold");
var talkingPhoneBtnMute = talkingPhoneTop.querySelector("#btnMute");
var talkingPhoneBtnTransfer = talkingPhoneTop.querySelector("#btnTransfer");
var talkingPhoneDuration = talkingPhoneTop.querySelector("#duration");

function DisableAllTalkingSmallButton() {
    talkingPhoneTop.querySelectorAll(".phimBam").forEach(z => {
        z.setAttribute("disabled", "disabled");
    });
}

function EnableAllTalkingSmallButtons() {
    talkingPhoneTop.querySelectorAll(".phimBam").forEach(z => {
        z.removeAttribute("disabled");
    });
}

function EnableAllTalkingButtons() {
    talkingPhoneTop.querySelectorAll(".phimBam").forEach(z => {
        z.removeAttribute("disabled");
    });
    talkingPhoneBtnEndCall.removeAttribute("disabled");
}

function SetTalkingPhoneInfo(contactName, phoneNum) {
    //talkingPhoneTop.querySelector("#contactName").textContent=contactName;
    talkingPhoneTop.querySelector("#phoneNum").textContent = phoneNum;
}

function ReOpenTalkingPhone() {
    mainBody.style.backgroundColor = "#3880b2";
    ShowFlexE(talkingPhoneTop);
    ShowFlexE(talkingPhoneActionsDiv);
    ShowStaticStatusDiv();
}

function ShowTalkingPhone() {
    mainBody.style.backgroundColor = "#3880b2";
    talkingPhoneBtnEndCall.removeAttribute("disabled");
    ShowFlexE(talkingPhoneTop);
    ShowFlexE(talkingPhoneActionsDiv);
    ShowStaticStatusDiv();
    phoneHeader.querySelector("img").src = "img/infisys-01_01.svg";
    btnQ.classList.remove("text-primary");
    btnQ.classList.add("text-white");
}

function HideTalkingPhone() {
    HideFlexE(talkingPhoneTop);
    HideFlexE(talkingPhoneActionsDiv);
    HideStaticStatusDiv();
}

talkingPhoneBtnEndCall.addEventListener("click", () => {
    // SendWebSocketMessage(`{"type":"DropCall","callId":"${currentCall.CallID}"}`, () => {
    //     talkingPhoneBtnEndCall.setAttribute("disabled", "disabled");
    // checkConnect=false;
    //     DisableAllTalkingSmallButton();

    // });
    // Ket thuc tren cti tu dong transfer vao ivr
   // SendWebSocketMessage(`{"type":"BlindTransfer","callId":"${currentCall.CallID}","destination":"8013"}`, () => {
        // transferScreenBtnTransfer.setAttribute("disabled", "disabled");
   // });
   End_Call();

});

function ChangeIsHold(isHold) {
    if (isHold !== undefined || isHold !== null) {
        if (isHold) {
            talkingPhoneBtnHold.classList.remove("talkingPhoneBtnBGBlue");
            talkingPhoneBtnHold.classList.add("talkingPhoneBtnBGRed");
        } else {
            talkingPhoneBtnHold.classList.remove("talkingPhoneBtnBGRed");
            talkingPhoneBtnHold.classList.add("talkingPhoneBtnBGBlue");
        }
    }
}

function ChangeIsMute(isMute) {
    if (isMute !== undefined || isMute !== null) {
        if (isMute) {
            talkingPhoneBtnMute.classList.remove("talkingPhoneBtnBGBlue");
            talkingPhoneBtnMute.classList.add("talkingPhoneBtnBGRed");
        } else {
            talkingPhoneBtnMute.classList.remove("talkingPhoneBtnBGRed");
            talkingPhoneBtnMute.classList.add("talkingPhoneBtnBGBlue");
        }
    }
}

talkingPhoneBtnMute.addEventListener("click", () => {
    SendWebSocketMessage(`{"type":"Mute","callId":"${currentCall.CallID}"}`);
});

talkingPhoneBtnHold.addEventListener("click", () => {
    if (talkingPhoneBtnHold.classList.contains("talkingPhoneBtnBGBlue")) {
        SendWebSocketMessage(`{"type":"Hold","callId":"${currentCall.CallID}","holdOn":true}`);
    } else {
        SendWebSocketMessage(`{"type":"Hold","callId":"${currentCall.CallID}","holdOn":false}`);
    }
});

var seconds = 0,
    minutes = 0,
    hours = 0;
var watchInterval = undefined;

function StartTalkingWatch() {
    StopTalkingWatch();
    seconds = 0;
    minutes = 0;
    hours = 0;
    watchInterval = setInterval(() => {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
        }
        talkingPhoneDuration.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
    }, 1000);
}

function StopTalkingWatch() {
    clearInterval(watchInterval);
    watchInterval = null;
    let currentDuration = talkingPhoneDuration.textContent;
    talkingPhoneDuration.textContent = "00:00:00";
    return currentDuration;
}