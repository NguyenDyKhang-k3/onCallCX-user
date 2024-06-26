
var availablePhoneBtnCall = document.querySelector("#availablePhoneActionsDiv #btnCall");

function ShowAvailablePhone() {
    mainBody.style.backgroundColor = "transparent";
    ClearKeyPadPhoneNumber();
    ShowKeyPad();
    ShowFlexE(availablePhoneActionsDiv);
    ShowFlexE(choosableCurrentStatusDiv);
    availablePhoneBtnCall.removeAttribute("disabled");
    phoneHeader.querySelector("img").src="img/infisys-01.svg";
    btnQ.classList.remove("text-white");btnQ.classList.add("text-primary")
}

function HideAvailablePhone() {
    HideE(keypadDiv);
    HideFlexE(availablePhoneActionsDiv);
    HideFlexE(choosableCurrentStatusDiv);
}

availablePhoneBtnCall.addEventListener("click", () => {
    //if (!CheckExtension()) return;
    let phoneNum=GetKeyPadPhoneNumber();
    Make_Call(phoneNum);
    availablePhoneBtnCall.setAttribute("disabled", "disabled");


    // if (phoneNum && phoneNum.length > 2 && currentExtension && phoneNum !== currentExtension.Number) {
    //     // SendWebSocketMessage(`{"type":"MakeCall","destination":"${phoneNum}"}`, () => {
    //     //     availablePhoneBtnCall.setAttribute("disabled", "disabled");
    //     // });
       
        
       
    // }
});

