/**
 * Listens for messages from the WebSocket connection and updates the 
 * #price input with the received data when the type is 'btc_price'.
 * 
 * @param {WebSocket} ws - The WebSocket connection to listen to.
 */
export const useCurrencyData = (ws: WebSocket) => {

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);

        if(data.type === 'btc_price'){
            const input = document.getElementById('price') as HTMLInputElement;
            input.value = `${data.data.price} - ${new Date(data.data.time).toLocaleTimeString()}`
        }
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };



}