import {WebSocketServer} from 'ws'
import { fetchPrice } from './src/service/fetch-price'
import { isUpdated, updateLastPrice } from './src/service/state'

const PORT = 3000
const POLL_INTERVAL = 2500



const wss = new WebSocketServer({ port: PORT })
console.log(`Server started on port ws://localhost:${PORT}`);


let clients: WebSocket[] = [];

wss.on('connection', function connection(ws) {
    //@ts-ignore
    clients.push(ws);
    console.log('connected: %d client connected', clients.length);
     
    ws.on('close', function() {
        //@ts-ignore
        clients = clients.filter(client => client !== ws);
        console.log('Client disconnected');
    });
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
});


setInterval(async () => {

    try {

        const priceData = await fetchPrice();
        if(isUpdated(priceData.price)){
            updateLastPrice(priceData.price);
            const message = {
                type: 'btc_price',
                data: priceData
            }
            clients.forEach(client => {
                if(client.readyState === WebSocket.OPEN){
                    client.send(JSON.stringify(message));
                }
            });

            console.log(`Updated data to ${JSON.stringify(priceData)}`);
        }
        else {
            console.log(`Price not updated`);
        }

    }
    catch(e){
        console.log('Error fetching price', e);
    }

}, POLL_INTERVAL)