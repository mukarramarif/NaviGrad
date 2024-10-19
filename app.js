var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var {spawn} = require('child_process');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Set storage options for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Append the file extension
  }
});

// Initialize multer with storage settings
const upload = multer({ storage });

// Create 'uploads' directory if it doesn't exist
const fs = require('fs');
const csvWriter = require('csv-writer').createObjectCsvWriter;
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Route for handling single file upload
app.post('/upload', upload.single('file'), (req, res) => {
  // check for major, class year, carrer goals and file
  if (!req.body.major || !req.body.classYear || !req.body.careerGoals || !req.file) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const writer = csvWriter({
    path: 'uploads/data.csv',
    header: [
      { id: 'major', title: 'Major' },
      { id: 'classYear', title: 'Class Year' },
      { id: 'careerGoals', title: 'Career Goals' },
      { id: 'file', title: 'File' }
    ],
    append: true
  });

  const record = {
    major: req.body.major,
    classYear: req.body.classYear,
    careerGoals: req.body.careerGoals,
    file: req.file.filename
  };

  writer.writeRecords([record])
    .then(() => {
      console.log('CSV file was written successfully');
    })
    .catch(err => {
      console.error('Error writing to CSV file', err);
    });
  const pythonProcess = spawn('python', ['resume_parse.py']);
  let scriptOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    scriptOutput += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    scriptOutput += data.toString();
  });
  pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
    if (code === 0) {
      res.status(200).json({
        message: 'File uploaded successfully and Python script executed',
        major: req.body.major,
        classYear: req.body.classYear,
        careerGoals: req.body.careerGoals,
        file: req.file,
        scriptOutput: scriptOutput
      });
    } else {
      res.status(500).json({
        message: 'File uploaded but Python script failed',
        error: scriptOutput
      });
    }
  });
  
});

// Serve static files (for client testing purposes)
app.use(express.static('public'));



// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

// Start the server
app.listen(8800, () => {
  console.log('Listening on port 8800');
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
module.exports = app;
