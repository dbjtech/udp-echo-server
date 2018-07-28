const logger = require('@brickyard/logger')
const squ = require('squel')
const moment = require('moment')
const mysql = require('mysql')
const config = require('../config.js')

const pool = mysql.createPool(config.mysql)

async function execute(buffer, reply) {
	logger.console.info('[udp-echo-server] [Receive] %s', buffer.toString())
	const reqData = buffer.toString()
	if ((reqData.length === 15) && (/^[1-9]\d*$/.exec(reqData) !== null)) {
		const arr = new Uint16Array(1)
		arr[0] = 1
		const { text, values } = squ.insert().into('echo_record').setFields({
			imei: reqData,
			timestamp: moment().unix(),
		}).toParam()
		pool.query(text, values)
		logger.console.info('[udp-echo-server] [send] %s', buffer.toString('hex'))
		reply(Buffer.from(arr))
	}
}

module.exports = {
	execute,
}
