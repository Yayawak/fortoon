-- MySQL dump 10.13  Distrib 5.7.24, for osx11.1 (x86_64)
--
-- Host: 127.0.0.1    Database: fortune_db
-- ------------------------------------------------------
-- Server version	8.3.0

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
  `cId` int unsigned NOT NULL AUTO_INCREMENT,
  `storyId` int unsigned NOT NULL,
  PRIMARY KEY (`cId`),
  KEY `Chapter_Story_FK` (`storyId`),
  CONSTRAINT `Chapter_Story_FK` FOREIGN KEY (`storyId`) REFERENCES `Story` (`sId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
  `ciId` int unsigned NOT NULL AUTO_INCREMENT,
  `parentChapterImageId` int unsigned DEFAULT NULL,
  `url` varchar(200) NOT NULL,
  `chapterId` int unsigned NOT NULL,
  PRIMARY KEY (`ciId`),
  KEY `ChapterImage_Chapter_FK` (`chapterId`),
  KEY `ChapterImage_ChapterImage_FK` (`parentChapterImageId`),
  CONSTRAINT `ChapterImage_Chapter_FK` FOREIGN KEY (`chapterId`) REFERENCES `Chapter` (`cId`),
  CONSTRAINT `ChapterImage_ChapterImage_FK` FOREIGN KEY (`parentChapterImageId`) REFERENCES `ChapterImage` (`ciId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
  `fId` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` int unsigned NOT NULL,
  `followerId` int unsigned NOT NULL,
  PRIMARY KEY (`fId`),
  KEY `Relationship_User_FK` (`userId`),
  KEY `Relationship_User_FK_1` (`followerId`),
  CONSTRAINT `Relationship_User_FK` FOREIGN KEY (`userId`) REFERENCES `User` (`uId`),
  CONSTRAINT `Relationship_User_FK_1` FOREIGN KEY (`followerId`) REFERENCES `User` (`uId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
  `lId` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` int unsigned NOT NULL,
  `postId` int unsigned DEFAULT NULL,
  `storyId` int unsigned DEFAULT NULL,
  `isDislike` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`lId`),
  KEY `Like_User_FK` (`userId`),
  KEY `Like_Post_FK` (`postId`),
  KEY `Like_Story_FK` (`storyId`),
  CONSTRAINT `Like_Post_FK` FOREIGN KEY (`postId`) REFERENCES `Post` (`pId`),
  CONSTRAINT `Like_Story_FK` FOREIGN KEY (`storyId`) REFERENCES `Story` (`sId`),
  CONSTRAINT `Like_User_FK` FOREIGN KEY (`userId`) REFERENCES `User` (`uId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
  `pId` int unsigned NOT NULL AUTO_INCREMENT,
  `content` varchar(400) NOT NULL,
  `parentPostId` int unsigned DEFAULT NULL,
  `posterId` int unsigned NOT NULL,
  `postedDatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pId`),
  KEY `Post_Post_FK` (`parentPostId`),
  KEY `Post_User_FK` (`posterId`),
  CONSTRAINT `Post_Post_FK` FOREIGN KEY (`parentPostId`) REFERENCES `Post` (`pId`),
  CONSTRAINT `Post_User_FK` FOREIGN KEY (`posterId`) REFERENCES `User` (`uId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
  `piId` int unsigned NOT NULL AUTO_INCREMENT,
  `parentPostImageId` int unsigned DEFAULT NULL,
  `url` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `postId` int unsigned NOT NULL,
  PRIMARY KEY (`piId`),
  KEY `ChapterImage_ChapterImage_FK` (`parentPostImageId`) USING BTREE,
  KEY `ChapterImage_Chapter_FK` (`postId`) USING BTREE,
  CONSTRAINT `PostImage_Post_FK` FOREIGN KEY (`postId`) REFERENCES `Post` (`pId`),
  CONSTRAINT `PostImage_PostImage_FK` FOREIGN KEY (`parentPostImageId`) REFERENCES `PostImage` (`piId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
  `rId` int unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`rId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
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
  `sId` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `introduction` varchar(500) NOT NULL,
  `postedDatetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `coverImageId` int unsigned NOT NULL,
  `price` int unsigned NOT NULL DEFAULT '0',
  `authorId` int unsigned NOT NULL,
  `coverImageUrl` varchar(200) NOT NULL,
  PRIMARY KEY (`sId`),
  KEY `Story_User_FK` (`authorId`),
  CONSTRAINT `Story_User_FK` FOREIGN KEY (`authorId`) REFERENCES `User` (`uId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Story`
--

LOCK TABLES `Story` WRITE;
/*!40000 ALTER TABLE `Story` DISABLE KEYS */;
/*!40000 ALTER TABLE `Story` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `uId` int unsigned NOT NULL,
  `age` int unsigned NOT NULL,
  `sex` enum('m','f') NOT NULL DEFAULT 'm',
  `credit` int unsigned NOT NULL DEFAULT '0',
  `rankId` int unsigned NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`uId`),
  KEY `User_Rank_FK` (`rankId`),
  CONSTRAINT `User_Rank_FK` FOREIGN KEY (`rankId`) REFERENCES `Rank` (`rId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
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

-- Dump completed on 2024-09-20 21:56:08
