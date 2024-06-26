var currentCall = undefined;
var destinationCall3CX = null;
var checkevent = false;
var recordticket3 = undefined;
var ky_tu_video_call = "VD_";
var popup_url_video = "https://videocall-smartnet.ringbot.co/agentcallcustomer?callTo=";
var phone3cxCurrent = undefined;
var destination3cxCurrent = undefined;
//var domain_service_oncall = "https://app-support-2.dxws.io/oncallcx/insert_data_zendesk";
var domain_service_oncall = "https://app-omn1.dxws.io:8080/oncallcx/insert_data_zendesk";
function NhanSuKienOnCallStatusChanged(obj) {
    currentCall = obj.callInfo;
    // console.log(currentCall);
    ChangeIsHold(currentCall.IsHold);
    ChangeIsMute(currentCall.IsMuted);
    switch (currentCall.State) {
        case 1:
            {

                checkevent = true;
                RestartNameCTI();
                restartidticket(); //new function 

                WriteLogToClient("Inbound - Ringing - checkevent: " + checkevent + " recordticket2: " + recordticket3);


                StopTalkingWatch();
                Ringing_3CX();
                SessionAppRestart();
                SessionAppStart();
                phone3cxCurrent = currentCall.OtherPartyNumber;
                destination3cxCurrent = "Inbound";
                break;
            }
        case 2:
            {
                console.log("Goi ra reng chuong");
                checkevent = true;//new function

                restartidticket();//new function

                //startgeturl(); //new function

                WriteLogToClient("Outbound - Ringing - checkevent: " + checkevent + " recordticket2: " + recordticket3);

                StopTalkingWatch();
                Dialing_3CX();
                SessionAppRestart();
                SessionAppStart();

                phone3cxCurrent = currentCall.OtherPartyNumber;
                destination3cxCurrent = "Outbound";

                break;
            }
        case 3:
            {
                if (checkConnect == false) {
                    checkConnect = true;
                    Connected_3CX();
                    StartTalkingWatch();
                    phone3cxCurrent = currentCall.OtherPartyNumber;
                    if (currentCall.Incoming) {

                        destination3cxCurrent = "Inbound";

                    }
                    else {

                        destination3cxCurrent = "Outbound";
                    }
                    //UpdateCheckLastTicket(true);  


                }

                break;
            }
        case 4:
            {
                //WaitingForNewParty
                break;
            }
        case 5:
            {
                TryingToTransfer_3CX();
                break;
            }
        case 6:
            {
                console.log("end call  checkevent: " + checkevent);
                checkConnect = false;

                checkEndCallCTI = true;
                WriteLogToClient("Endcall - checkevent: " + checkevent + " recordticket2: " + recordticket3);
                if (checkevent == true) {

                    Ended_3CX(phone3cxCurrent,destination3cxCurrent);
                    StopTalkingWatch();



                    // stopgeturl();

                }
                RestartNameCTI();
                restartidticket();
                checkevent = false;
                phone3cxCurrent = null;
                destination3cxCurrent = null;

                break;
            }
        default:
            break;
    }
}

function Ringing_3CX() {
    if (currentCall) {
        let contactType = "Unknown";
        if (!currentCall.OtherPartyName) {
            currentCall.OtherPartyName = "Unknown";
        } else {
            contactType = "Contact";
        }
        if (!currentCall.OtherPartyNumber) currentCall.OtherPartyNumber = "";
        HideAll();
        ShowIncommingPhone();
        SetIncommingCallPhoneInfo(currentCall.OtherPartyName, contactType, currentCall.OtherPartyNumber);
        ShowCTI();
        //PopupTicket(currentCall.OtherPartyNumber, "Inbound");
        //PopupContact(currentCall.OtherPartyNumber, "Inbound");
        destinationCall3CX = "Inbound";
    }
}


function Dialing_3CX() {
    if (currentCall) {
        if (!currentCall.OtherPartyName) currentCall.OtherPartyName = "Unknown";
        if (!currentCall.OtherPartyNumber) currentCall.OtherPartyNumber = "";
        HideAll();
        ShowTalkingPhone();
        SetTalkingPhoneInfo(currentCall.OtherPartyName, currentCall.OtherPartyNumber);
        DisableAllTalkingSmallButton();
        ShowCTI();
        //PopupTicket(currentCall.OtherPartyNumber, "Outbound");
        //PopupContact(currentCall.OtherPartyNumber, "Outbound");

        destinationCall3CX = "Outbound";
    }
}

