const logger = require('@brickyard/logger')
const _ = require('lodash')
const Server = require('./server')
const service = require('./service')
const config = require('./config.js')

const server = new Server()

const DEFAULT_OPTIONS = {
	port: 6688,
}

const port = _.get(config, 'web.port') || _.get(DEFAULT_OPTIONS, 'port')

server.on('message', ({ buffer, reply }) => {
	console.log('buffer', buffer)
	process.nextTick(() => {
		try {
			service.execute(buffer, reply)
		} catch (e) {
			logger.console.error('[udp-echo-server error] %o', e)
		}
	})
})
server.on('error', (err) => { logger.console.error('[udp-echo-server error....] %s', err) })

async function start() {
	await server.listen(port)
	logger.console.info('Listen @ %s', port)
	logger.console.info('PID: %s', process.pid)
	logger.console.info('TTY MODE: %s', !!process.stdout.isTTY)
}

start()
