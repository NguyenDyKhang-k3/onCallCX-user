
//aa
var recordticket = undefined;

var idContactZendesk = null;
function FindIdContactByPhoneTypeOld(phone, callback) {
    console.log("CreateContactWithPhoneOld:  phone: " + phone);
    var idcontact = undefined;
    if (phone != "") {
        client.request('/api/v2/users/autocomplete.json?phone=' + phone).then(
            function (result) {
                console.log("CreateContactWithPhoneOld: data " + result);
                if (result != null && result.users.length > 0) {
                    idcontact = result.users[0].id;
                    console.log("Tạo Contact với id : " + idcontact );
                    callback(idcontact);
                } else {
                    callback(null);
                }
            },
            function (error) {
                console.log(JSON.stringify(error));
                callback(null);
            }
        );
    }
    return idcontact;
}

function FindIdContactByPhone(phone, callback) {
    if ((phone !== "") && (phone.length > 0)) {
        FindIdContactByPhoneTypeOld(phone, idcontact_tmp => {
            console.log("ketqua tim voi phone: " + idcontact_tmp);
            if (idcontact_tmp === null || idcontact_tmp === 0) {
                console.log("chuẩn bị vào hàm tạo contact mới");
                idcontact_tmp = CreateContactWithPhoneOld(phone, idcontact => {
                    console.log("ketqua tao contact: " + idcontact)
                    if (idcontact === null || idcontact === 0) {
                        callback(null);
                    } else {
                        callback(idcontact);
                    }
                });

            } else {
                callback(idcontact_tmp);
            }
        });
    }
}

function CreateContactWithPhoneOld(phone, callback) {
    console.log("FindIdContactByPhoneType: phone: " + phone)
    var idcontact = 0;
    if ((phone != "") && (phone.length > 0)) {
        var options = {
            contentType: "application/json",
            data: JSON.stringify({
                user: {
                    name : "[CALL] New Contact " + phone,
                    phone :  phone
                }
            }),
            dataType: "json",
            method: "POST",
            url: "/api/v2/users.json",
        }
        client.request(options).then(
            function (result) {
                console.log("bien data: " + result);                
                if (result != null && result.user !=null) {
                    idcontact = result.user.id;
                    console.log(" Contact create với id : " + idcontact);
                    callback(idcontact);
                } else {
                    callback(null);
                }
            },
            function (error) {
                console.log("CreateContactWithPhoneOld error: " + error);
                console.log(JSON.stringify(error));
                callback(null);
            }
        );
    }
}

function FindIdTicketToPopup(phone, chieugoi, callback) {
    console.log("FindIdTicketToPopup: phone: " + phone + " chieugoi: " + chieugoi)
    if ((phone != "") && (phone.length > 0)) {
        FindIdContactByPhone(phone, idcontact => {
            console.log("Kết quả tìm idcontact: " + idcontact)
            UpdateName(idcontact);
            CreatedTicketByContactNew(phone,idcontact, chieugoi, idticket => {
                console.log("Kết quả tìm idticket: " + idticket);
                callback(idticket);
            });
           
        });
    }
    else {
        console.log("không thấy số điện thoại: ");
    }
}



function FindIdContactToPopup(phone, chieugoi, callback) {
    console.log("FindIdTicketToPopup: phone: " + phone + " chieugoi: " + chieugoi)
    if ((phone != "") && (phone.length > 0)) {
        FindIdContactByPhone(phone, idcontact => {
            console.log("Kết quả tìm idcontact: " + idcontact)
            UpdateName(idcontact);
         
            callback(idcontact);
        });
    }
    else {
        console.log("không thấy số điện thoại: ");
    }
}


function getIdUser()
{
    client.get('currentUser').then(z=>idUserZendesk = z.currentUser.id);
}

function CreatedTicketByContactNew(phone,idcontact, chieugoi, callback) {
    console.log("CreatedTicketByContactNew -- idcontact: " + idcontact + " chieugoi: " + chieugoi)
    
    var idticket = undefined;

    console.log("Iduser: " + idUserZendesk);

    if ((idcontact != "")) {

        var tieudeticket = "";
        var datetimenow = moment().format('DD/MM/YYYY HH:mm:ss');
        var channelList = "call_channel";
        if (chieugoi == "Inbound") {
            tieudeticket = "[Inbound] Ticket for Call(cloud based) " + datetimenow;
        }
        else {
            tieudeticket = "[Outbound] Ticket for Call(cloud based) " + datetimenow;
            channelList = "outbound_channel";
        }

        var options = {
            contentType: "application/json",
            data: JSON.stringify({
                ticket: {
                    subject : tieudeticket,
                    requester_id : idcontact,
                    is_public : false,
                    comment: {
                        body :  tieudeticket
                    }
                    ,custom_fields: [
                        //  {
                        //      id: 900001251706, // Biến custom filed 
                        //      value: phone
                        //  }

                        {
                              id: 360004983472, // Biến custom filed Channel 900005637383:idb   360004983472: smartnet
                              value: channelList
                          }
                    ]
                    ,assignee_id: idUserZendesk
                }
            }),
            dataType: "json",
            method: "POST",
            url: "/api/v2/tickets.json",
        }
        client.request(options).then(
            function (result) {
                console.log("bien data: " + result);
                if (result != null && result.ticket != null) {
                    idticket = result.ticket.id;
                    console.log(" ticket create với id : " + result.ticket.id);
                    callback(idticket);
                } else {
                    callback(null);
                }
            },
            function (error) {
                console.log("CreatedTicketByContactNew error: " + error);
                console.log(JSON.stringify(error));
                callback(null);
            }
        );
    }
    return idticket;
}


