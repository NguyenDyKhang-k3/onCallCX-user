var AllStatuses = [
    {
        name: "Available",
        softphoneName: "Available",
        color: "#36e804"
    },
    {
        name: "Away",
        softphoneName: "Away",
        color: "orange"
    },
    {
        name: "Do Not Disturb",
        softphoneName: "Out of office",
        color: "red"
    },
    {
        name: "Lunch",
        softphoneName: "Custom 1",
        color: "#cdffcd"
    },
    {
        name: "Business Trip",
        softphoneName: "Custom 2",
        color: "brown"
    }
];

function SetStatus(status, color) {
    choosableCurrentStatusDiv.querySelector("#statusColor").style.backgroundColor = color;
    choosableCurrentStatusDiv.querySelector("#statusText").textContent = status;
}

choosableCurrentStatusDiv.addEventListener("click", () => {
    if (statusOptionsContainerDiv.classList.contains("d-none")) {
        ShowE(statusOptionsContainerDiv);
        currentStatusI.className = "fas fa-chevron-down";
    } else {
        HideE(statusOptionsContainerDiv);
        currentStatusI.className = "fas fa-chevron-up";
    }
});

statusOptionsContainerDiv.querySelectorAll(".statusOption").forEach(status => {
    status.addEventListener("click", () => {
        var s = AllStatuses.find(z => z.name === status.getAttribute("value"));
        HideE(statusOptionsContainerDiv);
        currentStatusI.className = "fas fa-chevron-up";
        if (s && s.ProfileId) {
            SendWebSocketMessage(`{"type":"SetActiveProfile","ProfileId":"${s.ProfileId}"}`);
        }
    });
});

function ChangeProfile(profileId) {
    for (let i = 0; i < AllStatuses.length; i++) {
        if (AllStatuses[i].ProfileId === Number(profileId)) {
            SetStatus(AllStatuses[i].name,AllStatuses[i].color);
            break;
        }
    }
}

function ChangeExtensionInfo(extensionInfo) {
    if (extensionInfo.Profiles) {
        extensionInfo.Profiles.forEach(z => {
            for (let i = 0; i < AllStatuses.length; i++) {
                if (AllStatuses[i].softphoneName === z.Name) {
                    if (z.IsActive === true) {
                        SetStatus(AllStatuses[i].name, AllStatuses[i].color);
                    }
                    AllStatuses[i].ProfileId = z.ProfileId;
                    break;
                }
            }
        });
    }
}
