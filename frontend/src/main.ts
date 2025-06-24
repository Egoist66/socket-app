import { App } from "./components/App";
import { useCurrencyData } from "./hooks/useCurrencyData";
import { useWebScoket } from "./hooks/useWebSocket";
import { createApp } from "./render/createApp";


import "./style/app.css";

createApp({
  root: "#app",
  app: App,
  onInited() {
    const {ws} = useWebScoket('ws://localhost:3000');
    useCurrencyData(ws);
    

  },

});


