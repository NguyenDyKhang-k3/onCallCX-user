var txtPhoneNumber = document.querySelector("#keypadDiv #txtPhoneNumber");
var btnClearPhoneNumber = document.querySelector("#keypadDiv #btnClearPhoneNumber");

function ShowKeypadScreen() {
    mainBody.style.backgroundColor = "transparent";
    ShowKeyPad();
    ShowFlexE(keypadActionsDiv);
    ShowStaticStatusDiv();
    ClearKeyPadPhoneNumber();
    txtPhoneNumber.setAttribute("readonly", "true");
    phoneHeader.querySelector("img").src="img/infisys-01.svg";
    btnQ.classList.remove("text-white");btnQ.classList.add("text-primary")

}

function HideKeypadScreen() {
    HideE(keypadDiv);
    HideFlexE(keypadActionsDiv);
    HideStaticStatusDiv();
}

function ShowKeyPad() {
    ShowE(keypadDiv);
    txtPhoneNumber.removeAttribute("readonly");
}

txtPhoneNumber.addEventListener("keydown", (e) => {
    if (!txtPhoneNumber.hasAttribute("readonly")) {
        var phoneRe = /[\+\d \*#]/;
        if (e.key === "Backspace" || e.key === "Delete" || e.key === "ArrowLeft" || e.key === "ArrowRight") return;
        if (e.key === "Enter") {
            if (availablePhoneActionsDiv.classList.contains("d-flex")) availablePhoneBtnCall.click();
            else if (transferActionsDiv.classList.contains("d-flex")) transferScreenBtnTransfer.click();
        }
        else if (!phoneRe.test(e.key)) {
            e.preventDefault();
        }
    }
});
txtPhoneNumber.addEventListener("input", () => {
    if (txtPhoneNumber.value) {
        btnClearPhoneNumber.removeAttribute("hidden");
    } else {
        btnClearPhoneNumber.setAttribute("hidden", true);
    }
});
txtPhoneNumber.addEventListener("change", () => {
    if (txtPhoneNumber.value) {
        btnClearPhoneNumber.removeAttribute("hidden");
    } else {
        btnClearPhoneNumber.setAttribute("hidden", true);
    }
});
btnClearPhoneNumber.addEventListener("click", () => {
    txtPhoneNumber.value = "";
    btnClearPhoneNumber.setAttribute("hidden", true);
});
keypadDiv.querySelectorAll(".phimBam").forEach(z => {
    z.addEventListener("click", () => {
        txtPhoneNumber.value += z.textContent;
        btnClearPhoneNumber.removeAttribute("hidden");
        if (!txtPhoneNumber.hasAttribute("readonly")) {
            txtPhoneNumber.focus();
        } else {
            if (keypadActionsDiv.classList.contains("d-flex")) {
                SendWebSocketMessage(`{"type":"SendDTMF","callId":"${currentCall.CallID}","dtmf":"${z.textContent}"}`);
            }
        }
    });
});

function ClearKeyPadPhoneNumber() {
    keypadDiv.querySelector("#txtPhoneNumber").value = "";
    btnClearPhoneNumber.setAttribute("hidden", true);
}
function GetKeyPadPhoneNumber() {
    return keypadDiv.querySelector("#txtPhoneNumber").value.trim();
}