function TryingToTransfer_3CX() {
    if (currentCall) {
        ws.send(`{"type":"DropCall","callId":"${currentCall.CallID}"}`);
        //if(!currentCall.OtherPartyName) currentCall.OtherPartyName="Unknown";
        //if(!currentCall.OtherPartyNumber) currentCall.OtherPartyNumber="";
        //HideAll();
        //ShowTalkingPhone();
        //SetTalkingPhoneInfo(currentCall.OtherPartyName,currentCall.OtherPartyNumber);
        //DisableAllTalkingSmallButton();
        //ShowCTI();
        // PopupTicket(currentCall.OtherPartyNumber, "Outbound");
    }
}

function Connected_3CX() {
    if (!currentCall.OtherPartyName) currentCall.OtherPartyName = "Unknown";
    if (!currentCall.OtherPartyNumber) currentCall.OtherPartyNumber = "";
    HideAll();
    ShowTalkingPhone();
    SetTalkingPhoneInfo(currentCall.OtherPartyName, currentCall.OtherPartyNumber);
    EnableAllTalkingButtons();
    ShowCTI();
    var phone_final = currentCall.OtherPartyNumber;
    if (currentCall.OtherPartyNumber.includes(ky_tu_video_call)) {
        phone_final = currentCall.OtherPartyNumber.replace(ky_tu_video_call, "");
        PopupUrlVideoCall(currentCall.OtherPartyNumber);
    }
    if (currentCall.Incoming) {
        PopupTicket(phone_final, "Inbound");
        //PopupTicket(currentCall.OtherPartyNumber,"Inbound");
    }
    else {
        PopupTicket(phone_final, "Outbound");
        //PopupTicket(currentCall.OtherPartyNumber,"Outbound");
    }
}


function PopupUrlVideoCall(phone_video) {
    var link_popup = popup_url_video + phone_video;
    console.log("PopupUrlVideoCall: " + link_popup);
    window.open(popup_url_video + phone_video, '_blank');
}

function Ended_3CX(phone_number_tmp,desination_tmp) {

    HideCTI();
    HideAll();
    ShowAvailablePhone();
    console.log("Ended_3CX " + recordticket3 + " phone_number:  " + phone_number + " desination_tmp: " + desination_tmp);




    if (phone3cxCurrent) {
        console.log("Ended_3CX phone3cxCurrent:" + phone3cxCurrent + " destination3cxCurrent: " + destination3cxCurrent);
        var phoneTmp3cx = phone_number;
        var destinationTmp3cx = desination_tmp;


        //XuLyEndCall(phoneTmp3cx,destinationTmp3cx);
        //XuLyEndCall2(phoneTmp3cx,destinationTmp3cx);
        if (phoneTmp3cx.includes(ky_tu_video_call)) {
            console.log("Ended_3CX --> video call")
        }
        else {
            XuLyEndCall3(phoneTmp3cx, destinationTmp3cx);
        }


    }




    currentCall = undefined;
}


function RestartNameCTI() {
    document.getElementsByName("NameContact").forEach(z => {
        z.innerText = "Loading...";
    });
    incommingCallPhoneTop.querySelector("#contactName").textContent = "Loading...";
    talkingPhoneTop.querySelector("#contactName").textContent = "Loading...";
}


function restartidticket() {
    recordticket3 = undefined;
    recordticket = undefined;
}


