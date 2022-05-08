CREATE TABLE IF NOT EXISTS `images` (
  `userId` int NOT NULL,
  `profileImage` varbinary(2),
  `profileImageExtenison` VARCHAR(2),
  `userImages` varbinary(2),
  `userImagesExtensions` varchar(10),
  PRIMARY KEY (userId)
);

CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(35) NOT NULL,
  `lastname` varchar(35) NOT NULL,
  `username` varchar(20) NOT NULL,
  `email` varchar(60) NOT NULL,
  `isEmailConfirmed` bit DEFAULT 0,
  `password` varchar(255) NOT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `sexualPreferences` char(1) DEFAULT NULL,
  `biography` varchar(65535) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);
