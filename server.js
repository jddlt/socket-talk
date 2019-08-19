const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let people = 0;
let peopleId = []

io.on('connection', (socket) => {
  people += 1;
  peopleId.push(socket.id)
  io.emit('people', { people })
  
  socket.on('disconnect', () => {
    people -= 1
    peopleId.splice(peopleId.indexOf(socket.id), 1)
    io.emit('people', { people })
  });
  
  socket.on('msg', (msg) => {
    peopleId.forEach((val, index) => {
      if (socket.id != val) {
        io.to(val).emit('msg',{ msg });
      }
    })
  });
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client.html')
})

server.listen(3000);


