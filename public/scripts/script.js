function init() {
    window.scrollTo(0, 0);
    $("#chatInputContainer").hide();
}
$(() => {init();});
function init() {
    window.scrollTo(0, 0);
    $("#chatInputContainer").hide();
}
$(() => {init();});

//handles file upload display
/*
//handles file upload display
/*
$('#fileInput').on('change', function() {
    const fileName = $(this).prop('files')[0] ? $(this).prop('files')[0].name : 'No file chosen';
    $('#fileName').text(fileName); 
});
*/

let throbber = '<div id="throbMsg" class="resMsg"><div class="throbber" id="throbber"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>';
let msgCount = 0;

//handles initial submit button
let hasBeenRun = false;
let waiting = false;
$('#initialSubmit').click(() => {
    if (waiting){    
        console.log(waiting);
    }else if (!hasBeenRun){
        hasBeenRun = !hasBeenRun;
        firstClick();
    }else{
        window.alert("There's a new text box!!! Use it!");
    }
});


$('#sendBtn').click(() => {
    
    if ($('#userInput').val() != "" && !waiting){
        waiting = true;
        let userMsg = $('#userInput').val();
        const msgJson = {"message":userMsg};
        const jsonString = JSON.stringify(msgJson);
    
        console.log(jsonString);
        $("#chatBox").append(`<div class='userMsg'>${userMsg}</div>`);
        $('#userInput').val('');
    
        
        $.ajax({
            url: '/upload/json', //replace with server endpoint
            type: 'POST',
            data: jsonString,
            contentType: 'application/json',
            processData: false,
            success: function(response) {
                console.log('Success:', response);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error:', textStatus, errorThrown);
            }
        });
        
    
        writeResponse("msg");
    }


});

async function firstClick(){
    waiting = true;

    let major = $('#major').val();
    let year = $('#year').val();
    let courses = $('#courses').val();
    let career = $('#career').val();

    $('#major').val('');
    $('#year').val('');
    $('#courses').val('');
    $('#career').val('');

    const msgJson = {"major":major, "year":year, "courses":courses, "career":career};
    // let formData = new FormData();
  
    console.log(msgJson);

    //formData.append('major', major);
    //formData.append('year', year);
    //formData.append('courses', courses);
    //formData.append('career', career);

    //pdf handler
    /*
    let file = 0;
    if (fileInput.files.length > 0) {
        file = fileInput.files[0];
    }
    formData.append('resume', file);
    */
    //console.log(formData);
    //console.log(formData.get('major'));
    //console.log(formData.get('year'));
    //console.log(formData.get('courses'));
    //console.log(formData.get('career'));
  

    
    
    $.ajax({
        url: '/upload/json', //replace with server endpoint
        type: 'POST',
        data: JSON.stringify(msgJson),
        contentType: 'application/json',
        processData: false,
        success: function(response) {
            console.log('Success:', response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error:', textStatus, errorThrown);
        }
    });


    $("#chatBox").append(throbber);

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    await sleep(2000);
    msg = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    writeResponse(msg);

}

async function writeResponse(msg){
    let msgWords = msg.split(' ');
    $("#throbMsg").remove();
    $("#chatBox").append(`<div id=${"msg" + msgCount} class='resMsg'></div>`);
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    while (msgWords.length > 0){
        let toAppend = "";
        for (let i = 0; i < 5; i++){
            if (msgWords[i] != undefined){
                toAppend += msgWords[i] + " ";
            }   
        }
        $(`#${"msg" + msgCount}`).append(toAppend);
        msgWords.splice(0, 5);
        await sleep(100);
    }
    msgCount++;
    $("#chatInputContainer").show();
    waiting = false;
}

/*
let newElement = $("<div class='userMsg'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>");
$("#chatBox").append(newElement);
let newerElement = $("<div class='resMsg'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>");
$("#chatBox").append(newerElement);
*/