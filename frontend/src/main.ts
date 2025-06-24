import { App } from "./components/App";
import { createApp } from "./render/createApp";


import "./style/app.css";

createApp({
  root: "#app",
  app: App,
  onInited() {},

});


