var transferScreenBtnTransfer=transferActionsDiv.querySelector("#btnTransfer");
function ShowTransferScreen() {
    mainBody.style.backgroundColor = "transparent";
    ClearKeyPadPhoneNumber();
    transferScreenBtnTransfer.removeAttribute("disabled");
    ShowKeyPad();
    ShowFlexE(transferActionsDiv);
    ShowStaticStatusDiv();
    phoneHeader.querySelector("img").src="img/infisys-01.svg";
    btnQ.classList.remove("text-white");btnQ.classList.add("text-primary")

}

function HideTransferScreen() {
    HideE(keypadDiv);
    HideFlexE(transferActionsDiv);
    HideStaticStatusDiv();
}

transferScreenBtnTransfer.addEventListener("click",()=>{
    var phoneNum = GetKeyPadPhoneNumber();
    if (phoneNum && phoneNum.length > 2 && phoneNum !== currentCall.OtherPartyNumber && phoneNum !== currentExtension.Number) {
        SendWebSocketMessage(`{"type":"BlindTransfer","callId":"${currentCall.CallID}","destination":"${phoneNum}"}`, () => {
            transferScreenBtnTransfer.setAttribute("disabled", "disabled");
        });
    }
});