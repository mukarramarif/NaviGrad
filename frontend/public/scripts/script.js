function init() {
    window.scrollTo(0, 0);
    $("#chatInputContainer").hide();
}
$(() => {init();});

//handles file upload display
/*
$('#fileInput').on('change', function() {
    const fileName = $(this).prop('files')[0] ? $(this).prop('files')[0].name : 'No file chosen';
    $('#fileName').text(fileName); 
});
*/

//handles initial submit button
$('#initialSubmit').click(() => {
    let major = $('#major').val();
    let year = $('#year').val();
    let courses = $('#courses').val();
    let career = $('#career').val();

    let formData = new FormData();
    formData.append('type', "initial");
    formData.append('major', major);
    formData.append('year', year);
    formData.append('courses', courses);
    formData.append('career', career);

    //pdf handler
    /*
    let file = 0;
    if (fileInput.files.length > 0) {
        file = fileInput.files[0];
    }
    formData.append('resume', file);
    */
    console.log(formData.get('major'));
    console.log(formData.get('year'));
    console.log(formData.get('courses'));
    console.log(formData.get('career'));
    console.log(formData.get('resume'));

    $('#major').val('');
    $('#year').val('');
    $('#courses').val('');
    $('#career').val('');

    $.ajax({
        url: 'your-server-endpoint', // Replace with your server endpoint
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            console.log('Success:', response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error:', textStatus, errorThrown);
        }
    });

    $("#chatInputContainer").show();
});