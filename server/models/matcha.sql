
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(35) NOT NULL,
  `lastName` varchar(35) NOT NULL,
  `username` varchar(20) NOT NULL,
  `email` varchar(60) NOT NULL,
  `isAccountConfirmed` varchar(1) DEFAULT 0,
  `password` varchar(200) NOT NULL,
  `birthday` varchar(10) DEFAULT NULL,
  `city` varchar(60) DEFAULT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `sexualPreferences` char(1) DEFAULT NULL,
  `biography` varchar(200) DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `fameRating` int DEFAULT 0,
  `areTagsAdded` varchar(1) DEFAULT 0,
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
  `uid` int NOT NULL,
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
  `tagID` int NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `matchedUsers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid1` int NOT NULL,
  `uid2` int not NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `visitedProfiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL,
  `visited` int NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
)
