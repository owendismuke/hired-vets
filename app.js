var app = require('./server-config.js');
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'));