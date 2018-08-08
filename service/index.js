const logger = require('@brickyard/logger')
const moment = require('moment')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./echo_record.json')
const lowdb = low(adapter)
lowdb.defaults({ echo_records: [] }).write()


async function execute(buffer, reply) {
	logger.console.info('[udp-echo-server] [Receive] %s', buffer.toString())
	const reqData = buffer.toString()
	if ((reqData.length === 15) && (/^[1-9]\d*$/.exec(reqData) !== null)) {
		const record = lowdb.get('echo_records').find({ imei: reqData }).value()
		if (record) {
			lowdb.get('echo_records')
				.find({ imei: reqData })
				.assign({ timesamp: moment().unix() })
				.write()
		} else {
			lowdb.get('echo_records').push({ imei: reqData, timesamp: moment().unix() }).write()
		}

		const arr = new Uint16Array(1)
		arr[0] = 1
		logger.console.info('[udp-echo-server] [send] %s', Buffer.from(arr).toString('hex'))
		reply(Buffer.from(arr))
	}
}

module.exports = {
	execute,
}