function CreatedTicketByContact2(phone,idcontact, chieugoi,callback) {
    console.log("CreatedTicketByContactNew -- idcontact: " + idcontact + " chieugoi: " + chieugoi + " phone:" + phone)
    
    var idticket = undefined;

    console.log("Iduser: " + idUserZendesk);

    if ((idcontact != "")) {

        var tieudeticket = "";
        var datetimenow = moment().format('DD/MM/YYYY HH:mm:ss');
        if (chieugoi == "Inbound") {
            tieudeticket = "[Inbound] Ticket for Call(cloud based) " + datetimenow;
        }
        else {
            tieudeticket = "[Outbound] Ticket for Call(cloud based) " + datetimenow;
        }

        var options = {
            contentType: "application/json",
            data: JSON.stringify({
                ticket: {
                    subject : tieudeticket,
                    requester_id : idcontact,
                    is_public : false,
                    comment: {
                        body :  tieudeticket
                    }
                  
                    ,assignee_id: idUserZendesk
                }
            }),
            dataType: "json",
            method: "POST",
            url: "/api/v2/tickets.json",
        }
        client.request(options).then(
            function (result) {
                console.log("bien data: " + result);
                if (result != null && result.ticket != null) {
                    idticket = result.ticket.id;
                    console.log(" ticket create với id : " + result.ticket.id);
                    callback(idticket);

                  
    

                } else {
                    callback(null);
                }
            },
            function (error) {
                console.log("CreatedTicketByContactNew error: " + error);
                console.log(JSON.stringify(error));
                callback(null);
            }
        );
    }
    return idticket;
}


function PopupContact(phone,chieugoi)
{
    console.log("vào hàm PopupContact")
    
    FindIdContactToPopup(phone,chieugoi,idcontact=>{
      if(idcontact!==null&& idcontact!==0)
      {
          //console.log("idticket: " + idticket)
          //recordticket = idticket;
          //PopupTicketFD(idticket);
          idContactZendesk = idcontact;
          PopupContactZD(idcontact);
      }
    });  
}

function PopupTicket(phone,chieugoi) // Inbound
{

    phone3cxCurrent = phone;
    destination3cxCurrent = chieugoi;

  console.log(`vào hàm PopupTicket with phone: ${phone} , chieugoi: ${chieugoi}`)
  FindIdTicketToPopup(phone,chieugoi,idticket=>{
    if(idticket!==null&& idticket!==0)
    {
        console.log("idticket: " + idticket)
        recordticket = idticket;
        PopupTicketFD(idticket);
    }
  });  
}

function PopupTicketFD(input) {
  client.invoke('routeTo', 'ticket', input);
}

function PopupContactZD(input) {
    client.invoke('routeTo', 'user', input);
  }


function UpdateName(input)
{
    console.log("tim kiem contact:  phone: " + input);
    if (input != "") {
        client.request('/api/v2/users/' + input +'.json').then(
            function (result) {
                console.log("UpdateName: data " + result);
                if (result != null && result.user != null) {
                    console.log("name Contact với tim kiem : " + result.user.name);
                    document.getElementsByName("NameContact").forEach(z => {
                        z.innerText = result.user.name;
                    });
                    incommingCallPhoneTop.querySelector("#contactName").textContent = result.user.name;
                    talkingPhoneTop.querySelector("#contactName").textContent = result.user.name;
                } 
            },
            function (error) {
                console.log(JSON.stringify(error));
            }
        );
    }
}




function GetLogCallNew(idTicketGetLogCall, phoneGetLogCall,destinationGetLogCall)
{
    console.log(`GetLogCall -  phone111: ${phoneGetLogCall} - chieugoi111: ${destinationGetLogCall} `)
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) 
      {
        console.log("GetLogCall: result: " + this.responseText)
        var obj = JSON.parse(this.responseText);
          if (obj) {
              var voice_comment = {
                  from : obj.soGoi.replace("Ext.", ""),
                  to : obj.soNhan.replace("Ext.", ""),
                  started_at : moment(obj.thoiGianBatDau).format("YYYY-MM-DDTHH:mm:ss"),
                  call_duration : moment.duration(obj.thoiGianNoiChuyen).asSeconds(),
                  transcription_text : "Trạng thái: " + obj.trangThai
              }
              if (obj.recording != "None") {
                  voice_comment.recording_url = obj.recording;
              }
              AddLogCall(idTicketGetLogCall, voice_comment);
          }
      }
    };
    var domainservice3CX= domainservice + `/PBX/GetRecordingFileGhiAm?sodienthoai=${phoneGetLogCall}&chieugoi=${destinationGetLogCall}`;
    console.log(`GetLogCallNew -  domainservice3CX: ${domainservice3CX} `)
    xhttp.open("GET", domainservice3CX, true);
   
    xhttp.send();
 }

function AddLogCall(idticket, recording_tmp) {
    if (idticket) {
        var options = {
            contentType: "application/json",
            data: JSON.stringify({
                ticket : {
                    voice_comment: recording_tmp
                }
            }),
            dataType: "json",
            method: "PUT",
            url: "/api/v2/tickets/" + idticket +".json",
        }
        client.request(options).then(
            function (data) {
                console.log("bien data: " + data);
                //PopupTicketFD(idticket);

            },
            function (error) {
                console.log("CreatedTicketByContactNew error: " + error);
            }
        );
    }
}