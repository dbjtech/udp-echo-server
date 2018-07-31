const logger = require('@brickyard/logger')
const moment = require('moment')
const JsonDb = require('node-json-db')

const db = new JsonDb('echo_recoed', true, false)

async function execute(buffer, reply) {
	logger.console.info('[udp-echo-server] [Receive] %s', buffer.toString())
	const reqData = buffer.toString()
	if ((reqData.length === 15) && (/^[1-9]\d*$/.exec(reqData) !== null)) {
		db.push(`/${reqData}`, moment().unix())

		const arr = new Uint16Array(1)
		arr[0] = 1
		logger.console.info('[udp-echo-server] [send] %s', Buffer.from(arr).toString('hex'))
		reply(Buffer.from(arr))
	}
}

module.exports = {
	execute,
}
