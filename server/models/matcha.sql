CREATE TABLE IF NOT EXISTS `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `isProfilePicture` bit,
  `image` varbinary(4294967295) NOT NULL,
  `imageExtenison` varchar(7) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(35) NOT NULL,
  `lastname` varchar(35) NOT NULL,
  `username` varchar(20) NOT NULL,
  `email` varchar(60) NOT NULL,
  `isEmailConfirmed` bit DEFAULT 0,
  `password` varchar(200) NOT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `sexualPreferences` char(1) DEFAULT NULL,
  `biography` varchar(200) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);
