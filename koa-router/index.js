const Router = require('koa-router')
const ajv = require('ajv')({ useDefaults: true })
const _ = require('lodash')
const moment = require('moment')
const fs = require('fs')
const bluebird = require('bluebird')
const schedule = require('node-schedule')

bluebird.promisifyAll(fs)
const { lowdb } = require('../service')

const schedules = []

function register_schedule(name, cron, task) {
	if (schedules[name]) {
		console.log('schedule', name, 'reload') // eslint-disable-line no-console
		schedules[name].cancel()
	}
	console.log(`register schedule ${name} success`)
	schedules[name] = schedule.scheduleJob(cron, () => {
		try {
			task()
		} catch (e) {
			console.error('run schedule error', e.stack) // eslint-disable-line no-console
		}
	})
	return schedules[name]
}

function removeOvertimeRecord() {
	const overtimeRecords = lowdb.get('echo_records').cloneDeep().filter(v => v.timestamp <= moment().subtract(1, 'month').unix())
		.value()
	console.log('remove records:%j', overtimeRecords)
	if (overtimeRecords.length > 0) {
		_.forEach(overtimeRecords, (v) => {
			lowdb.get('echo_records').remove(v).write()
		})
	}
}

const router = new Router()

const schema = {
	properties: {
		startTime: { type: 'number' },
		endTime: { type: 'number' },
	},
	required: ['startTime', 'endTime'],
}

const validate = ajv.compile(schema)

router.get('/get/echo/time', (ctx) => {
	let data = _.mapKeys(ctx.query, (v, k) => _.camelCase(k))
	data = _.mapValues(data, v => _.parseInt(v))
	const valid = validate(data)
	if (!valid) {
		ctx.body = {
			status: 400,
			message: 'paramter error',
		}
		return
	}
	console.log('data', data)
	const dataList = lowdb.get('echo_records').cloneDeep().sortBy(v => v.timestamp <= data.endTime && v.timestamp >= data.startTime)
		.value()
	console.log('dataList1', dataList)
	_.forEach(dataList, (echoRecord) => {
		echoRecord.timestamp = moment(echoRecord.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
	})
	ctx.body = {
		status: 200,
		message: 'success',
		data: dataList,
	}
})

router.get('/export/record', async (ctx) => {
	ctx.body = await fs.readFileAsync(`${__dirname}/../echo_record.json`)
})


module.exports = {
	router, register_schedule, removeOvertimeRecord,
}
