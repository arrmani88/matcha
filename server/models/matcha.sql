CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(35) NOT NULL,
  `lastname` varchar(35) NOT NULL,
  `username` varchar(20) NOT NULL,
  `email` varchar(60) NOT NULL,
  `isAccountConfirmed` varchar(1) DEFAULT 0,
  `password` varchar(200) NOT NULL,
  `birthday` varchar(10) DEFAULT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `sexualPreferences` char(1) DEFAULT NULL,
  `biography` varchar(200) DEFAULT NULL,
  `areTagsAdded` varchar(1) DEFAULT 0,
  `fameRating` int DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL,
  `isProfileImage` varchar(1) DEFAULT 0,
  `image` varchar(55) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `likerID` int NOT NULL,
  `likedID` int not NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `blocks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL,
  `blockedID` int not NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `usersTags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL,
  `tagId` int NOT NULL,
  PRIMARY KEY (id)
);
