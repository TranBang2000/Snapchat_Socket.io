const express=require('express');
const app=express();
app.use(express.static('public'));
app.set('view engine','ejs')
app.set('views','./views')
const server=require('http').Server(app)
const io = require("socket.io")(server);
server.listen(3000)
var listUser=[]

io.on("connection", socket => {
    console.log(`Người dùng kết nối ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`Người dùng ${socket.id} vừa ngắt kết nối`);
    })
    socket.on('client-send-username',(data)=>{
        
        if(listUser.indexOf(data)>=0){
            socket.emit('server-send-fail-req')
        }else{
            listUser.push(data)
            socket.Username=data
            socket.emit('server-send-success-req',data)
            io.sockets.emit('server-send-list-user',listUser)
        }
    })
    socket.on('logout',function() {
        listUser.splice(listUser.indexOf(socket.Username),1)
        socket.broadcast.emit('server-send-list-user',listUser)
    })
    socket.on('user-send-message',(data)=>{
        if(!data){
            return 0;
        }
        io.sockets.emit('server-send-message-for-user',{un:socket.Username,mss:data})
    })
    socket.on('user-write-character',function(){
       const s=socket.Username;
        io.sockets.emit('server-send-character',`${s} đang nhập...`)
    })
    socket.on('user-stop-write-character',function(){
       const s=socket.Username;
       io.sockets.emit('server-send-alert',s)
    })
});
app.get('/',(req,res)=>{
    res.render('home')
})