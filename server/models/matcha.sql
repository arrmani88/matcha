CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(35) NOT NULL,
  `lastname` varchar(35) NOT NULL,
  `username` varchar(20) NOT NULL,
  `email` varchar(60) NOT NULL,
  `isEmailConfirmed` bit DEFAULT 0,
  `password` varchar(200) NOT NULL,
  `birthday` varchar(10) DEFAULT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `sexualPreferences` char(1) DEFAULT NULL,
  `biography` varchar(200) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL,
  `isProfileImage` bit,
  `image` varchar(55) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL,
  `imageId` int not NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL,
  `content` varchar(65535) NOT NULL, 
  `imageId` int NOT NULL,
  PRIMARY KEY (id)
);
