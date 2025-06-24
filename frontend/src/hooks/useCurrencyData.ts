export const useCurrencyData = (ws: WebSocket) => {

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);

        if(data.type === 'btc_price'){
            const input = document.getElementById('price') as HTMLInputElement;
            input.value = data.data.price;
        }
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };



}