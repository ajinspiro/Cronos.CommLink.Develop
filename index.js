// --------------------------------------------------------------------------------------------------------------------
// <copyright file="index.js" company="Cronos, Inc.">
//   © Cronos Binary. All Rights Reserved
// </copyright>
// <summary>
//   Defines the external worker for Camunda BPMN Engine.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

const port = 3000;

presentation =
    `http://192.168.80.xx:${port}`;
tekton =
    `http://192.168.80.20:${port}`;
mailman =
    `http://192.168.80.22:${port}`;

tektonPort = '62443';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
const router = express.Router();

app.use(bodyParser.json());

function ResolveHost(str) {
    str.replace('mailman', mailman);
    str.replace('tekton', tekton);
    str.replace('presentation', presentation);
    return str;
}

router.post('/:receiver/http:action*', function (req, res) {
    action = req.params.action;
    receiver = req.params.receiver;
    url = req.param(0);
    body = req.body;

    const { receiver, action } = req.params;

    console.log({
        'action': action,
        'url': url,
        'body': body,
        'receiver': receiver
    })

    if (action == "GET" || action == "get") {
        request.get(`http://localhost:3332`);
    }

    switch (receiver)
    {
        case 'mailman':
            ResolveAndSendToMailman(action, url, body);
            break;
        case 'tekton':

            break;

        case 'presentation':

            break;
        default:
            res.sendStatus(417); //Expectation failed
    }
    res.sendStatus(200);
});
function ResolveAndSendToMailman(action, url, body) {
    switch (action) {
        case 'GET':
        case 'get':
            request.get(`${mailman}/${url}`);
            break;
        case 'POST':
        case 'post':
            request.post(`${mailman}/${url}`, { json: body });
            break;
        default:
    }
}
app.use(router);

app.listen(port, () => console.log(`Cronos.CommLink running on ${port}`));


// receiver  script
/*

const express = require('express');
const app = express();
const request = require('request');
const router = express.Router();
const bodyParser = require('body-parser');
let mailman = "http://localhost:49460"; //mailman
lclhst = 'https://localhost:62443'; //tekton

app.use(bodyParser.json());

router.post('/:controller/:action', function (req, res) {
    controller = req.params.controller;
    action = req.params.action;
    body = req.body;
    console.log({
        'controller': controller,
        'action': action,
        'body': body
    });

    request.post(`${lclhst}/${controller}/${action}`, { json: body });
    
    res.send("mailman commlink client success: post");
});

router.get('/:controller/:action*', function (req, res) {
    controller = req.params.controller;
    action = req.params.action;

    console.log({
        'controller': controller,
        'action': action,
    });

    request.get(`${lclhst}/api/${controller}/${action}`);
    request.get(`${lclhst}/${controller}/${action}`);
    res.send("mailman commlink client success: get");
});

app.use(router);

app.listen(3000, () => console.log(`Cronos.CommLink running on 3000`));

*/