function XuLyEndCall(phoneTmp3cx, destinationTmp3cx) {

    client.request('/api/v2/users/' + idUserZendesk + '.json').then(
        function (result) {
            console.log("bien data: " + result);
            if (result) {
                if (result.user) {
                    // idticket = result.ticket.id;
                    console.log(" result: id: " + result.user.id + "  checklastticket: " + result.user.user_fields.checklastticket + " lasticket: " + result.user.user_fields.lastticket);

                    if (result.user.user_fields) {
                        var lastTicket = result.user.user_fields.lastticket;
                        console.log("lastTicket: " + lastTicket);
                        if (lastTicket) {
                            GetLogCallNew(lastTicket, phoneTmp3cx, destinationTmp3cx);
                        }
                        else {
                            CreatedTicketByContact2(phoneTmp3cx, idContactZendesk, destinationTmp3cx, idticket => {
                                console.log("Kết quả tìm idticket: " + idticket);

                                GetLogCallNew(idticket, phoneTmp3cx, destinationTmp3cx);

                                PopupTicketFD(idticket);



                            });
                        }

                        UpdateCheckLastTicket(false)
                        //var LastTicket = result.user.user_fields.lastticket;
                        // if(checkLastTicket == false)
                        // {
                        //     UpdateLastTicket(idUser,IdTicket);
                        // }


                    }

                    //callback(idticket);
                }


            }
        },
        function (error) {
            console.log("GetInformationUser error: " + error);
            console.log(JSON.stringify(error));
            //callback(null);
        }
    );
}
function XuLyEndCall2(phoneTmp3cx, destinationTmp3cx) {


    SessionAppGetIdTicket(lastTicket => {
        console.log("SessionAppGetIdTicket lastTicket: " + lastTicket)




        if (lastTicket) {
            console.log(null);

            GetLogCallNew(lastTicket, phoneTmp3cx, destinationTmp3cx);
        }
        else {
            CreatedTicketByContact2(phoneTmp3cx, idContactZendesk, destinationTmp3cx, idticket => {
                console.log("Kết quả tìm idticket: " + idticket);

                GetLogCallNew(idticket, phoneTmp3cx, destinationTmp3cx);

                PopupTicketFD(idticket);



            });
        }
    });




    // UpdateCheckLastTicket(false)


}


function XuLyEndCall3(phoneTmp3cx, destinationTmp3cx) {


    SessionAppGetIdTicket(lastTicket => {
        console.log("SessionAppGetIdTicket lastTicket: " + lastTicket)
        var lastTicketTmp3 = null;
        if (lastTicket == "0") {
            //lastTicketTmp3 = 0;
            lastTicketTmp3 = recordticket;
        }
        else {

            lastTicketTmp3 = lastTicket;
        }

        //SendRequestEndCall(phoneTmp3cx,window.extensionNum,destinationTmp3cx,lastTicketTmp3,idContactZendesk);
        //SendRequestEndCallONCX(phoneTmp3cx, window.extensionNum, destinationTmp3cx, lastTicketTmp3, idContactZendesk);
        //AddLogCall("454","https://recording")
        AddLogCallONCallCX(phoneTmp3cx, window.extensionNum, destinationTmp3cx, lastTicketTmp3, idContactZendesk);
        // if(lastTicket)
        // {
        //     console.log(null);

        //     GetLogCallNew(lastTicket,phoneTmp3cx,destinationTmp3cx);
        // }
        // else
        // {
        // CreatedTicketByContact2(phoneTmp3cx,idContactZendesk, destinationTmp3cx, idticket => {
        //     console.log("Kết quả tìm idticket: " + idticket);

        //     GetLogCallNew(idticket,phoneTmp3cx,destinationTmp3cx);

        //     PopupTicketFD(idticket);



        // });
        // }
    });




    // UpdateCheckLastTicket(false)


}
function UpdateCheckLastTicket(checkLastTicket) {
    var options = {
        contentType: "application/json",
        data: JSON.stringify({
            user: {

                user_fields: {

                    checklastticket: checkLastTicket,
                    lasticket: null
                }


            }
        }),
        dataType: "json",
        method: "PUT",
        url: "/api/v2/users/" + idUserZendesk + ".json",
    }
    client.request(options).then(
        function (result) {
            console.log("bien data: " + result);
            if (result) {

            }
        },
        function (error) {
            console.log("CreatedTicketByContactNew error: " + error);
            console.log(JSON.stringify(error));
            //callback(null);
        }
    );
}



function SessionAppGetIdTicket(callback) {
    var lastTicket = null;

    try {
        if (typeof (Storage) !== "undefined") {
            // Store

            var checkLastTicket = sessionStorage.getItem("checkLastTicket");
            if (checkLastTicket) {
                lastTicket = sessionStorage.getItem("lastTicket");

                console.log("SessionTicket: " + lastTicket);

                sessionStorage.setItem("checkLastTicket", false);

            }


        }
        else {
            console.log("Sorry, your browser does not support Web Storage...");
        }
    }
    catch (err) {
        console.log("SessionAppGetIdTicket: " + err.message);
    }

    SessionAppRestart(); // sau khi lấy song thì restart lại session

    callback(lastTicket);

}

