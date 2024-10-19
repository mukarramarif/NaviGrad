function init() {}
$( () => {init();});

//handles file upload display
$('#fileInput').on('change', () => {
    const fileName = $(this).prop('files')[0] ? $(this).prop('files')[0].name : 'No file chosen';
    $('#fileName').text(fileName);
});

//handles initial submit button
$('#initialSubmit').click(() => {
    let major = $('#major').val();
    let year = $('#year').val();
    let courses = $('#courses').val();
    let career = $('#career').val();

    console.log(major);
    console.log(year);
    console.log(courses);
    console.log(career);
    

    $('#major').val('');
    $('#year').val('');
    $('#courses').val('');
    $('#career').val('');
});
