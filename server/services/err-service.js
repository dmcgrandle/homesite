/* -------------------        err-service.js               -------------------
------------------------------------------------------------------------------*/

// require('./db-service').then(res => {db = res});

exports.processError = (err, res) => {
  console.log(Date(Date.now()) + ' : ' + err.stack);
  const statusCode = Number(err.message.slice(0, 3));
  if (!statusCode) {
    res.status(500).send('Server Error "' + err.message + '" - see server log for details');
  } else {
    const msg = err.message.slice(4);
    res.status(statusCode).send(msg);
  }
};

exports.exit = (err, code) => {
  //  throw new Error('001 Error connecting to database');
  console.log(err);
  process.exit(code);
};
