var btnCopyPhoneNumber=document.querySelector("#incommingCallPhoneTop #btnCopyPhoneNumber");
var incommingPhoneNum=document.querySelector("#incommingCallPhoneTop #incommingPhoneNum");
var incommingPhoneBtnAccept=incommingPhoneActionsDiv.querySelector("#btnAccept");
var incommingPhoneBtnCancel=incommingPhoneActionsDiv.querySelector("#btnCancel");

function ShowIncommingPhone() {
    mainBody.style.backgroundColor = "#1f5f8c";
    ShowE(incommingCallPhoneTop);
    ShowFlexE(incommingPhoneActionsDiv);
    ShowFlexE(choosableCurrentStatusDiv);
    incommingPhoneBtnAccept.removeAttribute("disabled");
    incommingPhoneBtnCancel.removeAttribute("disabled");
    phoneHeader.querySelector("img").src="img/infisys-01_01.svg";
    btnQ.classList.remove("text-primary");btnQ.classList.add("text-white");
}

function HideIncommingPhone() {
    HideE(incommingCallPhoneTop);
    HideFlexE(incommingPhoneActionsDiv);
    HideFlexE(choosableCurrentStatusDiv);
}

var incommingPhoneSI=undefined;
btnCopyPhoneNumber.addEventListener("click",()=>{
    if(incommingPhoneSI) {
        clearTimeout(incommingPhoneSI);
        incommingPhoneSI=null;
    }
    copyToClipBoard(incommingPhoneNum.textContent);
    btnCopyPhoneNumber.setAttribute("title","Copied!");
    $(btnCopyPhoneNumber).tooltip({placement: 'top',trigger: 'manual'}).tooltip("show")
    incommingPhoneSI=setTimeout(()=>{
        btnCopyPhoneNumber.removeAttribute("title");
        $(btnCopyPhoneNumber).tooltip("dispose");
    },1000);
});

function SetIncommingCallPhoneInfo(contactName,contactType,phoneNum) {
    incommingCallPhoneTop.querySelector("#contactName").textContent=contactName;
    incommingCallPhoneTop.querySelector("#contactType").textContent=contactType;
    incommingCallPhoneTop.querySelector("#incommingPhoneNum").textContent=phoneNum;
}

incommingPhoneBtnAccept.addEventListener("click", () => {
    // SendWebSocketMessage(`{"type":"ActivateEx","callId":"${currentCall.CallID}","options":0}`, () => {
    //     incommingPhoneBtnAccept.setAttribute("disabled", "disabled");
    //     incommingPhoneBtnCancel.setAttribute("disabled", "disabled");
    // });
    Answer_Call();
    incommingPhoneBtnAccept.setAttribute("disabled", "disabled");
    incommingPhoneBtnCancel.setAttribute("disabled", "disabled");
    // SendWebSocketMessage(`{"type":"ActivateEx","callId":"${currentCall.CallID}","options":0}`, () => {
    //     incommingPhoneBtnAccept.setAttribute("disabled", "disabled");
    //     incommingPhoneBtnCancel.setAttribute("disabled", "disabled");
    // });
});
incommingPhoneBtnCancel.addEventListener("click", () => {
    // SendWebSocketMessage(`{"type":"DropCall","callId":"${currentCall.CallID}"}`, () => {
    //     incommingPhoneBtnAccept.setAttribute("disabled", "disabled");
    //     incommingPhoneBtnCancel.setAttribute("disabled", "disabled");
    // });
    End_Call();
    incommingPhoneBtnAccept.setAttribute("disabled", "disabled");
        incommingPhoneBtnCancel.setAttribute("disabled", "disabled");
});