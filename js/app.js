var client = undefined;
var domainservice = "";
var checkConnect = false;


let call_tmp;
let agent = anCti.newAgent();
let webphone;
let audio = new Audio();
audio.autoplay = true;
let rinnger;
let audioBlobs = {};
$(document).ready(function () {
  // client = ZAFClient.init();
  // client.metadata().then(function (metadata) {
  //   domainservice = metadata.settings.urlapi;
  // });
  // client.on('voice.dialout', function (response) {
  //   Make_Call(response.number);
  // });
  PreloadAudioFiles();
  //getIdUser();

  agent.startApplicationSession({
    username: "cti-app852@crmjoget.com",
    password: "pbxUser852!",
    url: "wss://pbx-stg.oncallcx.vn/cti/ws",
  });


  navigator.mediaDevices.enumerateDevices().then(mediaDevices => {
    mediaDevices
      .filter(({ kind }) => kind == "audioinput")
      .forEach(dev => {
        console.log(`${dev.label} => ${dev.deviceId}`);
      });
  })

  let devices = agent.getDevices();
  console.log("Agent === >>>", agent);

  devices.forEach((device) => {
    console.log("device: ", device.deviceID);
    logToDiv("device: ", device.deviceID);
  });

  agent.on('localstream', (event) => {
    //document.getElementById('localView').srcObject = event.stream;
  });

  agent.on('remotestream', (event) => {
    //document.getElementById('remoteView').srcObject = event.stream;
    audio.srcObject = event.stream;
  });

  agent.on("applicationsessionterminated", (event) => {
    if (event.reason == "invalidApplicationInfo") {
      console.log("Please check your credentials and try again");

    }
  });

  // handler is called if application-session was successfully started
  agent.on("applicationsessionstarted", (event) => {
    console.log("Hello " + event.firstName);

    webphone = agent.getDevice("sip:1852@term.339");
    webphone.monitorStart({ rtc: true });
  });


  agent.on("call", (event) => {
    let call = event.call;
    call_tmp = event.call;
    console.log("event.name: " + event)


    switch (call.localConnectionInfo) {
      case 'initiated':
        {
          console.log(`dialing ${call.number} ${call.name}`);
          StopTalkingWatch();
          playRingtone("dialing");
          Dialing_PBX(call.name, "", call.number);
          SessionAppRestart();
          SessionAppStart();
          break;
        }
      case 'alerting':
        {
          console.log(`incomming call from ${call.number} ${call.name}`);
          StopTalkingWatch();
          playRingtone("ringing");
          Ringing_PBX(call.name, "", call.number);
          SessionAppRestart();
          SessionAppStart();
          break;
        }
      case 'connected':
        {
          console.log(`connected to ${call.number}`);
          clearRingtone();
          Connected_PBX(call.name, call.number);
          StartTalkingWatch();
          break;
        }

      case 'fail':
        console.log(`call failed, cause is ${event.content.cause}`);
        break;
      case 'hold':
        console.log(`holding call to ${call.number}`);
        break;
      case 'null':
        {
          console.log(`call to ${call.number} is gone`);
          clearRingtone();
          End_PBX();
          StopTalkingWatch();

          break;
        }

    }
  });
});


function CallAPIAddLogCall(phone_number) {
  console.log(`CallAPIAddLogCall --> phone_number: ${phone_number}`)
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "phone": `${phone_number}`,
    "ticketid": "2"
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://app-support-2.dxws.io/oncallcx/ticketdata", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

function Answer_Call() {
  console.log("Answer_Call")
  let call = webphone.calls[0];
  if (call.localConnectionInfo == "alerting") {
    // click while we have an alerting call -> accept it
    call.answerCall({ audio: true, video: false });
  }
}

function End_Call() {
  console.log("End_Call")
  let call = webphone.calls[0];
  call.clearConnection();
}

function Make_Call(phone) {
  let call = webphone.calls[0];
  if (!call) {
    webphone.makeCall(phone, { autoOriginate: "doNotPrompt", audio: true, video: false });
  }

}



function ConnectWebSocket() {
  let wsImpl = window.WebSocket || window.MozWebSocket;
  window.ws = new wsImpl('ws://localhost:8383/');
  ws.onmessage = function (evt) {
    NhanDuLieuWebSocket(evt.data);
  };
  ws.onopen = function () {
    ws.send(`{"type":"SetQueueLoginStatus","loggedIn":true}`);
  };
  ws.onerror = function () {
    ws.close();
  };
}

function SendWebSocketMessage(text, callback) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    if (!CheckExtension()) return;

    ws.send(text);
    if (callback) {
      callback();
    }
  } else {
    DisplayStatus("danger", "Không kết nối được với softphone... Đang thử kết nối lại...");
  }
}

