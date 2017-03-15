const express = require('express'), app = express();

app.use(express.static(__dirname + '/public'));

app.use('/', (req,res){
  res.sendFile(__dirname + '/index.html');
}

app.listen(process.env.PORT || 8080);
