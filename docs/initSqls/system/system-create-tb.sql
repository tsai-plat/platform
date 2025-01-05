
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary key ID',
  `orgid` bigint(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '0' COMMENT 'orgid',
  `userno` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'userno',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Username',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'phone number',
  `email` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'email address',
  `password` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'password',
  `nickname` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'user nickname',
  `avatar` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'user avatar image',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT 'status,0-unavailable,1-new registed,2-available',
  `is_super` tinyint(4) NULL DEFAULT 0 COMMENT 'super admin flag',
  `platform` int(11) NULL DEFAULT 0 COMMENT 'platform,0-guest,999-system,2-merchant,3-farmer',
  `openid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'Wx Openid',
  `unionid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'Wechat Unionid',
  `remark` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'remark',
  `created_by` int(11) NULL DEFAULT 0 COMMENT 'record created by',
  `updated_by` int(11) NULL DEFAULT 0 COMMENT 'record updated by',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT 'record create time',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT 'record last update time',
  `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT 'Logic delete sign',  
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_9eb567987fcdcd2070e7644239`(`userno`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '系统用户主表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sys_organization
-- ----------------------------
CREATE TABLE `sys_organization` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary key ID',
  `pid` int(11) DEFAULT '0' COMMENT 'parent id',
  `name` varchar(255) NOT NULL COMMENT 'org name',
  `code` varchar(255) DEFAULT NULL COMMENT 'org code',
  `short_name` varchar(255) DEFAULT NULL COMMENT 'short name',
  `icon` varchar(255) DEFAULT NULL COMMENT 'organization icon',
  `description` varchar(255) DEFAULT NULL COMMENT 'description',
  `sortno` int(11) NOT NULL DEFAULT '1' COMMENT 'sort no',
  `level` int(11) NOT NULL DEFAULT '1' COMMENT 'sort no',
  `status` tinyint(4) DEFAULT '1' COMMENT 'status:0-unavailable,1-available',
  `locking` tinyint(4) DEFAULT '0' COMMENT 'Is locked for deleted',
  `created_by` int(11) DEFAULT '0' COMMENT 'record created by',
  `updated_by` int(11) DEFAULT '0' COMMENT 'record updated by',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT 'record create time',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT 'record last update time',
  `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT 'Logic delete sign',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for sys_region
-- --------------------------------------------------------
CREATE TABLE `sys_region` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary key ID',
  `pid` bigint(20) NOT NULL COMMENT 'region parent id',
  `name` varchar(128) NOT NULL COMMENT 'Region name',
  `code` varchar(20) DEFAULT NULL COMMENT 'Region code',
  `value` varchar(20) DEFAULT NULL COMMENT 'Region value',
  `extra` longtext COMMENT 'Region extra record',
  `status` tinyint(4) DEFAULT '1' COMMENT 'Region status',
  `tag` varchar(20) DEFAULT NULL COMMENT 'Region tag',
  `sortno` bigint(20) DEFAULT '0' COMMENT 'region sortno',
  `remark` varchar(255) DEFAULT NULL COMMENT 'Region remark',
  `created_by` int(11) DEFAULT '0' COMMENT 'record created by',
  `updated_by` int(11) DEFAULT '0' COMMENT 'record updated by',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT 'record create time',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT 'record last update time',
  `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT 'Logic delete sign',  
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COMMENT='system region table';

-- --------------------------------------------------------
-- Table structure for sys_role
-- --------------------------------------------------------
CREATE TABLE `sys_resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Resource Id',
  `resource_no` varchar(150) NOT NULL COMMENT 'Logic Unique Key',
  `module_name` varchar(100) NOT NULL COMMENT 'Module name',
  `controller_name` varchar(100) NOT NULL COMMENT 'Controller name',
  `controller_route` varchar(100) NOT NULL COMMENT 'Controller base url',
  `method_name` varchar(100) NOT NULL COMMENT 'Method name',
  `method` varchar(10) NOT NULL COMMENT 'Controller Function Request Method',
  `url` varchar(200) NOT NULL COMMENT 'Url',
  `method_desc` varchar(200) DEFAULT NULL COMMENT 'Controller Function Description',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT 'Created Time',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT 'Update time',
  PRIMARY KEY (`id`),
  KEY `IDX_ce79f3a9f66167b73bce417650` (`resource_no`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for sys_access premission groups
-- --------------------------------------------------------

CREATE TABLE `sys_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary key ID',
  `pid` int(11) DEFAULT '0' COMMENT 'parent id',
  `name` varchar(255) NOT NULL COMMENT 'Function name',
  `title` varchar(255) NOT NULL COMMENT 'Function title',
  `i18n` varchar(255) DEFAULT NULL COMMENT 'Function i18n key',
  `icon` varchar(255) DEFAULT NULL COMMENT 'Function icon name',
  `type` varchar(255) DEFAULT 'MODULE' COMMENT 'Function type:MENU,MODULE,BUTTON',
  `authcode` varchar(255) DEFAULT NULL COMMENT 'Function auth code ,recommend xxx:xxx',
  `resource_no` varchar(200) DEFAULT NULL COMMENT 'Logic Unique Key',
  `status` tinyint(4) DEFAULT '1' COMMENT 'status:0-unavailable,1-available',
  `level` int(11) NOT NULL DEFAULT '1' COMMENT 'node level',
  `sortno` int(11) NOT NULL DEFAULT '1' COMMENT 'sort no',
  `remark` varchar(255) DEFAULT NULL COMMENT 'description',
  `created_by` int(11) DEFAULT '0' COMMENT 'record created by',
  `updated_by` int(11) DEFAULT '0' COMMENT 'record updated by',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT 'record create time',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT 'record last update time',
  `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT 'Logic delete sign',  
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for sys_access premission groups
-- --------------------------------------------------------
CREATE TABLE `sys_access` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary key ID',
  `name` varchar(50) NOT NULL COMMENT 'access name',
  `description` varchar(100) DEFAULT NULL COMMENT 'access Description',
  `status` tinyint(4) DEFAULT '1' COMMENT 'access status:0-unavailable,1-available',
  `is_default` tinyint(4) DEFAULT '0' COMMENT 'Is default role for registered,0-not,1-yes',
  `created_by` int(11) DEFAULT '0' COMMENT 'record created by',
  `updated_by` int(11) DEFAULT '0' COMMENT 'record updated by',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT 'record create time',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT 'record last update time',
  `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT 'Logic delete sign',  
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_223de54d6badbe43a5490450c3` (`name`),
  UNIQUE KEY `name_deleted` (`name`,`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for sys_role
-- --------------------------------------------------------
CREATE TABLE `sys_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary key ID',
  `name` varchar(50) NOT NULL COMMENT 'Role name',
  `description` varchar(100) DEFAULT NULL COMMENT 'Role Description',
  `status` tinyint(4) DEFAULT '1' COMMENT 'Role status:0-unavailable,1-available',
  `is_default` tinyint(4) DEFAULT '0' COMMENT 'Is default role for registered,0-not,1-yes',
  `created_by` int(11) DEFAULT '0' COMMENT 'record created by',
  `updated_by` int(11) DEFAULT '0' COMMENT 'record updated by',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT 'record create time',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT 'record last update time',
  `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT 'Logic delete sign',  
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_223de54d6badbe43a5490450c3` (`name`),
  UNIQUE KEY `name_deleted` (`name`,`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for sys_user_role
-- --------------------------------------------------------
CREATE TABLE `sys_user_role` (
  `uid` bigint(20) NOT NULL COMMENT 'User ID',
  `role_id` bigint(20) NOT NULL COMMENT 'Role ID',
  UNIQUE KEY `user_role_key` (`uid`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for sys_role_access
-- --------------------------------------------------------
CREATE TABLE `sys_role_access` (
  `role_id` bigint(20) NOT NULL COMMENT 'Role ID',
  `access_id` bigint(20) NOT NULL COMMENT 'Access ID',
  UNIQUE KEY `role_access_key` (`role_id`,`access_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for sys_role
-- --------------------------------------------------------
CREATE TABLE `sys_configuration` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary key ID',
  `config_key` varchar(255) NOT NULL COMMENT 'Configuration Key',
  `version` varchar(255) DEFAULT NULL COMMENT 'Configuration Version',
  `options` longtext COMMENT 'Config Options JSON',
  `status` tinyint(4) DEFAULT '1' COMMENT 'Config status:0-unavailable,1-available',
  `parser` varchar(255) DEFAULT NULL COMMENT 'Config parser',
  `remark` varchar(255) DEFAULT NULL COMMENT 'System Config remark',
  `created_by` int(11) DEFAULT '0' COMMENT 'record created by',
  `updated_by` int(11) DEFAULT '0' COMMENT 'record updated by',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT 'record create time',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT 'record last update time',
  `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT 'Logic delete sign',  
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for sys_role
-- --------------------------------------------------------
CREATE TABLE `sys_operation_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary key ID',
  `bizcode` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unset' COMMENT 'biz 业务模块标识',
  `biz` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'biz 业务描述',
  `action` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'action',
  `key` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'relation key',
  `input` longtext COLLATE utf8mb4_unicode_ci COMMENT '请求参数',
  `output` longtext COLLATE utf8mb4_unicode_ci COMMENT '正常或错误信息',
  `is_error` tinyint(4) DEFAULT '0' COMMENT 'Is error',
  `extra` longtext COLLATE utf8mb4_unicode_ci COMMENT '扩展JSON::upstream url',
  `options` longtext COLLATE utf8mb4_unicode_ci COMMENT '其他控制JSON,ip,ua,etd.',
  `result` longtext COLLATE utf8mb4_unicode_ci COMMENT 'Biz result any stringify',
  `locking` tinyint(4) DEFAULT '0' COMMENT 'Is locked for deleted',
  `remark` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'remark',
  `operator` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'operate username',
  `created_by` int(11) DEFAULT '0' COMMENT 'record created by',
  `updated_by` int(11) DEFAULT '0' COMMENT 'record updated by',
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT 'record create time',
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT 'record last update time',
  `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT 'Logic delete sign',
  PRIMARY KEY (`id`),
  KEY `IDX_0aa60f90ea4787293717d8b695` (`bizcode`),
  KEY `IDX_0cae72d8ddda96eae799da1e27` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统操作日志';