function CheckExtension() {
  if (!currentExtension) {
    DisplayStatus("danger", "Hệ thống không lấy được thông tin extension của bạn");
    return false;
  } else {
    return true;
  }
}

function ShowCTI() {
  client.invoke('popover', 'show');
}

function HideCTI() {
  client.invoke('popover', 'hide');
}

var currentExtension = undefined;

function NhanDuLieuWebSocket(data) {
  var obj = JSON.parse(data);
  if (!obj) return;
  switch (obj.Event) {
    case "OnOpen":
      if (obj.extensionInfo) {
        currentExtension = obj.extensionInfo;
        UpdateExtension(obj.extensionInfo.Number);
        ChangeExtensionInfo(obj.extensionInfo);
        ws.send(`{"type":"SendCallInfo"}`);
      }
      break;
    case "OnCallStatusChanged":
      if (obj.callInfo) NhanSuKienOnCallStatusChanged(obj);
      break;
    case "OnMyPhoneStatusChanged":
      if (obj.extensionInfo) {
        currentExtension = obj.extensionInfo;
        UpdateExtension(obj.extensionInfo.Number);
      }
      break;
    case "CurrentProfileChanged":
      if (obj.NewProfileId !== undefined) ChangeProfile(obj.NewProfileId);
      break;
  }
}
function UpdateExtension(extensionNum) {
  window.extensionNum = extensionNum;
}

function DisplayStatus(type, message) {
  console.log(message);
}


function WriteLogToClient(message) {
  ws.send(`{'type':'WriteLog','Message':'` + message + `'}`);
}



function TestSesstion() {
  if (typeof (Storage) !== "undefined") {
    // Store
    sessionStorage.setItem("lastname", "Smith");
    // Retrieve
    console.log(sessionStorage.getItem("lastname"));
  } else {
    console.log("Sorry, your browser does not support Web Storage...");
  }

}



function Answer_Call() {
  console.log("Answer_Call")
  let call = webphone.calls[0];
  if (call.localConnectionInfo == "alerting") {
    // click while we have an alerting call -> accept it
    call.answerCall({ audio: true, video: false });
  }
}

function End_Call() {
  console.log("End_Call")
  let call = webphone.calls[0];
  call.clearConnection();
}

function Make_Call(phone) {
  let call = webphone.calls[0];
  if (!call) {
    webphone.makeCall(phone, { autoOriginate: "doNotPrompt", audio: true, video: false });
    webphone.send("message");
  }

}

function Ringing_PBX(contact_name, contact_type, contact_number) {
  HideAll();
  ShowIncommingPhone();
  SetIncommingCallPhoneInfo(contact_name, contact_type, contact_number);
  // ShowCTI();
  //PopupTicket(currentCall.OtherPartyNumber, "Inbound");
  //PopupContact(currentCall.OtherPartyNumber, "Inbound");
  destinationCall3CX = "Inbound";
  phone3cxCurrent = contact_number;
  destination3cxCurrent = destinationCall3CX;
}

