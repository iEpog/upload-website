let express = require("express");
let app = express();

let fs = require("fs");

let config = {
  port: process.env.PORT
};

var ejs = require("ejs");
app.engine(".ejs", ejs.__express);

var busboy = require("connect-busboy");
app.use(busboy());

function randomID(l) {
  var output = '';
  var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
 //var characters = '♥♣💻😕👶💛💺📁😉⏭🏠🎡🗼💜📥🎫🔉💧💜🙉🐁👮🔌😒💔☻🌐☺' 
 for (let i=1;i<l+1;i++) {
    var c = Math.floor(Math.random()*characters.length + 1);
    output += characters.charAt(c)
  }

  return output;

}

var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/',(req,res)=>{
  
  res.send('<title>Epog</title><h1> Made with ❤️ by Epog </h1> <br></br> <a href="https://github.com/iEpog/upload-website">Project Source<a/>')
})

app.get('/raw/*', (req,res)=>{
  let ID = req.url.split('/')[2] 
      ID = ID.split('?')[0]
  
  if (fs.existsSync(__dirname + "/images/" + ID+'.png')) {
    
     var base64Img = require('base64-img');
  var imageData1 = base64Img.base64Sync('./images/'+ID+'.png');
  var base64Data = imageData1.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
  var img = Buffer.from(base64Data, 'base64');

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': img.length
  });
           res.end(img);

  }else{
    res.send('Cannot Find Image File')
  }
  
  
})


app.get('/*',(req,res)=>{
  
  let ID = req.url.split('/')[1] 
      ID = ID.split('?')[0]
  
  if (fs.existsSync(__dirname + "/images/" + ID+'.png')) {
    
  res.render('./image.ejs',{ID:ID})

  }else{
    res.send('Cannot Find Image File.')
  }
  
})


app.post("/upload", (req, res) => {
  console.log("Upload Request");
  
  let ID=randomID(6)
  
  var fstream;

  req.pipe(req.busboy);
  req.busboy.on("file", function(fieldname, file, filename) {

    fstream = fs.createWriteStream(__dirname + "/images/" + ID+'.png');
    file.pipe(fstream);
    fstream.on("close", function() {
      res.set("pageid",req.protocol + '://' + req.get('host')+'/'+ID );
      console.log('New Image: '+ID+'.png')
      res.sendStatus(200)

      
    });
  });
});

app.listen(config.port, function() {
  console.log("Epog's Simple Image Server");
});
