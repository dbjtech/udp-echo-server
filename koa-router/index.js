const Router = require('koa-router')
const ajv = require('ajv')({ useDefaults: true })
const _ = require('lodash')
const moment = require('moment')

const { lowdb } = require('../service')


const router = new Router()

const schema = {
	properties: {
		imei: { type: 'array', minItems: 1, items: { type: 'string' } },
	},
	required: ['imei'],
}

const validate = ajv.compile(schema)

router.get('/get/echo/time', (ctx) => {
	const data = _.mapKeys(ctx.query, (v, k) => _.camelCase(k))
	const valid = validate(data)
	if (!valid) {
		ctx.body = {
			status: 400,
			message: 'paramter error',
		}
		return
	}
	console.log('data', data)
	const dataList = _.map(data.imei, v => lowdb.get('echo_records').cloneDeep().find({ imei: v }).value())
	console.log('dataList1', dataList)
	_.forEach(dataList, (imei) => {
		if (imei) {
			console.log(imei.timesamp)
			imei.timesamp = moment(imei.timesamp * 1000).format('YYYY-MM-DD HH:mm:ss')
		}
	})
	ctx.body = {
		status: 200,
		message: 'success',
		data: dataList,
	}
})

module.exports = {
	router,
}
