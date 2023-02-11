const { ValidationError } = require('sequelize');
const boom = require("@hapi/boom");

function logErrors(err, req, res, next){
  console.error("Middleware error log: "+err.stack);
  next(err);
}

function errorHandler(err,req,res,next){
  res.status(500).json({
    message: err.message,
  });
}

function boomErrorHandler(err,req,res,next){
  if(err.isBoom){
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  }else{
    next(err);
  }
}

function queryErrorHandler(err,req,res,next){
  if(err instanceof ValidationError){
    boomErrorHandler(boom.badRequest(err), req, res, next);
  }
  next(err);
}

module.exports = { logErrors, errorHandler, boomErrorHandler, queryErrorHandler }
