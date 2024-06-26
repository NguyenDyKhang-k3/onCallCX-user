var btnQ = document.querySelector("#btnQ");
var btnMinimize = document.querySelector("#btnMinimize");
var btnCollapse = document.querySelector("#btnCollapse");
var statusOptionsContainerDiv = document.getElementById("statusOptionsContainerDiv");
var keypadDiv = document.getElementById("keypadDiv");
var choosableCurrentStatusDiv = document.getElementById("choosableCurrentStatusDiv");
var staticStatusDiv = document.getElementById("staticStatusDiv");
var availablePhoneActionsDiv = document.getElementById("availablePhoneActionsDiv");
var currentStatusI = document.getElementById("currentStatusI");
var talkingPhoneTop = document.getElementById("talkingPhoneTop");
var talkingPhoneActionsDiv = document.getElementById("talkingPhoneActionsDiv");
var transferActionsDiv = document.getElementById("transferActionsDiv");
var keypadActionsDiv = document.getElementById("keypadActionsDiv");
var incommingCallPhoneTop = document.getElementById("incommingCallPhoneTop");
var incommingPhoneActionsDiv = document.getElementById("incommingPhoneActionsDiv");
var mainBody = document.getElementById("mainBody");
var bannerTop=document.getElementById("bannerTop");

function HideAll() {
    HideFlexE(statusOptionsContainerDiv);
    HideFlexE(keypadDiv);
    HideFlexE(choosableCurrentStatusDiv);
    HideFlexE(staticStatusDiv);
    HideFlexE(availablePhoneActionsDiv);
    HideFlexE(talkingPhoneTop);
    HideFlexE(talkingPhoneActionsDiv);
    HideFlexE(transferActionsDiv);
    HideFlexE(keypadActionsDiv);
    HideE(incommingCallPhoneTop);
    HideFlexE(incommingPhoneActionsDiv);
}

function ShowE(element) {
    element.classList.remove("d-none");
}
function HideE(element) {
    element.classList.add("d-none");
}
function ShowFlexE(element) {
    element.classList.remove("d-none");
    element.classList.add("d-flex");
}
function HideFlexE(element) {
    element.classList.add("d-none");
    element.classList.remove("d-flex");
}

function ShowStaticStatusDiv() { ShowFlexE(staticStatusDiv); }
function HideStaticStatusDiv() { HideFlexE(staticStatusDiv); }




btnQ.addEventListener("click", () => {
    if (btnQ.classList.contains("text-white")) {
        SendWebSocketMessage(`{"type":"SetQueueLoginStatus","loggedIn":false}`, () => {
            btnQ.classList.remove("text-white");
            btnQ.classList.add("text-secondary");
        });
    } else {
        SendWebSocketMessage(`{"type":"SetQueueLoginStatus","loggedIn":true}`, () => {
            btnQ.classList.add("text-white");
            btnQ.classList.remove("text-secondary");
        });
    }
});

//btnCollapse.addEventListener("click", () => {
   // HideCTI();
//});


function copyToClipBoard(str) {
    let el = document.createElement('textarea');
    el.value = str;
    el.style.position = "fixed";
    el.style.zIndex = "-999";
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}