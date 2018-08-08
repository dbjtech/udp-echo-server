const logger = require('@brickyard/logger')
const _ = require('lodash')
const Koa = require('koa')
const body = require('koa-body')
const Koaqs = require('koa-qs')
const Server = require('./server')
const service = require('./service')
const config = require('./config.js')
const router = require('./koa-router')

const server = new Server()
const app = new Koa()
app.use(body({ multipart: true, strict: false }))
Koaqs(app)

const DEFAULT_OPTIONS = {
	port: 6688,
}

const port = _.get(config, 'web.port') || _.get(DEFAULT_OPTIONS, 'port')
const host = _.get(config, 'web.host') || _.get(DEFAULT_OPTIONS, 'host')

server.on('message', ({ buffer, reply }) => {
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
	app.use(router.router.routes())
	app.use(router.router.allowedMethods())
	app.listen(port, host, () => {
		console.log('Start Http Server @ %s:%s', host, port)
	})
}

start()
