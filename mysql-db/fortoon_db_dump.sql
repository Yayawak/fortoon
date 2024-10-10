-- MySQL dump 10.13  Distrib 5.7.44, for Linux (x86_64)
--
-- Host: localhost    Database: fortoon_db
-- ------------------------------------------------------
-- Server version	5.7.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Chapter`
--

DROP TABLE IF EXISTS `Chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Chapter` (
  `name` varchar(100) NOT NULL,
  `cId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `storyId` int(10) unsigned NOT NULL,
  `chapterSequence` int(10) unsigned NOT NULL,
  PRIMARY KEY (`cId`),
  KEY `Chapter_Story_FK` (`storyId`),
  CONSTRAINT `Chapter_Story_FK` FOREIGN KEY (`storyId`) REFERENCES `Story` (`sId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Chapter`
--

LOCK TABLES `Chapter` WRITE;
/*!40000 ALTER TABLE `Chapter` DISABLE KEYS */;
/*!40000 ALTER TABLE `Chapter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ChapterImage`
--

DROP TABLE IF EXISTS `ChapterImage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ChapterImage` (
  `ciId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parentChapterImageId` int(10) unsigned DEFAULT NULL,
  `url` varchar(200) NOT NULL,
  `chapterId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`ciId`),
  KEY `ChapterImage_Chapter_FK` (`chapterId`),
  KEY `ChapterImage_ChapterImage_FK` (`parentChapterImageId`),
  CONSTRAINT `ChapterImage_ChapterImage_FK` FOREIGN KEY (`parentChapterImageId`) REFERENCES `ChapterImage` (`ciId`),
  CONSTRAINT `ChapterImage_Chapter_FK` FOREIGN KEY (`chapterId`) REFERENCES `Chapter` (`cId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ChapterImage`
--

LOCK TABLES `ChapterImage` WRITE;
/*!40000 ALTER TABLE `ChapterImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `ChapterImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Followership`
--

DROP TABLE IF EXISTS `Followership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Followership` (
  `fId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `followerId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`fId`),
  KEY `Relationship_User_FK` (`userId`),
  KEY `Relationship_User_FK_1` (`followerId`),
  CONSTRAINT `Relationship_User_FK` FOREIGN KEY (`userId`) REFERENCES `User` (`uId`),
  CONSTRAINT `Relationship_User_FK_1` FOREIGN KEY (`followerId`) REFERENCES `User` (`uId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Followership`
--

LOCK TABLES `Followership` WRITE;
/*!40000 ALTER TABLE `Followership` DISABLE KEYS */;
/*!40000 ALTER TABLE `Followership` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Like`
--

DROP TABLE IF EXISTS `Like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Like` (
  `lId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `postId` int(10) unsigned DEFAULT NULL,
  `storyId` int(10) unsigned DEFAULT NULL,
  `isDislike` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`lId`),
  KEY `Like_User_FK` (`userId`),
  KEY `Like_Post_FK` (`postId`),
  KEY `Like_Story_FK` (`storyId`),
  CONSTRAINT `Like_Post_FK` FOREIGN KEY (`postId`) REFERENCES `Post` (`pId`),
  CONSTRAINT `Like_Story_FK` FOREIGN KEY (`storyId`) REFERENCES `Story` (`sId`),
  CONSTRAINT `Like_User_FK` FOREIGN KEY (`userId`) REFERENCES `User` (`uId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Like`
--

LOCK TABLES `Like` WRITE;
/*!40000 ALTER TABLE `Like` DISABLE KEYS */;
/*!40000 ALTER TABLE `Like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Post`
--

DROP TABLE IF EXISTS `Post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Post` (
  `title` varchar(50) NOT NULL,
  `pId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `content` varchar(400) NOT NULL,
  `parentPostId` int(10) unsigned DEFAULT NULL,
  `posterId` int(10) unsigned NOT NULL,
  `postedDatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pId`),
  KEY `Post_Post_FK` (`parentPostId`),
  KEY `Post_User_FK` (`posterId`),
  CONSTRAINT `Post_Post_FK` FOREIGN KEY (`parentPostId`) REFERENCES `Post` (`pId`),
  CONSTRAINT `Post_User_FK` FOREIGN KEY (`posterId`) REFERENCES `User` (`uId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Post`
--

LOCK TABLES `Post` WRITE;
/*!40000 ALTER TABLE `Post` DISABLE KEYS */;
/*!40000 ALTER TABLE `Post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PostImage`
--

DROP TABLE IF EXISTS `PostImage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PostImage` (
  `piId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parentPostImageId` int(10) unsigned DEFAULT NULL,
  `url` varchar(200) NOT NULL,
  `postId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`piId`),
  KEY `ChapterImage_ChapterImage_FK` (`parentPostImageId`) USING BTREE,
  KEY `ChapterImage_Chapter_FK` (`postId`) USING BTREE,
  CONSTRAINT `PostImage_PostImage_FK` FOREIGN KEY (`parentPostImageId`) REFERENCES `PostImage` (`piId`),
  CONSTRAINT `PostImage_Post_FK` FOREIGN KEY (`postId`) REFERENCES `Post` (`pId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PostImage`
--

LOCK TABLES `PostImage` WRITE;
/*!40000 ALTER TABLE `PostImage` DISABLE KEYS */;
/*!40000 ALTER TABLE `PostImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Rank`
--

DROP TABLE IF EXISTS `Rank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Rank` (
  `name` varchar(100) NOT NULL,
  `rId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`rId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rank`
--

LOCK TABLES `Rank` WRITE;
/*!40000 ALTER TABLE `Rank` DISABLE KEYS */;
INSERT INTO `Rank` VALUES ('casual',1),('exclusive',2),('vip',3);
/*!40000 ALTER TABLE `Rank` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Story`
--

DROP TABLE IF EXISTS `Story`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Story` (
  `sId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `introduction` varchar(500) NOT NULL,
  `postedDatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `price` int(10) unsigned NOT NULL DEFAULT '0',
  `authorId` int(10) unsigned NOT NULL,
  `coverImageUrl` varchar(200) NOT NULL,
  PRIMARY KEY (`sId`),
  KEY `Story_User_FK` (`authorId`),
  CONSTRAINT `Story_User_FK` FOREIGN KEY (`authorId`) REFERENCES `User` (`uId`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Story`
--

LOCK TABLES `Story` WRITE;
/*!40000 ALTER TABLE `Story` DISABLE KEYS */;
INSERT INTO `Story` VALUES (1,'Solo Leveling Ragnarok','[จากสตูดิโอ Redice ผู้สร้าง !] การดำรงอยู่ของโลกกำลังตกอยู่ในอันตรายอีกครั้ง เมื่ออิทาริมเทพเจ้าจากจักรวาลอื่น พยายามจะเติมเต็มความว่างเปล่าที่สิ่งมีชีวิตสมบูรณ์ทิ้งไว้ ซองจินอูไม่มีทางเลือกอื่นนอกจากต้องส่งเบรู ราชามดเงา ไปปลุกพลังของลูกชายของเขาและเริ่มต้นการเดินทางที่เขาเคยย่ำมาก่อน ซูโฮต้องพิชิตดันเจี้ยนเงาและพิสูจน์ตัวเองในโลกแห่งฮันเตอร์ในขณะที่เขาเดินทางผ่านโลกใหม่เพื่อต่อสู้กับปีศาจร้ายตัวใหม่ที่ต้องการกลืนกินโลกทั้งใบ','2024-09-26 15:19:00',0,1,'www.xxx.com'),(2,'Solo Leveling Ragnarok','[จากสตูดิโอ Redice ผู้สร้าง !] การดำรงอยู่ของโลกกำลังตกอยู่ในอันตรายอีกครั้ง เมื่ออิทาริมเทพเจ้าจากจักรวาลอื่น พยายามจะเติมเต็มความว่างเปล่าที่สิ่งมีชีวิตสมบูรณ์ทิ้งไว้ ซองจินอูไม่มีทางเลือกอื่นนอกจากต้องส่งเบรู ราชามดเงา ไปปลุกพลังของลูกชายของเขาและเริ่มต้นการเดินทางที่เขาเคยย่ำมาก่อน ซูโฮต้องพิชิตดันเจี้ยนเงาและพิสูจน์ตัวเองในโลกแห่งฮันเตอร์ในขณะที่เขาเดินทางผ่านโลกใหม่เพื่อต่อสู้กับปีศาจร้ายตัวใหม่ที่ต้องการกลืนกินโลกทั้งใบ','2024-09-26 15:19:49',0,1,'Solo-Leveling-Ragnarok_Cover.png'),(3,'Solo Leveling Ragnarok','[จากสตูดิโอ Redice ผู้สร้าง !] การดำรงอยู่ของโลกกำลังตกอยู่ในอันตรายอีกครั้ง เมื่ออิทาริมเทพเจ้าจากจักรวาลอื่น พยายามจะเติมเต็มความว่างเปล่าที่สิ่งมีชีวิตสมบูรณ์ทิ้งไว้ ซองจินอูไม่มีทางเลือกอื่นนอกจากต้องส่งเบรู ราชามดเงา ไปปลุกพลังของลูกชายของเขาและเริ่มต้นการเดินทางที่เขาเคยย่ำมาก่อน ซูโฮต้องพิชิตดันเจี้ยนเงาและพิสูจน์ตัวเองในโลกแห่งฮันเตอร์ในขณะที่เขาเดินทางผ่านโลกใหม่เพื่อต่อสู้กับปีศาจร้ายตัวใหม่ที่ต้องการกลืนกินโลกทั้งใบ','2024-09-26 15:21:18',0,1,'Solo-Leveling-Ragnarok_Cover.png'),(4,'Solo Leveling Ragnarok','[จากสตูดิโอ Redice ผู้สร้าง !] การดำรงอยู่ของโลกกำลังตกอยู่ในอันตรายอีกครั้ง เมื่ออิทาริมเทพเจ้าจากจักรวาลอื่น พยายามจะเติมเต็มความว่างเปล่าที่สิ่งมีชีวิตสมบูรณ์ทิ้งไว้ ซองจินอูไม่มีทางเลือกอื่นนอกจากต้องส่งเบรู ราชามดเงา ไปปลุกพลังของลูกชายของเขาและเริ่มต้นการเดินทางที่เขาเคยย่ำมาก่อน ซูโฮต้องพิชิตดันเจี้ยนเงาและพิสูจน์ตัวเองในโลกแห่งฮันเตอร์ในขณะที่เขาเดินทางผ่านโลกใหม่เพื่อต่อสู้กับปีศาจร้ายตัวใหม่ที่ต้องการกลืนกินโลกทั้งใบ','2024-09-26 15:24:57',0,1,'Solo-Leveling-Ragnarok_Cover.png'),(5,'Solo Leveling Ragnarok','[จากสตูดิโอ Redice ผู้สร้าง !] การดำรงอยู่ของโลกกำลังตกอยู่ในอันตรายอีกครั้ง เมื่ออิทาริมเทพเจ้าจากจักรวาลอื่น พยายามจะเติมเต็มความว่างเปล่าที่สิ่งมีชีวิตสมบูรณ์ทิ้งไว้ ซองจินอูไม่มีทางเลือกอื่นนอกจากต้องส่งเบรู ราชามดเงา ไปปลุกพลังของลูกชายของเขาและเริ่มต้นการเดินทางที่เขาเคยย่ำมาก่อน ซูโฮต้องพิชิตดันเจี้ยนเงาและพิสูจน์ตัวเองในโลกแห่งฮันเตอร์ในขณะที่เขาเดินทางผ่านโลกใหม่เพื่อต่อสู้กับปีศาจร้ายตัวใหม่ที่ต้องการกลืนกินโลกทั้งใบ','2024-09-26 15:25:55',0,1,'Solo-Leveling-Ragnarok_Cover.png'),(6,'Solo Leveling Ragnarok','[จากสตูดิโอ Redice ผู้สร้าง !] การดำรงอยู่ของโลกกำลังตกอยู่ในอันตรายอีกครั้ง เมื่ออิทาริมเทพเจ้าจากจักรวาลอื่น พยายามจะเติมเต็มความว่างเปล่าที่สิ่งมีชีวิตสมบูรณ์ทิ้งไว้ ซองจินอูไม่มีทางเลือกอื่นนอกจากต้องส่งเบรู ราชามดเงา ไปปลุกพลังของลูกชายของเขาและเริ่มต้นการเดินทางที่เขาเคยย่ำมาก่อน ซูโฮต้องพิชิตดันเจี้ยนเงาและพิสูจน์ตัวเองในโลกแห่งฮันเตอร์ในขณะที่เขาเดินทางผ่านโลกใหม่เพื่อต่อสู้กับปีศาจร้ายตัวใหม่ที่ต้องการกลืนกินโลกทั้งใบ','2024-09-26 15:26:20',0,1,'Solo-Leveling-Ragnarok_Cover.png'),(7,'Solo Leveling Ragnarok','[จากสตูดิโอ Redice ผู้สร้าง !] การดำรงอยู่ของโลกกำลังตกอยู่ในอันตรายอีกครั้ง เมื่ออิทาริมเทพเจ้าจากจักรวาลอื่น พยายามจะเติมเต็มความว่างเปล่าที่สิ่งมีชีวิตสมบูรณ์ทิ้งไว้ ซองจินอูไม่มีทางเลือกอื่นนอกจากต้องส่งเบรู ราชามดเงา ไปปลุกพลังของลูกชายของเขาและเริ่มต้นการเดินทางที่เขาเคยย่ำมาก่อน ซูโฮต้องพิชิตดันเจี้ยนเงาและพิสูจน์ตัวเองในโลกแห่งฮันเตอร์ในขณะที่เขาเดินทางผ่านโลกใหม่เพื่อต่อสู้กับปีศาจร้ายตัวใหม่ที่ต้องการกลืนกินโลกทั้งใบ','2024-09-26 15:26:30',0,1,'folder structure.png'),(8,'Solo Leveling Ragnarok','[จากสตูดิโอ Redice ผู้สร้าง !] การดำรงอยู่ของโลกกำลังตกอยู่ในอันตรายอีกครั้ง เมื่ออิทาริมเทพเจ้าจากจักรวาลอื่น พยายามจะเติมเต็มความว่างเปล่าที่สิ่งมีชีวิตสมบูรณ์ทิ้งไว้ ซองจินอูไม่มีทางเลือกอื่นนอกจากต้องส่งเบรู ราชามดเงา ไปปลุกพลังของลูกชายของเขาและเริ่มต้นการเดินทางที่เขาเคยย่ำมาก่อน ซูโฮต้องพิชิตดันเจี้ยนเงาและพิสูจน์ตัวเองในโลกแห่งฮันเตอร์ในขณะที่เขาเดินทางผ่านโลกใหม่เพื่อต่อสู้กับปีศาจร้ายตัวใหม่ที่ต้องการกลืนกินโลกทั้งใบ','2024-09-26 15:32:42',0,1,'folder structure.png'),(9,'Solo Leveling Ragnarok','[จากสตูดิโอ Redice ผู้สร้าง !] การดำรงอยู่ของโลกกำลังตกอยู่ในอันตรายอีกครั้ง เมื่ออิทาริมเทพเจ้าจากจักรวาลอื่น พยายามจะเติมเต็มความว่างเปล่าที่สิ่งมีชีวิตสมบูรณ์ทิ้งไว้ ซองจินอูไม่มีทางเลือกอื่นนอกจากต้องส่งเบรู ราชามดเงา ไปปลุกพลังของลูกชายของเขาและเริ่มต้นการเดินทางที่เขาเคยย่ำมาก่อน ซูโฮต้องพิชิตดันเจี้ยนเงาและพิสูจน์ตัวเองในโลกแห่งฮันเตอร์ในขณะที่เขาเดินทางผ่านโลกใหม่เพื่อต่อสู้กับปีศาจร้ายตัวใหม่ที่ต้องการกลืนกินโลกทั้งใบ','2024-09-26 15:34:15',0,1,'folder structure.png'),(10,'Solo Leveling Ragnarok','[จากสตูดิโอ Redice ผู้สร้าง !] การดำรงอยู่ของโลกกำลังตกอยู่ในอันตรายอีกครั้ง เมื่ออิทาริมเทพเจ้าจากจักรวาลอื่น พยายามจะเติมเต็มความว่างเปล่าที่สิ่งมีชีวิตสมบูรณ์ทิ้งไว้ ซองจินอูไม่มีทางเลือกอื่นนอกจากต้องส่งเบรู ราชามดเงา ไปปลุกพลังของลูกชายของเขาและเริ่มต้นการเดินทางที่เขาเคยย่ำมาก่อน ซูโฮต้องพิชิตดันเจี้ยนเงาและพิสูจน์ตัวเองในโลกแห่งฮันเตอร์ในขณะที่เขาเดินทางผ่านโลกใหม่เพื่อต่อสู้กับปีศาจร้ายตัวใหม่ที่ต้องการกลืนกินโลกทั้งใบ','2024-09-26 15:43:32',0,1,'folder structure.png'),(11,'Solo Leveling Ragnarok','[จากสตูดิโอ Redice ผู้สร้าง !] การดำรงอยู่ของโลกกำลังตกอยู่ในอันตรายอีกครั้ง เมื่ออิทาริมเทพเจ้าจากจักรวาลอื่น พยายามจะเติมเต็มความว่างเปล่าที่สิ่งมีชีวิตสมบูรณ์ทิ้งไว้ ซองจินอูไม่มีทางเลือกอื่นนอกจากต้องส่งเบรู ราชามดเงา ไปปลุกพลังของลูกชายของเขาและเริ่มต้นการเดินทางที่เขาเคยย่ำมาก่อน ซูโฮต้องพิชิตดันเจี้ยนเงาและพิสูจน์ตัวเองในโลกแห่งฮันเตอร์ในขณะที่เขาเดินทางผ่านโลกใหม่เพื่อต่อสู้กับปีศาจร้ายตัวใหม่ที่ต้องการกลืนกินโลกทั้งใบ','2024-09-26 15:44:01',0,1,'folder structure.png'),(12,'Solo Leveling Ragnarok','[จากสตูดิโอ Redice ผู้สร้าง !] การดำรงอยู่ของโลกกำลังตกอยู่ในอันตรายอีกครั้ง เมื่ออิทาริมเทพเจ้าจากจักรวาลอื่น พยายามจะเติมเต็มความว่างเปล่าที่สิ่งมีชีวิตสมบูรณ์ทิ้งไว้ ซองจินอูไม่มีทางเลือกอื่นนอกจากต้องส่งเบรู ราชามดเงา ไปปลุกพลังของลูกชายของเขาและเริ่มต้นการเดินทางที่เขาเคยย่ำมาก่อน ซูโฮต้องพิชิตดันเจี้ยนเงาและพิสูจน์ตัวเองในโลกแห่งฮันเตอร์ในขณะที่เขาเดินทางผ่านโลกใหม่เพื่อต่อสู้กับปีศาจร้ายตัวใหม่ที่ต้องการกลืนกินโลกทั้งใบ','2024-09-26 15:45:55',0,1,'folder structure.png'),(13,'Solo Leveling Ragnarok','[จากสตูดิโอ Redice ผู้สร้าง !] การดำรงอยู่ของโลกกำลังตกอยู่ในอันตรายอีกครั้ง เมื่ออิทาริมเทพเจ้าจากจักรวาลอื่น พยายามจะเติมเต็มความว่างเปล่าที่สิ่งมีชีวิตสมบูรณ์ทิ้งไว้ ซองจินอูไม่มีทางเลือกอื่นนอกจากต้องส่งเบรู ราชามดเงา ไปปลุกพลังของลูกชายของเขาและเริ่มต้นการเดินทางที่เขาเคยย่ำมาก่อน ซูโฮต้องพิชิตดันเจี้ยนเงาและพิสูจน์ตัวเองในโลกแห่งฮันเตอร์ในขณะที่เขาเดินทางผ่านโลกใหม่เพื่อต่อสู้กับปีศาจร้ายตัวใหม่ที่ต้องการกลืนกินโลกทั้งใบ','2024-09-26 15:46:09',0,1,'folder structure.png'),(14,'Solo Leveling Ragnarok','[จากสตูดิโอ Redice ผู้สร้าง !] การดำรงอยู่ของโลกกำลังตกอยู่ในอันตรายอีกครั้ง เมื่ออิทาริมเทพเจ้าจากจักรวาลอื่น พยายามจะเติมเต็มความว่างเปล่าที่สิ่งมีชีวิตสมบูรณ์ทิ้งไว้ ซองจินอูไม่มีทางเลือกอื่นนอกจากต้องส่งเบรู ราชามดเงา ไปปลุกพลังของลูกชายของเขาและเริ่มต้นการเดินทางที่เขาเคยย่ำมาก่อน ซูโฮต้องพิชิตดันเจี้ยนเงาและพิสูจน์ตัวเองในโลกแห่งฮันเตอร์ในขณะที่เขาเดินทางผ่านโลกใหม่เพื่อต่อสู้กับปีศาจร้ายตัวใหม่ที่ต้องการกลืนกินโลกทั้งใบ','2024-09-26 15:46:37',0,1,'blue_galaxy.jpg'),(15,'Solo Leveling Ragnarok','[จากสตูดิโอ Redice ผู้สร้าง !] การดำรงอยู่ของโลกกำลังตกอยู่ในอันตรายอีกครั้ง เมื่ออิทาริมเทพเจ้าจากจักรวาลอื่น พยายามจะเติมเต็มความว่างเปล่าที่สิ่งมีชีวิตสมบูรณ์ทิ้งไว้ ซองจินอูไม่มีทางเลือกอื่นนอกจากต้องส่งเบรู ราชามดเงา ไปปลุกพลังของลูกชายของเขาและเริ่มต้นการเดินทางที่เขาเคยย่ำมาก่อน ซูโฮต้องพิชิตดันเจี้ยนเงาและพิสูจน์ตัวเองในโลกแห่งฮันเตอร์ในขณะที่เขาเดินทางผ่านโลกใหม่เพื่อต่อสู้กับปีศาจร้ายตัวใหม่ที่ต้องการกลืนกินโลกทั้งใบ','2024-10-06 15:46:09',0,1,'blue_galaxy.jpg'),(16,'Solo Leveling Ragnarok','[จากสตูดิโอ Redice ผู้สร้าง !] การดำรงอยู่ของโลกกำลังตกอยู่ในอันตรายอีกครั้ง เมื่ออิทาริมเทพเจ้าจากจักรวาลอื่น พยายามจะเติมเต็มความว่างเปล่าที่สิ่งมีชีวิตสมบูรณ์ทิ้งไว้ ซองจินอูไม่มีทางเลือกอื่นนอกจากต้องส่งเบรู ราชามดเงา ไปปลุกพลังของลูกชายของเขาและเริ่มต้นการเดินทางที่เขาเคยย่ำมาก่อน ซูโฮต้องพิชิตดันเจี้ยนเงาและพิสูจน์ตัวเองในโลกแห่งฮันเตอร์ในขณะที่เขาเดินทางผ่านโลกใหม่เพื่อต่อสู้กับปีศาจร้ายตัวใหม่ที่ต้องการกลืนกินโลกทั้งใบ','2024-10-07 07:02:22',0,1,'blue_galaxy.jpg');
/*!40000 ALTER TABLE `Story` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `uId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `age` int(10) unsigned NOT NULL,
  `sex` enum('m','f') NOT NULL DEFAULT 'm',
  `credit` int(10) unsigned NOT NULL DEFAULT '0',
  `rankId` int(10) unsigned NOT NULL,
  `password` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `registeredDatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `displayName` varchar(100) NOT NULL,
  `profilePicUrl` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`uId`),
  KEY `User_Rank_FK` (`rankId`),
  CONSTRAINT `User_Rank_FK` FOREIGN KEY (`rankId`) REFERENCES `Rank` (`rId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,22,'m',0,1,'kty','username','mailser','2024-09-20 15:12:45','kagi','cog.png');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-10  8:34:03