function Dialing_PBX(contact_name, contact_type, contact_number) {
  HideAll();
  ShowTalkingPhone();
  SetTalkingPhoneInfo(contact_name, contact_type, contact_number);
  DisableAllTalkingSmallButton();
  // ShowCTI();
  //PopupTicket(currentCall.OtherPartyNumber, "Outbound");
  //PopupContact(currentCall.OtherPartyNumber, "Outbound");

  destinationCall3CX = "Outbound";
  phone3cxCurrent = contact_number;
  destination3cxCurrent = destinationCall3CX;
}

function Connected_PBX(contact_name, contact_number) {

  HideAll();
  ShowTalkingPhone();
  SetTalkingPhoneInfo(contact_name, contact_number);
  EnableAllTalkingButtons();
  // ShowCTI();
  var phone_final = contact_number;
  // if(contact_number.includes(ky_tu_video_call))
  // {
  //     phone_final = contact_number.replace(ky_tu_video_call,"");
  //     PopupUrlVideoCall(contact_number);
  // }
  if (destinationCall3CX == "Inbound") {
    PopupTicket(phone_final, "Inbound");
    //PopupTicket(currentCall.OtherPartyNumber,"Inbound");
  }
  else {
    PopupTicket(phone_final, "Outbound");
    //PopupTicket(currentCall.OtherPartyNumber,"Outbound");
  }
}

function End_PBX() {

  HideCTI();
  HideAll();
  ShowAvailablePhone();
  console.log("Ended_3CX " + recordticket3 + " ");




  console.log("Ended_3CX phone3cxCurrent:" + phone3cxCurrent + " destination3cxCurrent: " + destination3cxCurrent);
  var phoneTmp3cx = phone3cxCurrent;
  var destinationTmp3cx = destination3cxCurrent;


  //XuLyEndCall(phoneTmp3cx,destinationTmp3cx);
  //XuLyEndCall2(phoneTmp3cx,destinationTmp3cx);
  XuLyEndCall3(phoneTmp3cx, destinationTmp3cx);




  currentCall = undefined;
}





function playRingtone(in_type) {
  clearRingtone();

  function dialing() {
    rinnger = new Audio(audioBlobs.EarlyMedia_US.blob);
    rinnger.preload = "auto";
    rinnger.loop = true;
    rinnger.play().then(function () {
      // Audio Is Playing
    }).catch(function (e) {
      console.warn("Unable to play audio file.", e);
    });
  }

  function ringing() {
    rinnger = new Audio(audioBlobs.Ringtone.blob);
    rinnger.preload = "auto";
    rinnger.loop = true;
    rinnger.play().then(function () {
      // Audio Is Playing
    }).catch(function (e) {
      console.warn("Unable to play audio file.", e);
    });
  }

  // Kiểm tra loại và gọi hàm phù hợp
  if (in_type === 'dialing') {
    dialing();
  } else if (in_type === 'ringing') {
    ringing();
  }
}


function clearRingtone() {
  if (rinnger !== null && rinnger !== undefined) {
    rinnger.pause();
    rinnger.removeAttribute('src');
    rinnger.load();
    rinnger = null;
  }
}

function PreloadAudioFiles() {
  audioBlobs.Ringtone = { file: "Ringtone_1.mp3", url: "https://app-omn1.dxws.io:8080/app/file/Ringtone_1.mp3" }
  audioBlobs.EarlyMedia_US = { file: "Tone_EarlyMedia-US.mp3", url: "https://app-omn1.dxws.io:8080/app/file/Tone_EarlyMedia-US.mp3" }

  $.each(audioBlobs, function (i, item) {
    var oReq = new XMLHttpRequest();
    oReq.open("GET", item.url, true);
    oReq.responseType = "blob";
    oReq.onload = function (oEvent) {
      var reader = new FileReader();
      reader.readAsDataURL(oReq.response);
      reader.onload = function () {
        item.blob = reader.result;
      }
    }
    oReq.send();
  });
}


// [Luu Y] Goi ham nay de khoi tao cac file am thanh: PreloadAudioFiles();
// Inbound ringtone: playRingtone('ringing');
// Outbound ringtone: playRingtone('dialing');
// Clear ringtone: clearRingtone();