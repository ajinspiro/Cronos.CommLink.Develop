const { Client, logger } = require('camunda-external-task-client-js');
const fs = require('fs');
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger }
var engineClient = new Client(config);

engineClient.subscribe('charge-card', async function ({task, taskService}) {
    //logic

    const amount = task.variables.get('amount');
    const item = task.variables.get('item');

    console.log(`${item} costs $${amount}. Credit card has been charged`);

    await taskService.complete(task);
})

engineClient.subscribe('print-sum', async function ({ task, taskService }) {
    llog('Printing sum');
    let sum = task.variables.get('sum');
    llog(sum);;
    await taskService.complete(task);
});

function llog(data){
    console.log(data);
}
