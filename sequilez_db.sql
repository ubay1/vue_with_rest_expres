/*
 Navicat Premium Data Transfer

 Source Server         : localhost_mysql
 Source Server Type    : MySQL
 Source Server Version : 100408
 Source Host           : localhost:3306
 Source Schema         : sequilez_db

 Target Server Type    : MySQL
 Target Server Version : 100408
 File Encoding         : 65001

 Date: 07/12/2019 16:33:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `price` int(20) NULL DEFAULT NULL,
  `created_at` datetime(0) NULL DEFAULT NULL,
  `updated_at` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of products
-- ----------------------------
INSERT INTO `products` VALUES (16, 'obeng kembang', 42000, '2019-11-06 16:44:40', '2019-11-06 23:19:02');
INSERT INTO `products` VALUES (25, 'ring baut', 5000, '2019-11-06 22:43:57', '2019-11-07 08:25:49');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `email` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `password` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `created_at` datetime(0) NULL DEFAULT NULL,
  `updated_at` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (2, 'zaki', 'zaki@gmail.com', '$2a$10$fhj/C/.VJanNoqoEV0e/yubW8tAv7jjJOdlMn0duJxNeCuyPiFI/C', '2019-11-05 22:16:40', '2019-11-05 22:16:40');
INSERT INTO `users` VALUES (9, 'ubay', 'ubay@gmail.com', '$2a$10$OLiAWeBALayCHHMe8nDW1.OL7WM2c2y6YmdS/dfJQNGqdKa947hpy', '2019-12-07 08:57:13', '2019-12-07 08:57:13');
INSERT INTO `users` VALUES (10, 'ayas', 'ayas@gmail.com', '$2a$10$5YShC0EGZAeKx4gxMHh/9eNkrLmpq/Y4afjYXxEXnpOWUnuKM5W5G', '2019-12-07 08:58:59', '2019-12-07 08:58:59');

SET FOREIGN_KEY_CHECKS = 1;