function SessionAppStart() {
    try {
        if (typeof (Storage) !== "undefined") {
            // Store
            sessionStorage.setItem("checkLastTicket", true);

            console.log("SessionAppRestart: Restart Session");
        }
        else {
            console.log("SessionAppRestart: Sorry, your browser does not support Web Storage...");
        }
    }
    catch (err) {
        console.log("SessionAppGetIdTicket: " + err.message);
    }
}

function SessionAppRestart() {


    try {
        if (typeof (Storage) !== "undefined") {
            // Store
            sessionStorage.setItem("checkLastTicket", false);
            sessionStorage.setItem("lastTicket", "0");
            console.log("SessionAppRestart: Restart Session");
            console.log("SessionAppRestart: checkLastTicket " + sessionStorage.getItem("checkLastTicket") + " lastTicket: " + sessionStorage.getItem("lastTicket"));

        }
        else {
            console.log("SessionAppRestart: Sorry, your browser does not support Web Storage...");
        }
    }
    catch (err) {
        console.log("SessionAppGetIdTicket: " + err.message);
    }


}



function SendRequestEndCall(phoneTmp2, extensionTmp2, destinationTmp2, ticketTmp2, contactTmp2) {
    console.log(`SendRequestEndCall -  phone: ${phoneTmp2} - extension: ${extensionTmp2} - destination: ${destinationTmp2} - ticket: ${ticketTmp2} - contact: ${contactTmp2}  `)
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("SendRequestEndCall: result: " + this.responseText)
            // var obj = JSON.parse(this.responseText);

        }
    };
    var domainservice3CX = domainservice + `/PBX/EndCall?phone=${phoneTmp2}&extension=${extensionTmp2}&destination=${destinationTmp2}&ticket=${ticketTmp2}&contact=${contactTmp2}`;
    console.log(`SendRequestEndCall -  domainservice3CX: ${domainservice3CX} `)
    xhttp.open("GET", domainservice3CX, true);

    xhttp.send();
}

function AddVersion() {
    var button_queue_version = document.getElementById("btnQ");
    if (button_queue_version) {
        button_queue_version.innerText = "Q";
    }
}


function SendRequestEndCallONCX(phoneTmp2, extensionTmp2, destinationTmp2, ticketTmp2, contactTmp2) {
    console.log(`SendRequestEndCallONCX -  phone: ${phoneTmp2} - ticket: ${ticketTmp2}  `)

    var data = JSON.stringify({
        "phone": phoneTmp2,
        "ticketid": ticketTmp2
    });
    console.log("data: " +  JSON.stringify(data ));
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
        }
    });

    xhr.open("POST", domain_service_oncall);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);

    //
    // WARNING: For POST requests, body is set to null by browsers.
   
}


function AddLogCallONCallCX(phoneTmp2, extensionTmp2, destinationTmp2, ticketTmp2, contactTmp2)
{
    console.log(`AddLogCallONCallCX -  phone: ${phoneTmp2} - ticket: ${ticketTmp2}  `)

    const currentDate = new Date();

// Lấy thông tin từ ngày giờ hiện tại
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Thêm '0' phía trước nếu tháng < 10
const day = String(currentDate.getDate()).padStart(2, '0'); // Thêm '0' phía trước nếu ngày < 10
const hours = String(currentDate.getHours()).padStart(2, '0');
const minutes = String(currentDate.getMinutes()).padStart(2, '0');
const seconds = String(currentDate.getSeconds()).padStart(2, '0');
const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic amFja2llQGlkYi5jb20udm4vdG9rZW46enRCeFBrR0l0NWNkaEhuZUl3Q1hRWnlaZGswVlMxa1RaSk5JRFlmZw==");
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "ticket": {
        "voice_comment": {
          "from": "1852",
          "to": phoneTmp2,
          "recording_url": "https://app-support-2.dxws.io/files/[0366333462]_0366333462-10002_20230425095445(24).wav",
          "started_at": formattedDateTime,
          "call_duration": 10
        }
      }
    });
    
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch(`https://d3v-ringbot.zendesk.com/api/v2/tickets/${ticketTmp2}.json`, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
}


AddVersion();