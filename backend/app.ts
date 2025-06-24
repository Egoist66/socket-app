import {WebSocketServer} from 'ws'
import { fetchPrice } from './src/service/fetch-price'
import { isUpdated, updateLastPrice } from './src/service/state'

import http from 'http'

const PORT = 3000
const POLL_INTERVAL = 2500



const wss = new WebSocketServer({ port: PORT })
