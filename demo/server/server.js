const webpack 			 = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
import WebpackDevServer from 'webpack-dev-server';

const { Server } 			 = require('http');
const express 			 = require('express')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const path 				 = require('path')

const port   = process.env.PORT || 3000;
const app 	 = express()
const server = Server(app)

const webpackConfig  = require('../../webpack-demo.config.js');
const compiler 	   = webpack(webpackConfig);

// const app = new WebpackDevServer(compiler, {
//   contentBase: '/public/',
//   publicPath: '/js/',
//   stats: {colors: true},
// });

app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

const persistManager = require('./data-access/persist-manager.js');
persistManager.ready().then(function() {
  // app references
  const hoursReportRouter = require('./routers/hours-report-router');
  const employeesRouter = require('./routers/employees-router');
  const kindergartenRouter = require('./routers/kindergarten-router');

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(morgan('combined'));
  
  app.use('/', express.static(path.resolve(__dirname, 'public')));
  app.use('/api', kindergartenRouter());
  app.use('/api', employeesRouter());
  app.use('/api', hoursReportRouter());

  app.get("*", function(req, res, next) {
    res.sendFile(path.resolve(__dirname, '../client/index.html'))
  })
  
  server.listen(port,function(error) {
    if (error) {
      console.error(error)
    } else {
      console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port )
    }
  })
  
}).catch(function(err) {
  console.error(err);
  process.exit(500);
});
  
