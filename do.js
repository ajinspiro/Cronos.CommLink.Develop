// --------------------------------------------------------------------------------------------------------------------
// <copyright file="index.js" company="Cronos, Inc.">
//   © Cronos Binary. All Rights Reserved
// </copyright>
// <summary>
//   Defines the CommLink.
// </summary>
// --------------------------------------------------------------------------------------------------------------------
const solutionPort = require('./CommLink.config').solutionPort;

localhost = `http://localhost:${solutionPort}`;
const port = 3000;
presentation =
    `http://192.168.80.xx:${port}/`;
tekton =
    `http://192.168.80.20:${port}/`;
mailman =
    `http://192.168.80.22:${port}/`;


const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
const router = express.Router();

app.use(bodyParser.json());

function ResolveHost(url) {
    url = url.replace('mailman', mailman);
    url = url.replace('tekton', tekton);
    url = url.replace('presentation', presentation);
    return url;
}
function ResolveHTTPVerb(url) {
    let result = 0;
    result = (url.includes('/GET/')) ? { url: url.replace('/GET/', ''), Verb: "GET" } : result;
    result = (url.includes('/POST/')) ? { url: url.replace('/POST/', ''), Verb: "POST" } : result;
    if (result === 0) throw "invalid http verb";
    return result;
}
router.post('/call/*', function (req, res) {
    //
    console.log("req.body : " + JSON.stringify(req.body, null, 3));
    //
    url = req.param(0);
    console.log('routematch => [POST] /call/* \n url: ' + url);
    url = ResolveHost(url);
    result = ResolveHTTPVerb(url);
    if (result.Verb == "GET") {
        console.log('requesting GET: ' + result.url);

        request.get(result.url, function (err, get_response, get_body) {
            if (err) throw `\n\nHTTP GET failed for ${result.url} : ${new Date()}\n${err}\n\n`;
            console.log(`response received for GET:${result.url} as :  ${JSON.stringify(get_body, null, 3)}`);
            res.status(get_response.statusCode).send(get_body);
        })
    }
    if (result.Verb == "POST") {
        console.log('requesting POST: ' + result.url);

        request.post({
            headers: { 'Content-Type': 'application/json' },
            url: result.url,
            body: req.body
        }, function (err, post_response, post_body) {
            if (err) throw `\n\nHTTP POST failed for ${result.url} : ${new Date()}\n${err}\n\n`;
            console.log(`response received for POST:${result.url} as :  ${JSON.stringify(post_body, null, 3)}`);
            res.status(post_response.statusCode).send(post_body);
        })
    }

});
router.post('/*', function (req, res) {
    //
    console.log("req.body : " + JSON.stringify(req.body, null, 3));
    //
    url = req.param(0);
    console.log('routematch => [POST] /* \n url: ' + url);
    console.log(`POST request received: bypassing to ${localhost}/${url}`);
    
    request.post({
        headers: { 'Content-Type': 'application/json' },
        url: `${localhost}/${url}`,
        body: req.body
    }, function (err, post_response, post_body) {
        if (err) throw `\n\nHTTP POST failed for ${localhost}/${url} : ${new Date()}\n${err}\n\n`;
        console.log(`response received for POST:${localhost}/${url} as :  ${JSON.stringify(post_body, null, 3)}`);
        res.status(post_response.statusCode).send(post_body);
    })
})
router.get('/*', function (req, res) {
    //
    console.log("req.body : " + JSON.stringify(req.body, null, 3));
    //
    url = req.param(0);
    console.log('routematch => [GET] /* \n url: ' + url);
    console.log(`GET request received: bypassing to ${localhost}/${url}`);
    request.get(`${localhost}/${url}`);
    res.send("TODO");
})
app.use(router);

app.listen(port, () => console.log(`Cronos.CommLink running on ${port}`));