CREATE TABLE `echo_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imei` varchar(16) NOT NULL DEFAULT '' COMMENT '设备的imei号',
  `timestamp` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;