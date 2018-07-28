module.exports = {
	web: {
		port: 6689,
	},
	mysql: {
		host: 'localhost',
		port: 3306,
		user: 'root',
		password: 'root',
		database: 'parking',
	},
	message_ignore: [
		'Keepalived agent udp check string(digest=52921), ignore it!',
		'Healthcheck udp check',
	],
	hack_console: {
		open: true,
		options: {
			now: {
				defaultFormat: 'YYMMDD HH:mm:ss.SSS ZZ',
				interval: 100,
			},
			print: {
				interval: 1000,
			},
		},
	},
}
