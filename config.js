
module.exports = {
  port: 7005,
  db: {
  	port:process.env.MYSQL_PORT || 34001,
    host : process.env.MYSQL_HOST || 'localhost',
    user : process.env.MYSQL_USER || 'root',
    password : process.env.MYSQL_PASS || 'mysql1234',
    database : process.env.MYSQL_DATABASE || 'plugctc',
    timezone: 'asia/bangkok',
  },
  socket: {
    url: 'https://socket.bpcd.xenex.io',
    user: 'bpcd',
    pass: 'bpcd!@1234',
  },
}
