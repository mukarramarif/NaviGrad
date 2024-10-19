function init() {}

$( () => {init();});

// Handles file upload display
$('#fileInput').on('change', function() {
    const fileName = $(this).prop('files')[0] ? $(this).prop('files')[0].name : 'No file chosen';
    $('#fileName').text(fileName); 
});

// Handles initial submit button
$('#initialSubmit').click(() => {
    let major = $('#major').val();
    let year = $('#year').val();
    let courses = $('#courses').val();
    let career = $('#career').val();

    let jsonData = {
        major: major,
        year: year,
        courses: courses,
        career: career
    };

    // First AJAX call for JSON data
    $.ajax({
        url: '/upload/json',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(jsonData),
        success: function(response) {
            console.log('JSON Data Success:', response);

         

           
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('JSON Data Error:', textStatus, errorThrown);
        }
    });
    //    // Second AJAX call for file upload
    //    let formData = new FormData();
    //    let file = $('#fileInput').prop('files')[0];
    //    console.log('File:', file);
    //    formData.append('resume', file);
    // $.ajax({
    //     url: '/upload/file',
    //     type: 'POST',
    //     data: formData,
    //     contentType: false,
    //     processData: false,
    //     success: function(response) {
    //         console.log('File Upload Success:', response);
    //     },
    //     error: function(jqXHR, textStatus, errorThrown) {
    //         console.error('File Upload Error:', textStatus, errorThrown);
    //     }
    // });
    $('#major').val('');
    $('#year').val('');
    $('#courses').val('');
    $('#career').val('');
});
