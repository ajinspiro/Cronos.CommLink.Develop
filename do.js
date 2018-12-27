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

function llog(data) {
    let colorArr = [
        "\x1b[38m",
        "\x1b[31m",
        "\x1b[32m",
        "\x1b[33m",
        "\x1b[34m",
        "\x1b[35m",
        "\x1b[36m",
        "\x1b[37m"];
    let random = Math.floor((Math.random() * 8));
    let color = colorArr[random];
    console.log(color);
    let h = new Date().getHours();
    let m = new Date().getMinutes();
    let s = new Date().getSeconds();
    let ms = new Date().getMilliseconds();

    console.log(color,'===================================================')
    console.log(color,`${h}:${m}:${s}:${ms}`);
    console.log(color,'--------------------------------------------------')
    console.log(color,`${ data }`);
    console.log(color,'===================================================')
}
router.post('/call/*', function (req, res) {
    url = req.param(0);
    llog('routematch => [POST] /call/* \n url: ' + url);
    llog("req.body : " + JSON.stringify(req.body, null, 3));
    url = ResolveHost(url);
    result = ResolveHTTPVerb(url);
    if (result.Verb == "GET") {
        llog('requesting GET: ' + result.url);

        request.get(result.url, function (err, get_response, get_body) {
            if (err) {
                llog(`response failed for GET:${result.url}. {Error}: \n${err} \n {get_response}: \n${get_response}`)
                res.status(500).send("HTTP Failed");
            }
            llog(`response received for GET:${result.url} as : \n ${JSON.stringify(get_body, null, 3)}`);
            res.status(get_response.statusCode).send(get_body);
        })
    }
    if (result.Verb == "POST") {
        llog('requesting POST: ' + result.url);

        request.post({
            headers: { 'Content-Type': 'application/json' },
            url: result.url,
            body: req.body,
            json: true
        }, function (err, post_response, post_body) {
            if (err) {
                llog(`response failed for POST:${result.url}. {Error}: \n${err} \n {post_response}: \n${post_response}`)
                res.status(500).send("HTTP Failed");
            }
            llog(`response received for POST:${result.url} as : \n ${JSON.stringify(post_body, null, 3)}`);
            res.status(post_response.statusCode).send(post_body);
        })
    }
    res.send("Control should not reach here 3");
});
router.post('/*', function (req, res) {
    //
    llog("req.body : " + JSON.stringify(req.body, null, 3));
    //
    url = req.param(0);
    llog('routematch => [POST] /* \n url: ' + url);
    llog(`POST request received: bypassing to ${localhost}/${url}`);
    
    request.post({
        headers: { 'Content-Type': 'application/json' },
        url: `${localhost}/${url}`,
        body: req.body,
        json: true
    }, function (err, post_response, post_body) {
        if (err) {
            llog(`response failed for POST:${result.url}. {Error}: \n${err} \n {post_response}: \n${post_response}`)
            res.status(500).send("HTTP Failed");
        }
        llog(`response received for POST:${localhost}/${url} as : \n${JSON.stringify(post_body, null, 3)}`);
        res.status(post_response.statusCode).send(post_body);
        })
    res.send("Control should not reach here 2");
})
router.get('/*', function (req, res) {
    url = req.param(0);
    llog('routematch => [GET] /* \n url: ' + url);
    llog("req.body : " + JSON.stringify(req.body, null, 3));
    llog(`GET request received: bypassing to ${localhost}/${url}`);
    request.get(`${localhost}/${url}`, function (err, get_response, get_body) {
        if (err) {
            llog(`response failed for GET:${result.url}. {Error}: \n${err} \n {get_response}: \n${get_response}`)
            res.status(500).send("HTTP Failed");
        }
        llog(`response received for GET:${localhost}/${url} as : \n${JSON.stringify(get_body, null, 3)}`);
        res.status(get_response.statusCode).send(get_body);
    });
    res.send("Control should not reach here 1");
})
app.use(router);

app.listen(port, () => llog(`Cronos.CommLink running on ${port}`));