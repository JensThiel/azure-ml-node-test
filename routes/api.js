
"use strict";

const router = require("express").Router();
var bodyParser = require("body-parser");
var querystring = require("querystring");
var fetch = require('node-fetch');
const api_key = require('../keys');
router

.get('/',function(req,res){
    res.json({message:'API'});
})
.post('/guess-income',function(req,res){
  guess(req.body).then(data=>{
    var prob = data.Results.output1.value.Values[0][11] >= 50 ? data.Results.output1.value.Values[0][11]:1-data.Results.output1.value.Values[0][11];
    var response = {
      estimated_income: data.Results.output1.value.Values[0][10],
      probability : prob*100
    }
    res.json({message:response});
  });
  
})

var guess=function(data){
  return new Promise((resolve,rejects)=>{
    fetch('https://ussouthcentral.services.azureml.net/workspaces/8343fd3bbd2943f28f9a8a8b427ee59b/services/815154a6fb5b42efa77f0caee89443d3/execute?api-version=2.0&details=true', { 
      method: 'POST',
      body:    JSON.stringify(buildGuessBody(data)),
      headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+api_key.microsoft_api},
  })
      .then(res => res.json())
      .then(json => resolve(json));
  })
}

var buildGuessBody = function(body){
  return {
    "Inputs": {
      "input1": {
        "ColumnNames": [
          "age",
          "workclass",
          "fnlwgt",
          "education",
          "education-num",
          "marital-status",
          "occupation",
          "relationship",
          "race",
          "sex",
          "capital-gain",
          "capital-loss",
          "hours-per-week",
          "native-country",
          "income"
        ],
        "Values": [
          [
            body.age,
            body.workclass,
            "0",
            body.education,
            "0",
            body.maritalstatus,
            body.occupation,
            "0",
            body.race,
            body.sex,
            "0",
            "0",
            body.hoursperweek,
            body.nativecountry,
            "value"
          ]
        ]
      }
    },
    "GlobalParameters": {}
  }
}
module.exports = router;