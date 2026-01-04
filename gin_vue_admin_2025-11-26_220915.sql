-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: gin_vue_admin
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL COMMENT '轮播图标题',
  `image` varchar(255) NOT NULL COMMENT '轮播图图片 URL',
  `product_id` int DEFAULT NULL COMMENT '关联商品ID',
  `sort` int DEFAULT '0' COMMENT '排序，越大越靠前',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;

--
-- Table structure for table `carousel`
--

DROP TABLE IF EXISTS `carousel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carousel` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '轮播图ID（自增主键）',
  `image_url` varchar(255) NOT NULL COMMENT '轮播图图片地址（存储图片的URL路径）',
  `product_id` int NOT NULL COMMENT '关联的商品ID（对应商品表的主键）',
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='轮播图表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carousel`
--

/*!40000 ALTER TABLE `carousel` DISABLE KEYS */;
INSERT INTO `carousel` VALUES (8,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/carousel/1764008262347_%E5%BC%80%E5%AD%A6%E5%AD%A3%E4%BF%83%E9%94%80%E6%89%8B%E7%BB%98%E9%A3%8E%E6%A8%AA%E7%89%88%E6%B5%B7%E6%8A%A5__2025-11-19%2B16_41_54.jpg',0);
/*!40000 ALTER TABLE `carousel` ENABLE KEYS */;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `openid` varchar(64) NOT NULL COMMENT '微信用户openid',
  `sku_id` int NOT NULL COMMENT 'SKU ID',
  `quantity` int NOT NULL DEFAULT '1' COMMENT '数量',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid_sku` (`openid`,`sku_id`),
  KEY `idx_openid` (`openid`),
  KEY `idx_sku_id` (`sku_id`),
  CONSTRAINT `fk_cart_sku` FOREIGN KEY (`sku_id`) REFERENCES `product_skus` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='购物车明细表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (67,'o7Alw10wKvtq-bmH3ErbRa1-0CIQ',1261,3,'2025-11-26 12:48:21','2025-11-26 12:48:29');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` varchar(100) NOT NULL COMMENT '分类名称',
  `parent_id` int DEFAULT '0' COMMENT '父分类ID',
  `description` varchar(255) DEFAULT NULL COMMENT '分类描述',
  `sort_order` int DEFAULT '0' COMMENT '排序顺序',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='商品分类表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'篮球培训',0,'系统学习运球、传球、投篮、防守等基本技术，并融入简单的战术理解和团队配合练习，通过游戏和对抗赛提升球感和实战能力。',1,'2025-11-11 14:33:50','2025-11-18 13:52:21'),(2,'足球培训',0,'侧重于球感、传接球、射门等基础技术训练，并介绍足球比赛基本规则。通过分组游戏和模拟比赛场景，培养球员的团队协作意识和足球兴趣。',2,'2025-11-11 14:33:50','2025-11-18 12:20:16'),(3,'排球培训',0,'学习垫球、传球、发球等排球基本动作要领，并进行步伐移动和简单战术配合练习。课程注重基础技能培养，感受排球运动的团队魅力。',3,'2025-11-11 14:33:50','2025-11-18 12:21:08'),(4,'体适能训练',0,'针对中考体育项目，进行心肺耐力、肌肉力量、爆发力、柔韧性和协调性等综合体能训练。课程旨在科学提升身体素质，掌握正确的运动方法。',4,'2025-11-11 14:33:50','2025-11-24 11:28:22'),(6,'跳绳培训',0,'从单摇、并脚跳等基础动作学起，逐步过渡到花样跳绳及速度跳绳。有效提升身体协调性、节奏感和心肺功能。',5,'2025-11-18 11:41:01','2025-11-18 12:41:59'),(7,'羽毛球培训',0,'掌握正确的握拍、挥拍步伐，学习高远球、吊球、网前球等基本击球技术，并了解单打、双打的基本规则和简单战术。',6,'2025-11-18 11:42:10','2025-11-18 12:25:46'),(8,'乒乓球培训',0,'进行握拍法、基本步法、发球、接发球、推挡、攻球等基础技术训练，并通过多球练习和实战提升反应速度和手眼协调能力。',7,'2025-11-18 11:44:01','2025-11-18 17:42:58'),(10,'硬笔书法培训',9,'学习正确的坐姿和执笔方法，训练基本笔画的书写技巧，掌握汉字的结构规律，培养良好的书写习惯，提升书写的美观与工整度。',8,'2025-11-18 11:47:14','2025-11-24 11:28:43'),(11,'软笔书法培训',9,'了解文房四宝的使用，从执笔、运笔开始，练习中锋、侧锋等基本笔法，临摹经典碑帖，初步感受笔墨变化，培养专注力和审美能力。',9,'2025-11-18 11:48:03','2025-11-24 11:28:56'),(12,'美术培训',0,'简笔画部分学习用简单的线条概括物体形状；素描基础则从观察方法、构图、透视和明暗关系入手，训练基本的造型能力。',10,'2025-11-18 11:49:18','2025-11-24 11:29:07'),(13,'中学生声乐培训',0,'学习科学的呼吸方法和发声技巧，进行音准、节奏训练，演唱适合青少年年龄特点的中外歌曲，培养音乐表现力和自信心。',11,'2025-11-18 12:32:02','2025-11-18 12:32:11');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;

--
-- Table structure for table `daily_recommendations`
--

DROP TABLE IF EXISTS `daily_recommendations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `daily_recommendations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `position` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `position` (`position`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_recommendations`
--

/*!40000 ALTER TABLE `daily_recommendations` DISABLE KEYS */;
/*!40000 ALTER TABLE `daily_recommendations` ENABLE KEYS */;

--
-- Table structure for table `dish_ingredients`
--

DROP TABLE IF EXISTS `dish_ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dish_ingredients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dish_id` int NOT NULL,
  `ingredient_id` int NOT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT '0.00',
  `amount` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `dish_id` (`dish_id`),
  KEY `ingredient_id` (`ingredient_id`),
  CONSTRAINT `dish_ingredients_ibfk_1` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `dish_ingredients_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dish_ingredients`
--

/*!40000 ALTER TABLE `dish_ingredients` DISABLE KEYS */;
INSERT INTO `dish_ingredients` VALUES (10,7,41,0.00,9),(11,7,52,0.00,0.1),(12,7,51,0.00,0.1),(16,9,67,0.00,0.5),(17,10,68,0.00,0.5),(18,10,70,0.00,0.4),(19,10,71,0.00,0.1),(20,10,72,0.00,0.05),(21,10,77,0.00,0.05),(37,8,64,0.00,0.5),(38,8,65,0.00,0.07),(39,8,66,0.00,0.2),(52,15,252,0.00,1),(53,15,400,0.00,0.1),(54,15,51,0.00,0.1),(55,15,52,0.00,0.1),(56,15,255,0.00,0.1),(57,15,258,0.00,0.02),(59,16,377,0.00,0.1),(60,16,378,0.00,0.55),(61,16,379,0.00,0.02),(62,16,380,0.00,0.05),(63,16,381,0.00,0.65),(64,16,382,0.00,0.2),(65,16,383,0.00,0.02),(84,14,250,0.00,0.5),(85,14,69,0.00,0.3),(86,18,389,0.00,0.3),(87,18,390,0.00,0.1),(88,18,391,0.00,0.3),(89,18,392,0.00,0.4),(90,18,393,0.00,0.2),(91,18,394,0.00,0.1),(92,19,536,0.00,9),(93,19,396,0.00,0.1),(94,19,66,0.00,0.3),(95,20,397,0.00,0.8),(96,20,65,0.00,0.1),(97,20,66,0.00,0.4),(98,20,379,0.00,0.05),(116,24,641,0.00,2),(117,24,642,0.00,1),(118,24,643,0.00,0.025),(119,24,644,0.00,0.05),(122,26,647,0.00,0.5),(123,26,648,0.00,0.03),(124,26,72,0.00,0.05),(125,27,649,0.00,0.3),(129,31,653,0.00,0.3),(130,30,652,0.00,1.2),(134,11,73,0.00,0.5),(135,11,74,0.00,0.1),(136,11,76,0.00,0.2),(137,11,71,0.00,0.1),(138,11,819,0.00,0.1),(139,11,394,0.00,0.1),(140,34,822,0.00,0.1),(141,34,821,0.00,9),(142,34,824,0.00,0.1),(143,34,385,0.00,0.1),(147,36,536,0.00,1),(148,36,378,0.00,1),(149,36,258,0.00,1),(150,17,384,0.00,1.2),(151,17,385,0.00,0.05),(152,17,387,0.00,0.03),(153,17,69,0.00,0.3),(161,22,402,0.00,1),(162,22,403,0.00,0.2),(163,22,404,0.00,0.7),(164,22,394,0.00,0.15),(165,22,406,0.00,0.03),(166,23,407,0.00,1.7),(167,23,666,0.00,0.1),(168,25,646,0.00,2.1),(169,35,536,0.00,9),(170,21,399,0.00,1.7),(171,21,400,0.00,0.1),(172,21,401,0.00,0.01),(173,5,23,0.00,1.3),(174,5,26,0.00,0.35),(175,5,29,0.00,0.01),(176,5,32,0.00,0.011);
/*!40000 ALTER TABLE `dish_ingredients` ENABLE KEYS */;

--
-- Table structure for table `dishes`
--

DROP TABLE IF EXISTS `dishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dishes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dishes`
--

/*!40000 ALTER TABLE `dishes` DISABLE KEYS */;
INSERT INTO `dishes` VALUES (5,'家常千子',NULL),(7,'盐水大虾（流动）',NULL),(8,'橙汁木瓜',NULL),(9,'枣栗子',NULL),(10,'凉拌猪耳朵',NULL),(11,'孜然鸡胗',NULL),(14,'酱肉',NULL),(15,'肘子',NULL),(16,'腰果虾仁',NULL),(17,'大四喜丸子',NULL),(18,'三样',NULL),(19,'油焖大虾',NULL),(20,'锅包肉',NULL),(21,'红烧排骨',NULL),(22,'爆炒鱿鱼',NULL),(23,'白条鸡',NULL),(24,'鲤鱼',NULL),(25,'大块肉',NULL),(26,'丸子汤',NULL),(27,'红杯子',NULL),(30,'好台布',NULL),(31,'红布',NULL),(34,'椒盐翅中',NULL),(35,'红烧大虾',NULL),(36,'红烧肉',NULL);
/*!40000 ALTER TABLE `dishes` ENABLE KEYS */;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `content` varchar(500) NOT NULL COMMENT '用户反馈内容',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (9,'定位功能很准，昨天猫咪跑到楼下花园也能及时看到轨迹，太实用了！','2025-11-25 14:40:18'),(10,'希望增加一个“电子围栏”范围更精细的模式，现在的圆形范围控制不太精准。','2025-11-25 14:40:18'),(11,'夜间灯光很好用，带猫咪散步的时候特别安全。','2025-11-25 14:40:18'),(12,'电池续航不错，平时能用一周，就是充电口有点紧。','2025-11-25 14:40:18'),(13,'建议增加宠物心率异常的即时推送，我家猫最近生病错过了第一时间。','2025-11-25 14:40:18'),(14,'希望能支持多宠物统一查看，现在两个智能环要切换页面稍微麻烦。','2025-11-25 14:40:18'),(15,'材质很柔软，佩戴没有抗拒，就是颜色可以再多几种。','2025-11-25 14:40:18'),(16,'活动量统计很准确，能明显看到猫咪每天什么时候最活跃。','2025-11-25 14:40:18'),(17,'希望增加一个“喂食提醒”功能，和智能喂食器联动就更好了。','2025-11-25 14:40:18'),(18,'外观很漂亮，小狗戴着像小手表一样，很酷！','2025-11-25 14:40:18'),(19,'震动提醒有点轻，如果能调节强度就更好了。','2025-11-25 14:40:18'),(20,'历史轨迹查看很方便，希望能提供一键导出功能。','2025-11-25 14:40:18'),(21,'App 的界面很简洁，但是数据刷新速度希望再快一点。','2025-11-25 14:40:18'),(22,'智能环重量很轻，小猫咪戴着没有不适应，很棒。','2025-11-25 14:40:18'),(23,'希望加一个“丢失模式”，丢失后可以自动增强定位频率。','2025-11-25 14:40:18'),(24,'如果能搭配 NFC 标签功能就好了，可以让别人扫一下就能联系到我。','2025-11-25 14:40:18'),(25,'防水性很强，昨天洗澡忘了拆下来也没坏，安心。','2025-11-25 14:40:18'),(26,'天气太冷时提示温度偏低的功能很好，很贴心。','2025-11-25 14:40:18'),(27,'这是一条新的记录','2025-11-25 14:45:54'),(28,'可以','2025-11-26 06:04:17');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;

--
-- Table structure for table `ingredients`
--

DROP TABLE IF EXISTS `ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `unit` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `per_table_ratio` decimal(10,2) DEFAULT NULL,
  `is_per_table` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_ingredients_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1834 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients`
--

/*!40000 ALTER TABLE `ingredients` DISABLE KEYS */;
INSERT INTO `ingredients` VALUES (11,'盐','调料','袋',3.00,1),(23,'粉格子','其他','个',13.00,0),(26,'千子馅','肉','斤',3.50,0),(29,'千子袋','其他','个',0.01,1),(32,'花边纸','其他','袋',0.20,0),(41,'大虾30-40（流动席）','冻货','个',90.00,0),(51,'花椒','调料','袋',1.00,1),(52,'大料','调料','袋',1.00,1),(64,'木瓜','蔬菜','个',5.00,0),(65,'橙汁','调料','个',0.50,0),(66,'白糖','调料','斤',4.00,0),(67,'枣栗子','调料','瓶',5.00,0),(68,'猪肉耳朵','肉','斤',5.00,0),(69,'生菜','蔬菜','斤',3.00,0),(70,'白黄瓜','蔬菜','斤',4.00,0),(71,'辣椒段','调料','袋',0.50,0),(72,'香油','调料','瓶',0.50,1),(73,'鸡胗','肉','斤',5.00,0),(74,'孜然','调料','袋',0.30,0),(76,'香辣酥','调料','袋',2.00,0),(77,'白醋','调料','瓶',0.50,0),(102,'伞','其他','个',10.00,0),(236,'熟鸡胗','肉','斤',5.00,0),(250,'酱肉','熟食','斤',5.00,0),(252,'肘子','肉','个',10.00,0),(255,'肉料','调料','袋',1.00,1),(256,'葱','调料','个',6.00,0),(257,'蒜米','调料','斤',10.00,1),(258,'一品红烧','调料','瓶',0.65,1),(377,'腰果','调料','斤',1.00,0),(378,'40-50干虾仁','冻货','斤',5.50,0),(379,'生粉','调料','斤',0.30,0),(380,'鸡汁','调料','瓶',0.50,0),(381,'黑黄瓜','蔬菜','斤',6.50,0),(382,'胡萝卜','蔬菜','斤',2.00,0),(383,'耗油','调料','桶',0.50,1),(384,'大四喜丸子','冻货','斤',12.00,0),(385,'玉米淀粉','调料','斤',0.10,0),(386,'东古一品鲜','调料','瓶',0.50,1),(387,'凤球唛鸡粉','调料','桶',0.30,0),(389,'大肠','熟食','斤',3.00,0),(390,'肚','调料','斤',1.00,0),(391,'肝片','肉','斤',3.00,0),(392,'白洋葱','蔬菜','斤',4.00,0),(393,'尖椒','蔬菜','斤',2.00,0),(394,'红尖椒','蔬菜','斤',1.50,0),(396,'凤球唛番茄酱','调料','桶',1.00,0),(397,'锅包肉','冻货','袋',8.00,0),(399,'排骨','肉','斤',17.00,0),(400,'姜','蔬菜','斤',1.00,0),(401,'高压锅','其他','个',0.75,0),(402,'鱿鱼','冻货','斤',10.00,0),(403,'去皮鸟蛋','其他','斤',2.00,0),(404,'芹菜','蔬菜','斤',7.00,0),(406,'大美极','调料','瓶',0.30,0),(407,'白条鸡','肉','斤',17.00,0),(536,'30-40大虾（流动席）','冻货','个',90.00,0),(640,'十三香','调料','盒',1.00,1),(641,'鲤鱼','鱼','斤',20.00,0),(642,'鱼网子','其他','个',10.00,0),(643,'小脸','其他','个',0.02,0),(644,'料酒','调料','桶',0.50,0),(645,'油','调料','桶',0.65,1),(646,'五花肉','肉','斤',14.00,0),(647,'丸子馅','肉','斤',5.00,0),(648,'香菜','蔬菜','斤',0.20,0),(649,'红杯子','其他','袋',3.00,0),(650,'筷子','其他','把',14.00,1),(651,'纸','其他','袋',1.00,1),(652,'好台布','其他','个',12.00,0),(653,'红布','其他','个',3.00,0),(654,'大米','其他','斤',18.00,1),(655,'花豆','其他','个',0.30,0),(666,'香蘑','调料','袋',0.30,0),(742,'味精（大袋）','调料','袋',0.50,1),(819,'孜然粉','调料','袋',1.00,0),(820,'紫洋葱','蔬菜','斤',1.00,0),(821,'翅中','调料','个',90.00,0),(822,'椒盐','调料','瓶',2.00,0),(824,'奥尔良料','调料','袋',0.03,0),(825,'牛肉卷','肉','斤',10.00,0),(826,'西红柿','蔬菜','个',10.00,0),(827,'胡椒粉','调料','斤',0.10,0),(828,'碎猪爪','肉','斤',10.00,0),(829,'蹄筋','肉','斤',3.00,0),(830,'青椒','蔬菜','斤',1.50,0),(832,'大葱','蔬菜','斤',1.00,0),(834,'荷叶饼','冻货','个',90.00,0),(835,'面酱','调料','袋',1.00,0),(836,'南乳汁','调料','瓶',0.30,0),(1829,'高压锅（中）','其他','个',0.07,0),(1832,'高压锅（大）','其他','个',0.75,0);
/*!40000 ALTER TABLE `ingredients` ENABLE KEYS */;

--
-- Table structure for table `law_articles`
--

DROP TABLE IF EXISTS `law_articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `law_articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT '法条标题',
  `content` text NOT NULL COMMENT '法条内容',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='法律知识库法条表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `law_articles`
--

/*!40000 ALTER TABLE `law_articles` DISABLE KEYS */;
INSERT INTO `law_articles` VALUES (1,'测试1','内容abc\n','2025-11-07 07:18:05'),(2,'《民法典》第一百一十三条','民事主体依法享有财产所有权、使用权、收益权和处分权。任何组织或者个人不得侵犯。','2025-11-07 07:18:29'),(3,'《民法典》第三百条','物权的设立、变更、转让和消灭，应当依照法律规定登记；未经登记，不得对抗善意第三人。','2025-11-07 07:18:29'),(4,'《劳动法》第四十二条','劳动者在合同期内因工伤、病假、孕期等情况，用人单位不得解除劳动合同。','2025-11-07 07:18:29'),(5,'《消费者权益保护法》第八条','消费者享有知悉其购买、使用的商品或者接受的服务的真实情况的权利。','2025-11-07 07:18:29'),(6,'《合同法》第六十条','当事人应当按照约定全面履行自己的义务，并遵循诚实信用原则。','2025-11-07 07:18:29'),(7,'《刑法》第二百六十四条','盗窃公私财物，数额较大或者多次盗窃的，处三年以下有期徒刑、拘役或者管制，并处或者单处罚金。','2025-11-07 07:18:29'),(8,'《刑法》第二百三十二条','故意杀人的，处死刑、无期徒刑或者十年以上有期徒刑；情节较轻的，处三年以上十年以下有期徒刑。','2025-11-07 07:18:29'),(9,'《婚姻法》第四条','夫妻应当互相忠实，互相尊重；家庭成员间应当敬老爱幼，互助和睦。','2025-11-07 07:18:29'),(10,'《著作权法》第十一条','著作权属于作者，本法另有规定的除外。','2025-11-07 07:18:29'),(11,'《环境保护法》第三条','国家实行有计划地保护环境与自然资源，防治污染和其他公害，改善环境质量。','2025-11-07 07:18:29');
/*!40000 ALTER TABLE `law_articles` ENABLE KEYS */;

--
-- Table structure for table `law_blogs`
--

DROP TABLE IF EXISTS `law_blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `law_blogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT '文章标题',
  `content` text NOT NULL COMMENT '文章内容',
  `author` varchar(100) DEFAULT '管理员' COMMENT '作者',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='法律博客文章表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `law_blogs`
--

/*!40000 ALTER TABLE `law_blogs` DISABLE KEYS */;
INSERT INTO `law_blogs` VALUES (1,'公司法修订的关键变化解读','2025年新版《公司法》正式实施，本次修订是近年来公司法体系中最为重要的一次改革，对公司治理结构、股东权利、企业合规等方面作出了深远调整。','系统管理员','2025-11-07 07:23:44'),(2,'劳动仲裁常见问题汇总','劳动仲裁是解决劳动争议的重要法律途径。随着劳动关系日趋复杂，许多员工与企业在劳动合同、薪酬、加班等问题上发生纠纷。本文汇总了一些常见的劳动仲裁问题，帮助您更好地维护合法权益。','智能法律顾问 AI','2025-11-07 07:23:44'),(3,'人工智能与法律行业的未来','AI技术正在快速改变法律服务行业。智能文书生成、合同审查、法律预测等应用正逐步普及。','AI 法律观察员','2025-11-07 07:23:44'),(4,'测试1','测试','管理员','2025-11-07 07:24:02');
/*!40000 ALTER TABLE `law_blogs` ENABLE KEYS */;

--
-- Table structure for table `law_users`
--

DROP TABLE IF EXISTS `law_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `law_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('user','admin','super') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `law_users`
--

/*!40000 ALTER TABLE `law_users` DISABLE KEYS */;
INSERT INTO `law_users` VALUES (1,'user','123','user'),(2,'admin','123','admin'),(3,'super','123','super');
/*!40000 ALTER TABLE `law_users` ENABLE KEYS */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `order_no` varchar(64) NOT NULL COMMENT '业务订单号',
  `user_id` varchar(64) NOT NULL COMMENT '用户ID（openid 或系统用户ID）',
  `user_name` varchar(50) NOT NULL COMMENT '用户姓名',
  `id_card_no` varchar(32) NOT NULL COMMENT '身份证号',
  `student_school` varchar(100) DEFAULT NULL COMMENT '就读学校',
  `student_grade` varchar(50) DEFAULT NULL COMMENT '就读年级',
  `mobile` varchar(20) DEFAULT NULL COMMENT '手机号',
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '订单总金额',
  `pay_amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '实付金额',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '订单状态 0待支付 1已支付 2退款中 3已退款',
  `wx_prepay_id` varchar(64) DEFAULT NULL COMMENT '微信预支付单号',
  `wx_transaction_id` varchar(64) DEFAULT NULL COMMENT '微信支付流水号',
  `refund_no` varchar(64) DEFAULT NULL COMMENT '系统退款单号',
  `wx_refund_id` varchar(64) DEFAULT NULL COMMENT '微信退款单号',
  `refund_amount` decimal(10,2) DEFAULT '0.00' COMMENT '退款金额',
  `refund_status` tinyint NOT NULL DEFAULT '0' COMMENT '退款状态 0无退款 1退款中 2退款成功 3退款失败',
  `refund_reason` varchar(255) DEFAULT NULL COMMENT '退款原因',
  `audit_status` tinyint NOT NULL DEFAULT '0' COMMENT '审核状态 0待审核 1审核通过 2审核拒绝',
  `audit_remark` varchar(255) DEFAULT NULL COMMENT '审核备注',
  `audit_by` int unsigned DEFAULT NULL COMMENT '审核人ID',
  `audit_time` datetime DEFAULT NULL COMMENT '审核时间',
  `receiver_name` varchar(50) DEFAULT NULL COMMENT '收货人姓名',
  `receiver_mobile` varchar(20) DEFAULT NULL COMMENT '收货人手机号',
  `receiver_address` varchar(255) DEFAULT NULL COMMENT '收货地址',
  `items_snapshot` text COMMENT '下单时SKU快照(JSON字符串)',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '订单创建时间',
  `pay_time` datetime DEFAULT NULL COMMENT '支付时间',
  `refund_time` datetime DEFAULT NULL COMMENT '退款完成时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='订单表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'ORD20251116645011','0','123','123',NULL,NULL,'123',0.00,0.00,0,NULL,NULL,NULL,NULL,0.00,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"product_id\":null,\"product_name\":null,\"sku_id\":0,\"sku_name\":\"\",\"price\":0,\"quantity\":1,\"image\":null}]','2025-11-16 20:54:05',NULL,NULL,'2025-11-16 20:54:05'),(2,'ORD20251119371996','0','尚锋','510703198204101334',NULL,NULL,'18011579593',0.00,0.00,0,NULL,NULL,NULL,NULL,0.00,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"product_id\":null,\"product_name\":null,\"sku_id\":0,\"sku_name\":\"\",\"price\":0,\"quantity\":1,\"image\":null}]','2025-11-19 13:32:51',NULL,NULL,'2025-11-19 13:32:51'),(3,'ORD20251122200491','0','123','123',NULL,NULL,'123',0.00,0.00,0,NULL,NULL,NULL,NULL,0.00,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"product_id\":null,\"product_name\":null,\"sku_id\":0,\"sku_name\":\"\",\"price\":0,\"quantity\":1,\"image\":null}]','2025-11-22 17:36:40',NULL,NULL,'2025-11-22 17:36:40'),(4,'ORD20251122281673','o7Alw10wKvtq-bmH3ErbRa1-0CIQ','123','123',NULL,NULL,'123',920.00,920.00,0,NULL,NULL,NULL,NULL,0.00,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"product_id\":14,\"sku_id\":356,\"name\":\"【2025年寒假】美术培训班（每班限额招生30人）【开课时长】20天*90分钟/天\",\"sku_name\":\"滨江小学/【开课时间】8:30-10:00/【报名年级】3年级至6年级/\",\"price\":\"920.00\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481600313_2.jpg\",\"attr1\":\"滨江小学\",\"attr2\":\"【开课时间】8:30-10:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-22 22:21:21',NULL,NULL,'2025-11-22 22:21:21'),(5,'ORD20251122846279','o7Alw10wKvtq-bmH3ErbRa1-0CIQ','123','123',NULL,NULL,'123',0.01,0.01,0,NULL,NULL,NULL,NULL,0.00,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"product_id\":14,\"sku_id\":496,\"name\":\"【2025年寒假】美术培训班（每班限额招生30人）【开课时长】20天*90分钟/天\",\"sku_name\":\"滨江小学/【开课时间】8:30-10:00/【报名年级】3年级至6年级/\",\"price\":\"0.01\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481600313_2.jpg\",\"attr1\":\"滨江小学\",\"attr2\":\"【开课时间】8:30-10:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-22 22:30:46',NULL,NULL,'2025-11-22 22:30:46'),(6,'ORD20251122541709','o7Alw10wKvtq-bmH3ErbRa1-0CIQ','123','123','123','123','123',0.01,0.01,0,NULL,NULL,NULL,NULL,0.00,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"product_id\":14,\"sku_id\":496,\"name\":\"【2025年寒假】美术培训班（每班限额招生30人）【开课时长】20天*90分钟/天\",\"sku_name\":\"滨江小学/【开课时间】8:30-10:00/【报名年级】3年级至6年级/\",\"price\":\"0.01\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481600313_2.jpg\",\"attr1\":\"滨江小学\",\"attr2\":\"【开课时间】8:30-10:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-22 23:15:41',NULL,NULL,'2025-11-22 23:15:41'),(7,'ORD20251122177124','o7Alw10wKvtq-bmH3ErbRa1-0CIQ','123','123123123123123123','123','123','12312312312',0.01,0.01,0,NULL,NULL,NULL,NULL,0.00,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"product_id\":14,\"sku_id\":496,\"name\":\"【2025年寒假】美术培训班（每班限额招生30人）【开课时长】20天*90分钟/天\",\"sku_name\":\"滨江小学/【开课时间】8:30-10:00/【报名年级】3年级至6年级/\",\"price\":\"0.01\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481600313_2.jpg\",\"attr1\":\"滨江小学\",\"attr2\":\"【开课时间】8:30-10:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-22 23:26:17',NULL,NULL,'2025-11-22 23:26:17'),(8,'ORD20251123471354','o7Alw10wKvtq-bmH3ErbRa1-0CIQ','123','123123123123123123','123','123','12312312312',0.01,0.01,3,NULL,'4200002892202511234407043129','RF202511242350589337',NULL,0.01,2,'12321312',1,'123123123',1,'2025-11-25 00:00:25',NULL,NULL,NULL,'[{\"product_id\":14,\"sku_id\":496,\"name\":\"【2025年寒假】美术培训班（每班限额招生30人）【开课时长】20天*90分钟/天\",\"sku_name\":\"滨江小学/【开课时间】8:30-10:00/【报名年级】3年级至6年级/\",\"price\":\"0.01\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481600313_2.jpg\",\"attr1\":\"滨江小学\",\"attr2\":\"【开课时间】8:30-10:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-23 00:37:51','2025-11-23 00:38:13','2025-11-25 00:00:25','2025-11-25 00:00:25'),(9,'ORD20251123793183','o7Alw10wKvtq-bmH3ErbRa1-0CIQ','123','123123123123123123','123','23','12312312312',0.01,0.01,3,NULL,'4200002889202511231169976789','RF202511242332147413',NULL,0.01,2,'123123',1,'11122',1,'2025-11-24 23:47:13',NULL,NULL,NULL,'[{\"product_id\":14,\"sku_id\":496,\"name\":\"【2025年寒假】美术培训班（每班限额招生30人）【开课时长】20天*90分钟/天\",\"sku_name\":\"滨江小学/【开课时间】8:30-10:00/【报名年级】3年级至6年级/\",\"price\":\"0.01\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481600313_2.jpg\",\"attr1\":\"滨江小学\",\"attr2\":\"【开课时间】8:30-10:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-23 12:06:33','2025-11-23 12:06:47','2025-11-24 23:47:13','2025-11-24 23:47:13'),(10,'ORD20251124698705','o7Alw14Z-T_sr4PJKJPcyq5qfVdI','尚锋','510703198204101334','123','四年级','18011579593',0.01,0.01,1,NULL,'4200002907202511240932027089',NULL,NULL,0.00,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"product_id\":14,\"sku_id\":934,\"name\":\"【2025年寒假】美术(简笔画、素描)培训班\",\"sku_name\":\"【培训地点】滨江小学/【开课时间】8:30至10:00/【报名年级】3年级至6年级/\",\"price\":\"0.01\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481600313_2.jpg\",\"attr1\":\"【培训地点】滨江小学\",\"attr2\":\"【开课时间】8:30至10:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-24 10:01:38','2025-11-24 10:01:47',NULL,'2025-11-24 10:01:47'),(11,'ORD20251124196085','o7Alw13fPlzoTPQLJSah3sKPFEIk','李阳','622621201901010020','滨江小学','一年级','18089390606',0.01,0.01,1,NULL,'4200002903202511249423008145',NULL,NULL,0.00,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"product_id\":14,\"sku_id\":934,\"name\":\"【2025年寒假】美术(简笔画、素描)培训班\",\"sku_name\":\"【培训地点】滨江小学/【开课时间】8:30至10:00/【报名年级】3年级至6年级/\",\"price\":\"0.01\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481600313_2.jpg\",\"attr1\":\"【培训地点】滨江小学\",\"attr2\":\"【开课时间】8:30至10:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-24 10:26:36','2025-11-24 10:26:53',NULL,'2025-11-24 10:26:53'),(12,'ORD20251124700861','o7Alw10wKvtq-bmH3ErbRa1-0CIQ','张若涵','320482200210087659','东南大学','大于','19802522633',0.01,0.01,3,NULL,'4200002913202511240092500727','RF202511242355325448',NULL,0.01,2,'退款退款退款',1,'13123123',1,'2025-11-24 23:56:00',NULL,NULL,NULL,'[{\"product_id\":14,\"sku_id\":1100,\"name\":\"【2025年寒假】美术(简笔画、素描)培训班\",\"sku_name\":\"【培训地点】滨江小学/【开课时间】8:30至10:00/【报名年级】3年级至6年级/\",\"price\":\"0.01\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481600313_2.jpg\",\"attr1\":\"【培训地点】滨江小学\",\"attr2\":\"【开课时间】8:30至10:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-24 23:55:00','2025-11-24 23:55:07','2025-11-24 23:56:00','2025-11-24 23:56:00'),(13,'ORD20251124970331','o7Alw10wKvtq-bmH3ErbRa1-0CIQ','123','123123123123123123','123','123','12312312312',0.01,0.01,3,NULL,'4200002898202511240751257134','RF202511242359549047',NULL,0.01,2,'不要啦不要啦',1,'123123123',1,'2025-11-25 00:00:14',NULL,NULL,NULL,'[{\"product_id\":14,\"sku_id\":1100,\"name\":\"【2025年寒假】美术(简笔画、素描)培训班\",\"sku_name\":\"【培训地点】滨江小学/【开课时间】8:30至10:00/【报名年级】3年级至6年级/\",\"price\":\"0.01\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481600313_2.jpg\",\"attr1\":\"【培训地点】滨江小学\",\"attr2\":\"【开课时间】8:30至10:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-24 23:59:30','2025-11-24 23:59:36','2025-11-25 00:00:14','2025-11-25 00:00:14'),(14,'ORD20251125104393','o7Alw10wKvtq-bmH3ErbRa1-0CIQ','123','123456789123456789','123','123','12312312312',0.03,0.03,3,NULL,'4200002848202511259471521110','RF202511250002066516',NULL,0.03,2,'不要脸的东西',1,'123123123',1,'2025-11-25 00:02:25',NULL,NULL,NULL,'[{\"product_id\":14,\"sku_id\":1100,\"name\":\"【2025年寒假】美术(简笔画、素描)培训班\",\"sku_name\":\"【培训地点】滨江小学/【开课时间】8:30至10:00/【报名年级】3年级至6年级/\",\"price\":\"0.01\",\"quantity\":3,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481600313_2.jpg\",\"attr1\":\"【培训地点】滨江小学\",\"attr2\":\"【开课时间】8:30至10:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-25 00:01:44','2025-11-25 00:01:50','2025-11-25 00:02:25','2025-11-25 00:02:25'),(15,'ORD20251125432543','o7Alw10wKvtq-bmH3ErbRa1-0CIQ','123','213123123123123123','123','123','12312312312',920.01,920.01,0,NULL,NULL,NULL,NULL,0.00,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"product_id\":14,\"sku_id\":1101,\"name\":\"【2025年寒假】美术(简笔画、素描)培训班\",\"sku_name\":\"【培训地点】滨江小学/【开课时间】10:10至11:40/【报名年级】3年级至6年级/\",\"price\":\"920.00\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481606207_3.jpg\",\"attr1\":\"【培训地点】滨江小学\",\"attr2\":\"【开课时间】10:10至11:40\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null},{\"product_id\":14,\"sku_id\":1100,\"name\":\"【2025年寒假】美术(简笔画、素描)培训班\",\"sku_name\":\"【培训地点】滨江小学/【开课时间】8:30至10:00/【报名年级】3年级至6年级/\",\"price\":\"0.01\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481600313_2.jpg\",\"attr1\":\"【培训地点】滨江小学\",\"attr2\":\"【开课时间】8:30至10:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-25 01:30:32',NULL,NULL,'2025-11-25 01:30:32'),(16,'ORD20251125678094','o7Alw14Z-T_sr4PJKJPcyq5qfVdI','尚锋','510703198204101334','滨江小学','四年级','13982911828',1440.00,1440.00,0,NULL,NULL,NULL,NULL,0.00,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"product_id\":15,\"sku_id\":1168,\"name\":\"【2025年寒假】中学生声乐培训班\",\"sku_name\":\"【培训地点】城关小学/【开课时间】14:30至16:00/【报名年级】7年级-9年级/\",\"price\":\"1440.00\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481909160_2.jpg\",\"attr1\":\"【培训地点】城关小学\",\"attr2\":\"【开课时间】14:30至16:00\",\"attr3\":\"【报名年级】7年级-9年级\",\"attr4\":null}]','2025-11-25 01:51:18',NULL,NULL,'2025-11-25 01:51:18'),(17,'ORD20251125860925','o7Alw1zm4dOITS6xEvPTn7TEX3e8','张三','622621198211232716','1','I','18993910088',0.01,0.01,0,NULL,NULL,NULL,NULL,0.00,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"product_id\":14,\"sku_id\":1100,\"name\":\"【2025年寒假】美术(简笔画、素描)培训班\",\"sku_name\":\"【培训地点】滨江小学/【开课时间】8:30至10:00/【报名年级】3年级至6年级/\",\"price\":\"0.01\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481600313_2.jpg\",\"attr1\":\"【培训地点】滨江小学\",\"attr2\":\"【开课时间】8:30至10:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-25 07:11:00',NULL,NULL,'2025-11-25 07:11:00'),(18,'ORD20251125495881','o7Alw10Q6m-6x_44KDju0I1uh9RI','王毅','622621199403280039','贡院','三年级','19993958285',0.01,0.01,3,NULL,'4200002888202511251543805099','RF202511251027308326',NULL,0.01,2,'时间冲突，',1,'课程未开始',1,'2025-11-25 10:29:12',NULL,NULL,NULL,'[{\"product_id\":14,\"sku_id\":1279,\"name\":\"【2025年寒假】美术(简笔画、素描)培训班\",\"sku_name\":\"【培训地点】滨江小学/【开课时间】8:30至10:00/【报名年级】3年级至6年级/\",\"price\":\"0.01\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481600313_2.jpg\",\"attr1\":\"【培训地点】滨江小学\",\"attr2\":\"【开课时间】8:30至10:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-25 10:24:55','2025-11-25 10:25:12','2025-11-25 10:29:12','2025-11-25 10:29:12'),(19,'ORD20251125419729','o7Alw13fPlzoTPQLJSah3sKPFEIk','张三','622621166622012052','滨江小学','四年级','18089390606',0.01,0.01,1,NULL,'4200002887202511257971867850',NULL,NULL,0.00,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"product_id\":14,\"sku_id\":1279,\"name\":\"【2025年寒假】美术(简笔画、素描)培训班\",\"sku_name\":\"【培训地点】滨江小学/【开课时间】8:30至10:00/【报名年级】3年级至6年级/\",\"price\":\"0.01\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481600313_2.jpg\",\"attr1\":\"【培训地点】滨江小学\",\"attr2\":\"【开课时间】8:30至10:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-25 16:30:19','2025-11-25 16:30:47',NULL,'2025-11-25 16:30:47'),(20,'ORD20251125510414','o7Alw13fPlzoTPQLJSah3sKPFEIk','小李','622626199990808271','贡院','四年级','18089390606',0.01,0.01,0,NULL,NULL,NULL,NULL,0.00,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"product_id\":14,\"sku_id\":1279,\"name\":\"【2025年寒假】美术(简笔画、素描)培训班\",\"sku_name\":\"【培训地点】滨江小学/【开课时间】8:30至10:00/【报名年级】3年级至6年级/\",\"price\":\"0.01\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481600313_2.jpg\",\"attr1\":\"【培训地点】滨江小学\",\"attr2\":\"【开课时间】8:30至10:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-25 22:21:50',NULL,NULL,'2025-11-25 22:21:50'),(21,'ORD20251126186032','o7Alw13fPlzoTPQLJSah3sKPFEIk','账号','622626199902010188','贡院','三年级','18089390606',1.00,1.00,1,NULL,'4200002918202511265674755126',NULL,NULL,0.00,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"product_id\":14,\"sku_id\":1285,\"name\":\"【2025年寒假】美术(简笔画、素描)培训班\",\"sku_name\":\"【培训地点】滨江小学/【开课时间】8:30至10:00/【报名年级】3年级至6年级/\",\"price\":\"1.00\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481600313_2.jpg\",\"attr1\":\"【培训地点】滨江小学\",\"attr2\":\"【开课时间】8:30至10:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-26 09:06:26','2025-11-26 09:06:32',NULL,'2025-11-26 09:06:32'),(22,'ORD20251126776047','o7Alw19BkmSuFT43602ZDfk8Jpfg','杜平','621202201608124423','城关小学','六年级一班','18294597060',920.00,920.00,0,NULL,NULL,NULL,NULL,0.00,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"product_id\":14,\"sku_id\":1303,\"name\":\"【2025年寒假】美术(简笔画、素描)培训班\",\"sku_name\":\"【培训地点】城关小学/【开课时间】14:30至16:00/【报名年级】3年级至6年级/\",\"price\":\"920.00\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481628487_7.jpg\",\"attr1\":\"【培训地点】城关小学\",\"attr2\":\"【开课时间】14:30至16:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-26 11:12:56',NULL,NULL,'2025-11-26 11:12:56'),(23,'ORD20251126332399','o7Alw11fsLkKQWKRCb9-YxJiqihU','董昱钦','622625198510022020','幼儿园','大班','13993983635',400.00,400.00,3,NULL,'4200002865202511266348071678','RF202511261518277513',NULL,400.00,2,'时间冲突，无法参加',1,'课程未开始',1,'2025-11-26 15:19:10',NULL,NULL,NULL,'[{\"product_id\":4,\"sku_id\":1261,\"name\":\"【2025年寒假】跳绳培训班\",\"sku_name\":\"【培训地点】滨江小学/【开课时间】14:30至16:00/【报名年级】3年级至6年级/\",\"price\":\"400.00\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763470437535_11.jpg\",\"attr1\":\"【培训地点】滨江小学\",\"attr2\":\"【开课时间】14:30至16:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-26 15:15:32','2025-11-26 15:15:40','2025-11-26 15:19:10','2025-11-26 15:19:10'),(24,'ORD20251126823478','o7Alw1zm4dOITS6xEvPTn7TEX3e8','1','622621198211232716','1','1','18993910088',800.00,800.00,0,NULL,NULL,NULL,NULL,0.00,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"product_id\":10,\"sku_id\":1232,\"name\":\"【2025年寒假】足球培训班\",\"sku_name\":\"【培训地点】江北小学/【开课时间】10:10至11:40/【报名年级】3年级至6年级/\",\"price\":\"800.00\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763465271770_15.jpg\",\"attr1\":\"【培训地点】江北小学\",\"attr2\":\"【开课时间】10:10至11:40\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-26 15:23:43',NULL,NULL,'2025-11-26 15:23:43'),(25,'ORD20251126836049','o7Alw1zm4dOITS6xEvPTn7TEX3e8','1','622621198211232716','1','1','18993910088',800.00,800.00,0,NULL,NULL,NULL,NULL,0.00,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"product_id\":10,\"sku_id\":1232,\"name\":\"【2025年寒假】足球培训班\",\"sku_name\":\"【培训地点】江北小学/【开课时间】10:10至11:40/【报名年级】3年级至6年级/\",\"price\":\"800.00\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763465271770_15.jpg\",\"attr1\":\"【培训地点】江北小学\",\"attr2\":\"【开课时间】10:10至11:40\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-26 15:23:56',NULL,NULL,'2025-11-26 15:23:56'),(26,'ORD20251126608329','o7Alw13fPlzoTPQLJSah3sKPFEIk','嘿嘿','622626199797299817','贡院','三年级','18089390606',400.00,400.00,3,NULL,'4200002903202511269059731967','RF202511261537372070',NULL,400.00,2,'时间不可以',1,'可以的可以',1,'2025-11-26 15:39:20',NULL,NULL,NULL,'[{\"product_id\":4,\"sku_id\":1261,\"name\":\"【2025年寒假】跳绳培训班\",\"sku_name\":\"【培训地点】滨江小学/【开课时间】14:30至16:00/【报名年级】3年级至6年级/\",\"price\":\"400.00\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763470437535_11.jpg\",\"attr1\":\"【培训地点】滨江小学\",\"attr2\":\"【开课时间】14:30至16:00\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-26 15:36:48','2025-11-26 15:37:10','2025-11-26 15:39:20','2025-11-26 15:39:20'),(27,'ORD20251126020923','o7Alw15SyTbVB1HQCbF993LgNfhg','1','621202201905230056','1','1','19109398890',580.00,580.00,0,NULL,NULL,NULL,NULL,0.00,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,'[{\"product_id\":12,\"sku_id\":1186,\"name\":\"【2025年寒假】硬笔书法培训班\",\"sku_name\":\"【培训地点】滨江小学/【开课时间】10:10至11:40/【报名年级】3年级至6年级/\",\"price\":\"580.00\",\"quantity\":1,\"image\":\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763480450603_3.jpg\",\"attr1\":\"【培训地点】滨江小学\",\"attr2\":\"【开课时间】10:10至11:40\",\"attr3\":\"【报名年级】3年级至6年级\",\"attr4\":null}]','2025-11-26 20:27:00',NULL,NULL,'2025-11-26 20:27:00');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

--
-- Table structure for table `product_skus`
--

DROP TABLE IF EXISTS `product_skus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_skus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `sku_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `attr1` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `attr2` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `attr3` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `attr4` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT '0',
  `limit_qty` int DEFAULT '0',
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_skus_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1305 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_skus`
--

/*!40000 ALTER TABLE `product_skus` DISABLE KEYS */;
INSERT INTO `product_skus` VALUES (1177,13,'【培训地点】滨江小学/【开课时间】14:30至16:00/【报名年级】3年级至6年级/','【培训地点】滨江小学','【开课时间】14:30至16:00','【报名年级】3年级至6年级',NULL,580.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481108782_2.jpg'),(1178,13,'【培训地点】滨江小学/【开课时间】16:10至17:40/【报名年级】3年级至6年级/','【培训地点】滨江小学','【开课时间】16:10至17:40','【报名年级】3年级至6年级',NULL,580.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481116024_3.jpg'),(1179,13,'【培训地点】钟楼小学/【开课时间】16:10至17:40/【报名年级】3年级至6年级/','【培训地点】钟楼小学','【开课时间】16:10至17:40','【报名年级】3年级至6年级',NULL,580.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481121866_4.jpg'),(1180,13,'【培训地点】城关小学/【开课时间】16:10至17:40/【报名年级】3年级至6年级/','【培训地点】城关小学','【开课时间】16:10至17:40','【报名年级】3年级至6年级',NULL,580.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481133202_5.jpg'),(1181,13,'【培训地点】江南小学/【开课时间】16:10至17:40/【报名年级】3年级至9年级/','【培训地点】江南小学','【开课时间】16:10至17:40','【报名年级】3年级至9年级',NULL,580.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481139172_6.jpg'),(1182,13,'【培训地点】江北 小学/【开课时间】10:10至11:40/【报名年级】3年级至6年级/','【培训地点】江北 小学','【开课时间】10:10至11:40','【报名年级】3年级至6年级',NULL,580.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481145311_7.jpg'),(1183,13,'【培训地点】东江第二初中/【开课时间】10:10至11:40/【报名年级】3年级至9年级/','【培训地点】东江第二初中','【开课时间】10:10至11:40','【报名年级】3年级至9年级',NULL,580.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481152708_8.jpg'),(1184,13,'【培训地点】东江第一初中/【开课时间】10:10至11:40/【报名年级】3年级至9年级/','【培训地点】东江第一初中','【开课时间】10:10至11:40','【报名年级】3年级至9年级',NULL,580.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481158522_9.jpg'),(1185,12,'【培训地点】滨江小学/【开课时间】8:30至10:00/【报名年级】3年级至6年级/','【培训地点】滨江小学','【开课时间】8:30至10:00','【报名年级】3年级至6年级',NULL,580.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763480444027_2.jpg'),(1186,12,'【培训地点】滨江小学/【开课时间】10:10至11:40/【报名年级】3年级至6年级/','【培训地点】滨江小学','【开课时间】10:10至11:40','【报名年级】3年级至6年级',NULL,580.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763480450603_3.jpg'),(1187,12,'【培训地点】钟楼小学/【开课时间】14:30至16:00/【报名年级】3年级至6年级/','【培训地点】钟楼小学','【开课时间】14:30至16:00','【报名年级】3年级至6年级',NULL,580.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763480456993_4.jpg'),(1188,12,'【培训地点】城关小学/【开课时间】14:30至16:00/【报名年级】3年级至6年级/','【培训地点】城关小学','【开课时间】14:30至16:00','【报名年级】3年级至6年级',NULL,580.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763480464953_5.jpg'),(1189,12,'【培训地点】江南小学/【开课时间】14:30至16:00/【报名年级】3年级至9年级/','【培训地点】江南小学','【开课时间】14:30至16:00','【报名年级】3年级至9年级',NULL,580.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763480472330_6.jpg'),(1190,12,'【培训地点】江北小学/【开课时间】8:30至10:00/【报名年级】3年级至6年级/','【培训地点】江北小学','【开课时间】8:30至10:00','【报名年级】3年级至6年级',NULL,580.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763480478859_7.jpg'),(1191,12,'【培训地点】东江第二初中/【开课时间】8:30至10:00/【报名年级】3年级至9年级/','【培训地点】东江第二初中','【开课时间】8:30至10:00','【报名年级】3年级至9年级',NULL,580.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763480484908_8.jpg'),(1192,12,'【培训地点】东江第一初中/【开课时间】8:30至10:00/【报名年级】3年级至9年级/','【培训地点】东江第一初中','【开课时间】8:30至10:00','【报名年级】3年级至9年级',NULL,580.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763480497453_9.jpg'),(1193,11,'【培训地点】城关中学/【开课时间】8:30至10:00/【报名年级】3年级至9年级/','【培训地点】城关中学','【开课时间】8:30至10:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763462423360_01.jpg'),(1194,11,'【培训地点】城关中学/【开课时间】10:10至11:40/【报名年级】3年级至9年级/','【培训地点】城关中学','【开课时间】10:10至11:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763462522193_02.jpg'),(1195,11,'【培训地点】城关中学/【开课时间】14:30至16:00/【报名年级】3年级至9年级/','【培训地点】城关中学','【开课时间】14:30至16:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763462641492_03.jpg'),(1196,11,'【培训地点】城关中学/【开课时间】16:10至17:40/【报名年级】3年级至9年级/','【培训地点】城关中学','【开课时间】16:10至17:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763462686591_04.jpg'),(1197,11,'【培训地点】滨江小学/【开课时间】8:30至10:00/【报名年级】3年级至9年级/','【培训地点】滨江小学','【开课时间】8:30至10:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763462814487_08.jpg'),(1198,11,'【培训地点】滨江小学/【开课时间】10:10至11:40/【报名年级】3年级至9年级/','【培训地点】滨江小学','【开课时间】10:10至11:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763462855512_07.jpg'),(1199,11,'【培训地点】滨江小学/【开课时间】14:30至16:00/【报名年级】3年级至9年级/','【培训地点】滨江小学','【开课时间】14:30至16:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763462989569_06.jpg'),(1200,11,'【培训地点】滨江小学/【开课时间】16:10至17:40/【报名年级】3年级至9年级/','【培训地点】滨江小学','【开课时间】16:10至17:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763463050049_05.jpg'),(1201,11,'【培训地点】钟楼小学/【开课时间】8:30至10:00/【报名年级】3年级至9年级/','【培训地点】钟楼小学','【开课时间】8:30至10:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763463116289_09.jpg'),(1202,11,'【培训地点】钟楼小学/【开课时间】10:10至11:40/【报名年级】3年级至9年级/','【培训地点】钟楼小学','【开课时间】10:10至11:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763463155988_10.jpg'),(1203,11,'【培训地点】钟楼小学/【开课时间】14:30至16:00/【报名年级】3年级至9年级/','【培训地点】钟楼小学','【开课时间】14:30至16:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763463220097_11.jpg'),(1204,11,'【培训地点】钟楼小学/【开课时间】16:10至17:40/【报名年级】3年级至9年级/','【培训地点】钟楼小学','【开课时间】16:10至17:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763463266743_12.jpg'),(1205,11,'【培训地点】城关小学/【开课时间】8:30至10:00/【报名年级】3年级至9年级/','【培训地点】城关小学','【开课时间】8:30至10:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763463734451_16.jpg'),(1206,11,'【培训地点】城关小学/【开课时间】10:10至11:40/【报名年级】3年级至9年级/','【培训地点】城关小学','【开课时间】10:10至11:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763463784569_15.jpg'),(1207,11,'【培训地点】城关小学/【开课时间】14:30至16:00/【报名年级】3年级至9年级/','【培训地点】城关小学','【开课时间】14:30至16:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763463839924_14.jpg'),(1208,11,'【培训地点】城关小学/【开课时间】16:10至17:40/【报名年级】3年级至9年级/','【培训地点】城关小学','【开课时间】16:10至17:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763463875534_13.jpg'),(1209,11,'【培训地点】江南小学/【开课时间】8:30至10:00/【报名年级】3年级至9年级/','【培训地点】江南小学','【开课时间】8:30至10:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763463928523_17.jpg'),(1210,11,'【培训地点】江南小学/【开课时间】10:10至11:40/【报名年级】3年级至9年级/','【培训地点】江南小学','【开课时间】10:10至11:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763463981236_18.jpg'),(1211,11,'【培训地点】江南小学/【开课时间】14:30至16:00/【报名年级】3年级至9年级/','【培训地点】江南小学','【开课时间】14:30至16:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763464026069_19.jpg'),(1212,11,'【培训地点】江南小学/【开课时间】16:10至17:40/【报名年级】3年级至9年级/','【培训地点】江南小学','【开课时间】16:10至17:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763464098971_20.jpg'),(1213,11,'【培训地点】东江中心小学/【开课时间】8:30至10:00/【报名年级】3年级至9年级/','【培训地点】东江中心小学','【开课时间】8:30至10:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763464156455_24.jpg'),(1214,11,'【培训地点】东江中心小学/【开课时间】10:10至11:40/【报名年级】3年级至9年级/','【培训地点】东江中心小学','【开课时间】10:10至11:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763464203512_23.jpg'),(1215,11,'【培训地点】东江中心小学/【开课时间】14:30至16:00/【报名年级】3年级至9年级/','【培训地点】东江中心小学','【开课时间】14:30至16:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763464261448_22.jpg'),(1216,11,'【培训地点】东江中心小学/【开课时间】16:10至17:40/【报名年级】3年级至9年级/','【培训地点】东江中心小学','【开课时间】16:10至17:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763464303078_21.jpg'),(1217,11,'【培训地点】东江第二初中/【开课时间】8:30至10:00/【报名年级】3年级至9年级/','【培训地点】东江第二初中','【开课时间】8:30至10:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763464356273_25.jpg'),(1218,11,'【培训地点】东江第二初中/【开课时间】10:10至11:40/【报名年级】3年级至9年级/','【培训地点】东江第二初中','【开课时间】10:10至11:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763464398306_26.jpg'),(1219,11,'【培训地点】东江第二初中/【开课时间】14:30至16:00/【报名年级】3年级至9年级/','【培训地点】东江第二初中','【开课时间】14:30至16:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763464451959_27.jpg'),(1220,11,'【培训地点】东江第二初中/【开课时间】16:10至17:40/【报名年级】3年级至9年级/','【培训地点】东江第二初中','【开课时间】16:10至17:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763464488817_28.jpg'),(1221,11,'【培训地点】东江第一初中/【开课时间】8:30至10:00/【报名年级】3年级至9年级/','【培训地点】东江第一初中','【开课时间】8:30至10:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763464647461_04.jpg'),(1222,11,'【培训地点】东江第一初中/【开课时间】10:10至11:40/【报名年级】3年级至9年级/','【培训地点】东江第一初中','【开课时间】10:10至11:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763464640080_03.jpg'),(1223,11,'【培训地点】东江第一初中/【开课时间】14:30至16:00/【报名年级】3年级至9年级/','【培训地点】东江第一初中','【开课时间】14:30至16:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763464622230_30.jpg'),(1224,11,'【培训地点】东江第一初中/【开课时间】16:10至17:40/【报名年级】3年级至9年级/','【培训地点】东江第一初中','【开课时间】16:10至17:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763464614797_29.jpg'),(1225,10,'【培训地点】城关中学/【开课时间】14:30至16:00/【报名年级】3年级至9年级/','【培训地点】城关中学','【开课时间】14:30至16:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763464846234_07.jpg'),(1226,10,'【培训地点】城关中学/【开课时间】16:10至17:40/【报名年级】3年级至9年级/','【培训地点】城关中学','【开课时间】16:10至17:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763464901262_08.jpg'),(1227,10,'【培训地点】钟楼小学/【开课时间】14:30至16:00/【报名年级】3年级至6年级/','【培训地点】钟楼小学','【开课时间】14:30至16:00','【报名年级】3年级至6年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763464992243_10.jpg'),(1228,10,'【培训地点】钟楼小学/【开课时间】16:10至17:40/【报名年级】3年级至6年级/','【培训地点】钟楼小学','【开课时间】16:10至17:40','【报名年级】3年级至6年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763465024694_10.jpg'),(1229,10,'【培训地点】江南小学/【开课时间】14:30至16:00/【报名年级】3年级至6年级/','【培训地点】江南小学','【开课时间】14:30至16:00','【报名年级】3年级至6年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763465097515_11.jpg'),(1230,10,'【培训地点】江南小学/【开课时间】16:10至17:40/【报名年级】3年级至6年级/','【培训地点】江南小学','【开课时间】16:10至17:40','【报名年级】3年级至6年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763465109289_12.jpg'),(1231,10,'【培训地点】江北小学/【开课时间】8:30至10:00/【报名年级】3年级至6年级/','【培训地点】江北小学','【开课时间】8:30至10:00','【报名年级】3年级至6年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763465263298_16.jpg'),(1232,10,'【培训地点】江北小学/【开课时间】10:10至11:40/【报名年级】3年级至6年级/','【培训地点】江北小学','【开课时间】10:10至11:40','【报名年级】3年级至6年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763465271770_15.jpg'),(1233,10,'【培训地点】江北小学/【开课时间】14:30至16:00/【报名年级】7年级至9年级/','【培训地点】江北小学','【开课时间】14:30至16:00','【报名年级】7年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763465287932_14.jpg'),(1234,10,'【培训地点】江北小学/【开课时间】16:10至17:40/【报名年级】7年级至9年级/','【培训地点】江北小学','【开课时间】16:10至17:40','【报名年级】7年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763465294981_13.jpg'),(1235,10,'【培训地点】东江第一初中/【开课时间】14:30至16:00/【报名年级】3年级至9年级/','【培训地点】东江第一初中','【开课时间】14:30至16:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763465384654_05.jpg'),(1236,10,'【培训地点】东江第一初中/【开课时间】16:10至17:40/【报名年级】3年级至9年级/','【培训地点】东江第一初中','【开课时间】16:10至17:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763465393124_06.jpg'),(1237,9,'【培训地点】滨江小学/【开课时间】8:30至10:00/【报名年级】3年级至9年级/','【培训地点】滨江小学','【开课时间】8:30至10:00','【报名年级】3年级至9年级',NULL,900.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763467354902_02.jpg'),(1238,9,'【培训地点】滨江小学/【开课时间】10:10至11:40/【报名年级】3年级至9年级/','【培训地点】滨江小学','【开课时间】10:10至11:40','【报名年级】3年级至9年级',NULL,900.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763467365801_03.jpg'),(1239,9,'【培训地点】东江中心小学/【开课时间】8:30至10:00/【报名年级】3年级至9年级/','【培训地点】东江中心小学','【开课时间】8:30至10:00','【报名年级】3年级至9年级',NULL,900.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763467469637_05.jpg'),(1240,9,'【培训地点】东江中心小学/【开课时间】10:10至11:40/【报名年级】3年级至9年级/','【培训地点】东江中心小学','【开课时间】10:10至11:40','【报名年级】3年级至9年级',NULL,900.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763467480830_04.jpg'),(1241,8,'【培训地点】城关中学/【开课时间】14:30至16:00/【报名年级】3年级至9年级/','【培训地点】城关中学','【开课时间】14:30至16:00','【报名年级】3年级至9年级',NULL,800.00,30,123,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763467818088_07.jpg'),(1242,8,'【培训地点】城关中学/【开课时间】16:10至17:40/【报名年级】3年级至9年级/','【培训地点】城关中学','【开课时间】16:10至17:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763467826798_06.jpg'),(1243,8,'【培训地点】滨江小学/【开课时间】14:30至16:00/【报名年级】3年级至9年级/','【培训地点】滨江小学','【开课时间】14:30至16:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763468120050_08.jpg'),(1244,8,'【培训地点】滨江小学/【开课时间】16:10至17:40/【报名年级】3年级至9年级/','【培训地点】滨江小学','【开课时间】16:10至17:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763468127579_09.jpg'),(1245,8,'【培训地点】钟楼小学/【开课时间】14:30至16:00/【报名年级】3年级至9年级/','【培训地点】钟楼小学','【开课时间】14:30至16:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763468136249_11.jpg'),(1246,8,'【培训地点】钟楼小学/【开课时间】16:10至17:40/【报名年级】3年级至9年级/','【培训地点】钟楼小学','【开课时间】16:10至17:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763468143800_10.jpg'),(1247,8,'【培训地点】城关小学/【开课时间】14:30至16:00/【报名年级】3年级至9年级/','【培训地点】城关小学','【开课时间】14:30至16:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763468155023_12.jpg'),(1248,8,'【培训地点】城关小学/【开课时间】16:10至17:40/【报名年级】3年级至9年级/','【培训地点】城关小学','【开课时间】16:10至17:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763468161373_13.jpg'),(1249,8,'【培训地点】江南小学/【开课时间】14:30至16:00/【报名年级】3年级至9年级/','【培训地点】江南小学','【开课时间】14:30至16:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763468170121_15.jpg'),(1250,8,'【培训地点】江南小学/【开课时间】16:10至17:40/【报名年级】3年级至9年级/','【培训地点】江南小学','【开课时间】16:10至17:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763468177006_14.jpg'),(1251,8,'【培训地点】东江中心小学/【开课时间】14:30至16:00/【报名年级】3年级至9年级/','【培训地点】东江中心小学','【开课时间】14:30至16:00','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763468185370_16.jpg'),(1252,8,'【培训地点】东江中心小学/【开课时间】16:10至17:40/【报名年级】3年级至9年级/','【培训地点】东江中心小学','【开课时间】16:10至17:40','【报名年级】3年级至9年级',NULL,800.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763468191652_17.jpg'),(1253,6,'【培训地点】钟楼小学/【开课时间】8:30至10:00/【报名年级】3年级至9年级/','【培训地点】钟楼小学','【开课时间】8:30至10:00','【报名年级】3年级至9年级',NULL,560.00,30,4234,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763469751070_02.jpg'),(1254,6,'【培训地点】钟楼小学/【开课时间】10:10至11:40/【报名年级】3年级至9年级/','【培训地点】钟楼小学','【开课时间】10:10至11:40','【报名年级】3年级至9年级',NULL,560.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763469757457_03.jpg'),(1255,6,'【培训地点】江南小学/【开课时间】8:30至10:00/【报名年级】3年级至9年级/','【培训地点】江南小学','【开课时间】8:30至10:00','【报名年级】3年级至9年级',NULL,560.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763469764476_05.jpg'),(1256,6,'【培训地点】江南小学/【开课时间】10:10至11:40/【报名年级】3年级至9年级/','【培训地点】江南小学','【开课时间】10:10至11:40','【报名年级】3年级至9年级',NULL,560.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763469772161_04.jpg'),(1257,6,'【培训地点】东江中心小学/【开课时间】8:30至10:00/【报名年级】3年级至9年级/','【培训地点】东江中心小学','【开课时间】8:30至10:00','【报名年级】3年级至9年级',NULL,560.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763469778460_06.jpg'),(1258,6,'【培训地点】东江中心小学/【开课时间】10:10至11:40/【报名年级】3年级至9年级/','【培训地点】东江中心小学','【开课时间】10:10至11:40','【报名年级】3年级至9年级',NULL,560.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763469785611_07.jpg'),(1259,6,'【培训地点】东江第二初中/【开课时间】8:30至10:00/【报名年级】3年级至9年级/','【培训地点】东江第二初中','【开课时间】8:30至10:00','【报名年级】3年级至9年级',NULL,560.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763469793766_09.jpg'),(1260,6,'【培训地点】东江第二初中/【开课时间】10:10至11:40/【报名年级】3年级至9年级/','【培训地点】东江第二初中','【开课时间】10:10至11:40','【报名年级】3年级至9年级',NULL,560.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763469802016_08.jpg'),(1261,4,'【培训地点】滨江小学/【开课时间】14:30至16:00/【报名年级】3年级至6年级/','【培训地点】滨江小学','【开课时间】14:30至16:00','【报名年级】3年级至6年级',NULL,400.00,30,1232131,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763470437535_11.jpg'),(1262,4,'【培训地点】滨江小学/【开课时间】16:10至17:40/【报名年级】3年级至6年级/','【培训地点】滨江小学','【开课时间】16:10至17:40','【报名年级】3年级至6年级',NULL,400.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763470445715_12.jpg'),(1263,4,'【培训地点】钟楼小学/【开课时间】8:30至10:00/【报名年级】3年级至9年级/','【培训地点】钟楼小学','【开课时间】8:30至10:00','【报名年级】3年级至9年级',NULL,400.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763470454231_14.jpg'),(1264,4,'【培训地点】钟楼小学/【开课时间】10:10至11:40/【报名年级】3年级至9年级/','【培训地点】钟楼小学','【开课时间】10:10至11:40','【报名年级】3年级至9年级',NULL,400.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763470460954_13.jpg'),(1265,4,'【培训地点】城关小学/【开课时间】8:30至10:00/【报名年级】3年级至9年级/','【培训地点】城关小学','【开课时间】8:30至10:00','【报名年级】3年级至9年级',NULL,400.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763470469893_15.jpg'),(1266,4,'【培训地点】城关小学/【开课时间】10:10至11:40/【报名年级】3年级至9年级/','【培训地点】城关小学','【开课时间】10:10至11:40','【报名年级】3年级至9年级',NULL,400.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763470481125_16.jpg'),(1267,4,'【培训地点】东江中心小学/【开课时间】14:30至16:00/【报名年级】3年级至9年级/','【培训地点】东江中心小学','【开课时间】14:30至16:00','【报名年级】3年级至9年级',NULL,400.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763470489416_17.jpg'),(1268,4,'【培训地点】东江中心小学/【开课时间】16:10至17:40/【报名年级】3年级至9年级/','【培训地点】东江中心小学','【开课时间】16:10至17:40','【报名年级】3年级至9年级',NULL,400.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763470495412_18.jpg'),(1269,3,'【培训地点】城关中学/【开课时间】8:30至10:00/【报名年级】7年级至9年级/','【培训地点】城关中学','【开课时间】8:30至10:00','【报名年级】7年级至9年级',NULL,1420.00,30,1,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763471536199_02.jpg'),(1270,3,'【培训地点】城关中学/【开课时间】10:10至11:40/【报名年级】7年级至9年级/','【培训地点】城关中学','【开课时间】10:10至11:40','【报名年级】7年级至9年级',NULL,1420.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763471542742_03.jpg'),(1271,3,'【培训地点】钟楼小学/【开课时间】8:30至10:00/【报名年级】7年级至9年级/','【培训地点】钟楼小学','【开课时间】8:30至10:00','【报名年级】7年级至9年级',NULL,1420.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763471549036_05.jpg'),(1272,3,'【培训地点】钟楼小学/【开课时间】10:10至11:40/【报名年级】7年级至9年级/','【培训地点】钟楼小学','【开课时间】10:10至11:40','【报名年级】7年级至9年级',NULL,1420.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763471555269_04.jpg'),(1273,3,'【培训地点】江南小学/【开课时间】8:30至10:00/【报名年级】7年级至9年级/','【培训地点】江南小学','【开课时间】8:30至10:00','【报名年级】7年级至9年级',NULL,1420.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763471574857_06.jpg'),(1274,3,'【培训地点】江南小学/【开课时间】10:10至11:40/【报名年级】7年级至9年级/','【培训地点】江南小学','【开课时间】10:10至11:40','【报名年级】7年级至9年级',NULL,1420.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763471582392_07.jpg'),(1275,3,'【培训地点】东江第二初中/【开课时间】8:30至10:00/【报名年级】7年级至9年级/','【培训地点】东江第二初中','【开课时间】8:30至10:00','【报名年级】7年级至9年级',NULL,1420.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763471591837_09.jpg'),(1276,3,'【培训地点】东江第二初中/【开课时间】10:10至11:40/【报名年级】7年级至9年级/','【培训地点】东江第二初中','【开课时间】10:10至11:40','【报名年级】7年级至9年级',NULL,1420.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763471597891_08.jpg'),(1277,3,'【培训地点】东江第一初中/【开课时间】8:30至10:00/【报名年级】7年级至9年级/','【培训地点】东江第一初中','【开课时间】8:30至10:00','【报名年级】7年级至9年级',NULL,1420.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763471603970_10.jpg'),(1278,3,'【培训地点】东江第一初中/【开课时间】10:10至11:40/【报名年级】7年级至9年级/','【培训地点】东江第一初中','【开课时间】10:10至11:40','【报名年级】7年级至9年级',NULL,1420.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763471612302_11.jpg'),(1291,15,'【培训地点】城关小学/【开课时间】14:30至16:00/【报名年级】7年级-9年级/','【培训地点】城关小学','【开课时间】14:30至16:00','【报名年级】7年级-9年级',NULL,1440.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481909160_2.jpg'),(1292,15,'【培训地点】城关小学/【开课时间】16:10至17:40/【报名年级】7年级-9年级/','【培训地点】城关小学','【开课时间】16:10至17:40','【报名年级】7年级-9年级',NULL,1440.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481915414_3.jpg'),(1299,14,'【培训地点】滨江小学/【开课时间】8:30至10:00/【报名年级】3年级至6年级/','【培训地点】滨江小学','【开课时间】8:30至10:00','【报名年级】3年级至6年级',NULL,920.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481600313_2.jpg'),(1300,14,'【培训地点】滨江小学/【开课时间】10:10至11:40/【报名年级】3年级至6年级/','【培训地点】滨江小学','【开课时间】10:10至11:40','【报名年级】3年级至6年级',NULL,920.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481606207_3.jpg'),(1301,14,'【培训地点】钟楼小学/【开课时间】14:30至16:00/【报名年级】3年级至6年级/','【培训地点】钟楼小学','【开课时间】14:30至16:00','【报名年级】3年级至6年级',NULL,920.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481613180_4.jpg'),(1302,14,'【培训地点】钟楼小学/【开课时间】16:10至17:40/【报名年级】3年级至6年级/','【培训地点】钟楼小学','【开课时间】16:10至17:40','【报名年级】3年级至6年级',NULL,920.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481618781_5.jpg'),(1303,14,'【培训地点】城关小学/【开课时间】14:30至16:00/【报名年级】3年级至6年级/','【培训地点】城关小学','【开课时间】14:30至16:00','【报名年级】3年级至6年级',NULL,920.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481628487_7.jpg'),(1304,14,'【培训地点】城关小学/【开课时间】16:10至17:40/【报名年级】3年级至6年级/','【培训地点】城关小学','【开课时间】16:10至17:40','【报名年级】3年级至6年级',NULL,920.00,30,0,'https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481636334_6.jpg');
/*!40000 ALTER TABLE `product_skus` ENABLE KEYS */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `category_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `images` json DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `limit_purchase` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (3,'【2025年寒假】体适能训练（培训中考体育相关项目）','【招生限额】每班限额招生30人。\n【开课时长】20天*90分钟/天。\n【课程内容】针对中考体育项目，进行心肺耐力、肌肉力量、爆发力、柔韧性和协调性等综合体能训练。课程旨在科学提升身体素质，掌握正确的运动方法。\n【选课提示】报名前，请务必仔细核对所选课程的具体信息，包括:培训地点、开课时间、授课对象年级等，确认无误后再进行下单支付。\n【退款说明】报名缴费后，若需退出培训，可在付款成功之日起三天内，通过线上订单提交退款申请并注明原因，后台客服审核通过后，款项将按原支付路径退回；超过三天，则将无法线上办理，如需退款，请家长携带相关凭证（身份证缴费截图等）亲自前往我中心办理相关手续。\n【咨询电话】0939-5959039；请在【工作日】8:30-11：30，14：30-17:30电话咨询。',4,'2025-11-11 07:01:17','[\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763479514142_%E7%AE%80%E7%BA%A6%E6%89%8B%E7%BB%98%E9%A3%8E%E4%B8%AD%E8%80%83%E4%BD%93%E6%B5%8B%E7%8F%AD%E6%8B%9B%E7%94%9F%E6%89%8B%E6%9C%BA%E6%B5%B7%E6%8A%A5__2025-11-18%2B23_24_51.jpg\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551478389_1.png\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551478527_2.png\"]','2025-11-25 00:32:25',0),(4,'【2025年寒假】跳绳培训班','【招生限额】每班限额招生30人。\n【开课时长】20天*90分钟/天。\n【课程内容】从单摇、并脚跳等基础动作学起，逐步过渡到花样跳绳及速度跳绳。有效提升身体协调性、节奏感和心肺功能。\n【选课提示】报名前，请务必仔细核对所选课程的具体信息，包括:培训地点、开课时间、授课对象年级等，确认无误后再进行下单支付。\n【退款说明】报名缴费后，若需退出培训，可在付款成功之日起三天内，通过线上订单提交退款申请并注明原因，后台客服审核通过后，款项将按原支付路径退回；超过三天，则将无法线上办理，如需退款，请家长携带相关凭证（身份证缴费截图等）亲自前往我中心办理相关手续。\n【咨询电话】0939-5959039；请在【工作日】8:30-11：30，14：30-17:30电话咨询。',6,'2025-11-11 07:11:06','[\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763469875017_10.jpg\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551460086_1.png\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551460227_2.png\"]','2025-11-25 00:31:33',0),(6,'【2025年寒假】乒乓球培训班','【招生限额】每班限额招生30人。\n【开课时长】20天*90分钟/天。\n【课程内容】进行握拍法、基本步法、发球、接发球、推挡、攻球等基础技术训练，并通过多球练习和实战提升反应速度和手眼协调能力。\n【选课提示】报名前，请务必仔细核对所选课程的具体信息，包括:培训地点、开课时间、授课对象年级等，确认无误后再进行下单支付。\n【退款说明】报名缴费后，若需退出培训，可在付款成功之日起三天内，通过线上订单提交退款申请并注明原因，后台客服审核通过后，款项将按原支付路径退回；超过三天，则将无法线上办理，如需退款，请家长携带相关凭证（身份证缴费截图等）亲自前往我中心办理相关手续。\n【咨询电话】0939-5959039；请在【工作日】8:30-11：30，14：30-17:30电话咨询。',8,'2025-11-11 08:00:11','[\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763469334905_01.jpg\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551441730_1.png\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551441879_2.png\"]','2025-11-25 00:31:15',0),(8,'【2025年寒假】排球培训班','【招生限额】每班限额招生30人。\n【开课时长】20天*90分钟/天。\n【课程内容】学习垫球、传球、发球等排球基本动作要领，并进行步伐移动和简单战术配合练习。课程注重基础技能培养，感受排球运动的团队魅力。\n【选课提示】报名前，请务必仔细核对所选课程的具体信息，包括:培训地点、开课时间、授课对象年级等，确认无误后再进行下单支付。\n【退款说明】报名缴费后，若需退出培训，可在付款成功之日起三天内，通过线上订单提交退款申请并注明原因，后台客服审核通过后，款项将按原支付路径退回；超过三天，则将无法线上办理，如需退款，请家长携带相关凭证（身份证缴费截图等）亲自前往我中心办理相关手续。\n【咨询电话】0939-5959039；请在【工作日】8:30-11：30，14：30-17:30电话咨询。',3,'2025-11-11 08:18:57','[\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763479807115_%E6%BC%AB%E7%94%BB%E9%A3%8E%E7%BA%A2%E8%89%B2%E5%B0%91%E5%84%BF%E7%BE%BD%E6%AF%9B%E7%90%83%E5%85%B4%E8%B6%A3%E7%8F%AD%E6%8B%9B%E7%94%9F%E6%B5%B7%E6%8A%A5__2025-11-18%2B23_28_24.jpg\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551405319_1.png\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551405461_2.png\"]','2025-11-25 00:31:00',0),(9,'【2025年寒假】羽毛球培训班','【招生限额】每班限额招生30人。\n【开课时长】20天*90分钟/天。\n【课程内容】掌握正确的握拍、挥拍步伐，学习高远球、吊球、网前球等基本击球技术，并了解单打、双打的基本规则和简单战术。\n【选课提示】报名前，请务必仔细核对所选课程的具体信息，包括:培训地点、开课时间、授课对象年级等，确认无误后再进行下单支付。\n【退款说明】报名缴费后，若需退出培训，可在付款成功之日起三天内，通过线上订单提交退款申请并注明原因，后台客服审核通过后，款项将按原支付路径退回；超过三天，则将无法线上办理，如需退款，请家长携带相关凭证（身份证缴费截图等）亲自前往我中心办理相关手续。\n【咨询电话】0939-5959039；请在【工作日】8:30-11：30，14：30-17:30电话咨询。',7,'2025-11-13 16:11:56','[\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763479779180_%E6%BC%AB%E7%94%BB%E9%A3%8E%E7%BA%A2%E8%89%B2%E5%B0%91%E5%84%BF%E7%BE%BD%E6%AF%9B%E7%90%83%E5%85%B4%E8%B6%A3%E7%8F%AD%E6%8B%9B%E7%94%9F%E6%B5%B7%E6%8A%A5__2025-11-18%2B23_28_44.jpg\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551385942_1.png\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551386073_2.png\"]','2025-11-25 00:30:39',0),(10,'【2025年寒假】足球培训班','【招生限额】每班限额招生30人。\n【开课时长】20天*90分钟/天。\n【课程内容】侧重于球感、传接球、射门等基础技术训练，并介绍足球比赛基本规则。通过分组游戏和模拟比赛场景，培养球员的团队协作意识和足球兴趣。\n【选课提示】报名前，请务必仔细核对所选课程的具体信息，包括:培训地点、开课时间、授课对象年级等，确认无误后再进行下单支付。\n【退款说明】报名缴费后，若需退出培训，可在付款成功之日起三天内，通过线上订单提交退款申请并注明原因，后台客服审核通过后，款项将按原支付路径退回；超过三天，则将无法线上办理，如需退款，请家长携带相关凭证（身份证缴费截图等）亲自前往我中心办理相关手续。\n【咨询电话】0939-5959039；请在【工作日】8:30-11：30，14：30-17:30电话咨询。',2,'2025-11-13 16:26:44','[\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763479270698_%E5%88%9B%E6%84%8F%E6%BC%AB%E7%94%BB%E9%A3%8E%E7%AF%AE%E7%90%83%E5%9F%B9%E8%AE%AD%E6%8B%9B%E7%94%9F%E5%AE%A3%E4%BC%A0%E6%96%B9%E5%BD%A2%E6%B5%B7%E6%8A%A5__2025-11-18%2B23_20_48.jpg\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551332570_1.png\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551332954_2.png\"]','2025-11-25 00:30:17',0),(11,'【2025年寒假】篮球培训班','【招生限额】每班限额招生30人。\n【开课时长】20天*90分钟/天。\n【课程内容】系统学习运球、传球、投篮、防守等基本技术，并融入简单的战术理解和团队配合练习，通过游戏和对抗赛提升球感和实战能力。\n【选课提示】报名前，请务必仔细核对所选课程的具体信息，包括:培训地点、开课时间、授课对象年级等，确认无误后再进行下单支付。\n【退款说明】报名缴费后，若需退出培训，可在付款成功之日起三天内，通过线上订单提交退款申请并注明原因，后台客服审核通过后，款项将按原支付路径退回；超过三天，则将无法线上办理，如需退款，请家长携带相关凭证（身份证缴费截图等）亲自前往我中心办理相关手续。\n【咨询电话】0939-5959039；请在【工作日】8:30-11：30，14：30-17:30电话咨询。',1,'2025-11-16 07:34:08','[\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763478887060_%E5%88%9B%E6%84%8F%E6%BC%AB%E7%94%BB%E9%A3%8E%E7%AF%AE%E7%90%83%E5%9F%B9%E8%AE%AD%E6%8B%9B%E7%94%9F%E5%AE%A3%E4%BC%A0%E6%96%B9%E5%BD%A2%E6%B5%B7%E6%8A%A5__2025-11-18%2B23_12_04.jpg\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551168165_1.png\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551168531_2.png\"]','2025-11-25 00:29:58',0),(12,'【2025年寒假】硬笔书法培训班','【招生限额】每班限额招生30人。\n【开课时长】20天*90分钟/天。\n【课程内容】学习正确的坐姿和执笔方法，训练基本笔画的书写技巧，掌握汉字的结构规律，培养良好的书写习惯，提升书写的美观与工整度。\n【选课提示】报名前，请务必仔细核对所选课程的具体信息，包括:培训地点、开课时间、授课对象年级等，确认无误后再进行下单支付。\n【退款说明】报名缴费后，若需退出培训，可在付款成功之日起三天内，通过线上订单提交退款申请并注明原因，后台客服审核通过后，款项将按原支付路径退回；超过三天，则将无法线上办理，如需退款，请家长携带相关凭证（身份证缴费截图等）亲自前往我中心办理相关手续。\n【咨询电话】0939-5959039；请在【工作日】8:30-11：30，14：30-17:30电话咨询。',10,'2025-11-18 15:31:51','[\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763483363605_%E5%90%88%E6%88%90%E9%A3%8E%E7%A1%AC%E7%AC%94%E4%B9%A6%E6%B3%95%E8%AF%BE%E4%BF%83%E9%94%80%E6%96%B9%E5%BD%A2%E6%B5%B7%E6%8A%A5__2025-11-19%2B00_28_53.jpg\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551548119_1.png\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551548487_2.png\"]','2025-11-25 00:29:40',0),(13,'【2025年寒假】软笔书法培训班','【招生限额】每班限额招生30人。\n【开课时长】20天*90分钟/天。\n【课程内容】了解文房四宝的使用，从执笔、运笔开始，练习中锋、侧锋等基本笔法，临摹经典碑帖，初步感受笔墨变化，培养专注力和审美能力。\n【选课提示】报名前，请务必仔细核对所选课程的具体信息，包括:培训地点、开课时间、授课对象年级等，确认无误后再进行下单支付。\n【退款说明】报名缴费后，若需退出培训，可在付款成功之日起三天内，通过线上订单提交退款申请并注明原因，后台客服审核通过后，款项将按原支付路径退回；超过三天，则将无法线上办理，如需退款，请家长携带相关凭证（身份证缴费截图等）亲自前往我中心办理相关手续。\n【咨询电话】0939-5959039；请在【工作日】8:30-11：30，14：30-17:30电话咨询。',11,'2025-11-18 15:42:58','[\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763480725814_1.jpg\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551143897_1.png\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551144270_2.png\"]','2025-11-25 00:29:10',0),(14,'【2025年寒假】美术(简笔画、素描)培训班','【招生限额】每班限额招生30人。\n【开课时长】20天*90分钟/天。\n【课程内容】简笔画部分学习用简单的线条概括物体形状；素描基础则从观察方法、构图、透视和明暗关系入手，训练基本的造型能力。\n【选课提示】报名前，请务必仔细核对所选课程的具体信息，包括:培训地点、开课时间、授课对象年级等，确认无误后再进行下单支付。\n【退款说明】报名缴费后，若需退出培训，可在付款成功之日起三天内，通过线上订单提交退款申请并注明原因，后台客服审核通过后，款项将按原支付路径退回；超过三天，则将无法线上办理，如需退款，请家长携带相关凭证（身份证缴费截图等）亲自前往我中心办理相关手续。\n【咨询电话】0939-5959039；请在【工作日】8:30-11：30，14：30-17:30电话咨询。',12,'2025-11-18 15:54:01','[\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481306909_1.jpg\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551125140_1.png\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551125514_2.png\"]','2025-11-26 02:59:50',0),(15,'【2025年寒假】中学生声乐培训班','【招生限额】每班限额招生30人。\n【开课时长】20天*90分钟/天。\n【课程内容】学习科学的呼吸方法和发声技巧，进行音准、节奏训练，演唱适合青少年年龄特点的中外歌曲，培养音乐表现力和自信心。\n【选课提示】报名前，请务必仔细核对所选课程的具体信息，包括:培训地点、开课时间、授课对象年级等，确认无误后再进行下单支付。\n【退款说明】报名缴费后，若需退出培训，可在付款成功之日起三天内，通过线上订单提交退款申请并注明原因，后台客服审核通过后，款项将按原支付路径退回；超过三天，则将无法线上办理，如需退款，请家长携带相关凭证（身份证缴费截图等）亲自前往我中心办理相关手续。\n【咨询电话】0939-5959039；请在【工作日】8:30-11：30，14：30-17:30电话咨询。',13,'2025-11-18 16:01:31','[\"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763481738283_1.jpg\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551098098_1.png\", \"https://oss-pai-o3z31qzfhn5wnngkso-cn-shanghai.oss-cn-shanghai.aliyuncs.com/products/1763551105418_2.png\"]','2025-11-26 02:58:20',0);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;

--
-- Table structure for table `recipe_dishes`
--

DROP TABLE IF EXISTS `recipe_dishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_dishes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `recipe_id` int NOT NULL COMMENT '所属菜谱ID',
  `dish_id` int NOT NULL COMMENT '菜品ID',
  `count` int DEFAULT '1' COMMENT '每桌该菜的份数',
  PRIMARY KEY (`id`),
  KEY `recipe_id` (`recipe_id`),
  KEY `dish_id` (`dish_id`),
  CONSTRAINT `recipe_dishes_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `recipe_dishes_ibfk_2` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_dishes`
--

/*!40000 ALTER TABLE `recipe_dishes` DISABLE KEYS */;
INSERT INTO `recipe_dishes` VALUES (34,8,18,1),(35,8,26,1),(36,8,10,1),(38,8,17,1),(39,8,25,1),(41,8,30,1),(42,8,11,1),(43,8,5,1),(44,8,9,1),(45,8,8,1),(46,8,19,1),(47,8,7,1),(49,8,31,1),(50,8,27,1),(51,8,21,1),(53,8,15,1),(54,8,16,1),(55,8,14,1),(56,8,20,1),(57,8,23,1),(58,8,22,1),(59,8,24,1),(60,9,34,1),(61,9,17,1);
/*!40000 ALTER TABLE `recipe_dishes` ENABLE KEYS */;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '菜谱名称',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes`
--

/*!40000 ALTER TABLE `recipes` DISABLE KEYS */;
INSERT INTO `recipes` VALUES (8,'例子','2025-10-26 09:20:14'),(9,'翅中','2025-11-07 14:38:23');
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;

--
-- Table structure for table `system_config`
--

DROP TABLE IF EXISTS `system_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `key_value` text COLLATE utf8mb4_general_ci,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_config`
--

/*!40000 ALTER TABLE `system_config` DISABLE KEYS */;
INSERT INTO `system_config` VALUES (1,'deepseek_api_key','','2025-11-07 07:48:26'),(2,'deepseek_api_key','311213','2025-11-07 07:51:39');
/*!40000 ALTER TABLE `system_config` ENABLE KEYS */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` varchar(50) NOT NULL COMMENT '账号',
  `password` varchar(255) NOT NULL COMMENT '密码（加密或明文）',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2b$12$w.vhqUvmCeINwXFjHQoOK.0P1zgweC5oLbhi0iUPuzX/8cqk5/DLG','2025-10-18 08:35:35'),(2,'123','$2b$10$.qDYLPcjQb7JdLtP8NXGCeneLCEcehyoI/fDE...ARpmOJjZDRrQ6','2025-10-18 09:19:04'),(3,'admin123','$2b$10$R31D33HBCsjXQItAzQjIq.u.HwSIXaYU0n99mgsRISn4t1tCgRKaO','2025-10-21 13:36:15'),(4,'18712716999','$2b$10$pL6iGYWxPEgllCnl/V4jmeumQDMSVuue2uoH76pM6Z3Yid4nb2wnq','2025-10-22 01:19:13'),(5,'admin1234','$2b$10$TXDKuYxZLReJ6/7im0c8/O6d0nfcGLOY3l0G03Sw1DYN8Z3cLes0S','2025-10-22 03:58:37'),(6,'1','$2b$10$5dOiYScUXZnQqdDFPy8WMuSnyhUlts41cS50kij1UhcmyTQy330Di','2025-10-25 08:55:55');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

--
-- Table structure for table `xcx_users`
--

DROP TABLE IF EXISTS `xcx_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `xcx_users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `openid` varchar(64) COLLATE utf8mb4_general_ci NOT NULL COMMENT '微信 openid（唯一）',
  `nickname` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '头像',
  `mobile` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '手机号',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `xcx_users`
--

/*!40000 ALTER TABLE `xcx_users` DISABLE KEYS */;
INSERT INTO `xcx_users` VALUES (1,'o7Alw10wKvtq-bmH3ErbRa1-0CIQ',NULL,NULL,'19802522633','2025-11-25 00:21:16','2025-11-26 12:49:27'),(3,'o7Alw19SEf9vwc8WK6dTsa2BiV-w',NULL,NULL,'12066600001','2025-11-25 00:51:36','2025-11-25 00:51:36'),(4,'o7Alw14Z-T_sr4PJKJPcyq5qfVdI',NULL,NULL,'18011579593','2025-11-25 01:55:37','2025-11-25 11:48:06'),(11,'o7Alw11VxjVpxQhno9rjK_ZHGnq0',NULL,NULL,'7562214847','2025-11-25 02:31:34','2025-11-25 09:24:32'),(12,'o7Alw14IU_aV81G6IFuosFNXaJvg',NULL,NULL,'7562214847','2025-11-25 02:32:39','2025-11-25 02:32:39'),(16,'o7Alw10pSFUiX8koxnjXEAcg2rEA',NULL,NULL,'7562214847','2025-11-25 09:25:37','2025-11-25 09:25:37'),(17,'o7Alw13fPlzoTPQLJSah3sKPFEIk',NULL,NULL,'18089390606','2025-11-25 09:34:36','2025-11-25 09:37:20'),(19,'o7Alw1w22RnhSOlJa-5aQYbtIAlM',NULL,NULL,'19993958285','2025-11-25 09:46:11','2025-11-25 09:46:31'),(21,'o7Alw17LHoQobtP7VoG-moFfKTB8',NULL,NULL,'18693901122','2025-11-25 10:06:56','2025-11-25 10:07:14'),(23,'o7Alw10Q6m-6x_44KDju0I1uh9RI',NULL,NULL,'18189390606','2025-11-25 10:23:55','2025-11-25 10:23:55'),(24,'o7Alw1xqBXfYl4IlyzSBi7a_bI2s',NULL,NULL,'13982911828','2025-11-25 11:44:12','2025-11-25 11:44:12');
/*!40000 ALTER TABLE `xcx_users` ENABLE KEYS */;

--
-- Dumping routines for database 'gin_vue_admin'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 22:09:18
