SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `jcore` ;
CREATE SCHEMA IF NOT EXISTS `jcore` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `jcore` ;

-- -----------------------------------------------------
-- Table `Users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Users` ;

CREATE TABLE IF NOT EXISTS `Users` (
  `id` INT NOT NULL,
  `email` VARCHAR(255) NULL,
  `tip_subscript` TINYINT NOT NULL DEFAULT 0,
  `favorites` TEXT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Restaurants`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Restaurants` ;

CREATE TABLE IF NOT EXISTS `Restaurants` (
  `id` INT NOT NULL,
  `filters` TEXT NULL,
  `rating` INT NULL,
  `tip` TEXT NULL,
  `activated` TINYINT NOT NULL DEFAULT 0,
  `changed` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Admins`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Admins` ;

CREATE TABLE IF NOT EXISTS `Admins` (
  `id` INT NOT NULL,
  `email` VARCHAR(255) NULL,
  `username` VARCHAR(45) NULL,
  `password` VARCHAR(45) NULL,
  `role` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Categories`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Categories` ;

CREATE TABLE IF NOT EXISTS `Categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `rest_id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `tip` TEXT NULL,
  PRIMARY KEY (`id`),
  INDEX `rest_id_idx` (`rest_id` ASC),
  CONSTRAINT `rest_id_fk`
    FOREIGN KEY (`rest_id`)
    REFERENCES `Restaurants` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Items`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Items` ;

CREATE TABLE IF NOT EXISTS `Items` (
  `id` INT NOT NULL,
  `cat_id` INT NOT NULL,
  `rating` INT NULL,
  `options` TEXT NULL,
  `activated` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `cat_id_idx` (`cat_id` ASC),
  CONSTRAINT `cat_id_fk`
    FOREIGN KEY (`cat_id`)
    REFERENCES `Categories` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

SET SQL_MODE = '';
GRANT USAGE ON *.* TO sysadminx;
 DROP USER sysadminx;
SET SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
CREATE USER 'sysadminx' IDENTIFIED BY 'banana';

GRANT ALL ON jcore.* TO 'sysadminx';
SET SQL_MODE = '';
GRANT USAGE ON *.* TO adminx;
 DROP USER adminx;
SET SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
CREATE USER 'adminx' IDENTIFIED BY 'banana';

GRANT UPDATE, SELECT, INSERT, DELETE ON TABLE jcore.* TO 'adminx';
SET SQL_MODE = '';
GRANT USAGE ON *.* TO curatorx;
 DROP USER curatorx;
SET SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
CREATE USER 'curatorx' IDENTIFIED BY 'banana';

GRANT UPDATE, SELECT, INSERT, DELETE ON TABLE `jcore`.`Categories` TO 'curatorx';
GRANT DELETE, INSERT, UPDATE, SELECT ON TABLE `jcore`.`Items` TO 'curatorx';
GRANT UPDATE, SELECT, INSERT, DELETE ON TABLE `jcore`.`Restaurants` TO 'curatorx';
GRANT DELETE, UPDATE, SELECT, INSERT ON TABLE `jcore`.`Admins` TO 'curatorx';
SET SQL_MODE = '';
GRANT USAGE ON *.* TO editorx;
 DROP USER editorx;
SET SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';
CREATE USER 'editorx' IDENTIFIED BY 'banana';

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE `jcore`.`Categories` TO 'editorx';
GRANT DELETE, INSERT, UPDATE, SELECT ON TABLE `jcore`.`Items` TO 'editorx';
GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE `jcore`.`Restaurants` TO 'editorx';
GRANT DELETE, SELECT, UPDATE ON TABLE `jcore`.`Admins` TO 'editorx';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `Restaurants`
-- -----------------------------------------------------
START TRANSACTION;
USE `jcore`;
INSERT INTO `Restaurants` (`id`, `filters`, `rating`, `tip`, `activated`, `changed`) VALUES (23865, '\"[\\\"brunch\\\", \\\"lunch\\\"]\" ', 2, '\"When you exercise hard for 90 minutes or more, especially if you\'re doing something at high intensity that takes a lot of endurance, you need a diet that can help you perform at your peak and recover quickly afterward.\"', 1, 0);
INSERT INTO `Restaurants` (`id`, `filters`, `rating`, `tip`, `activated`, `changed`) VALUES (23938, '\"[\\\"lunch\\\", \\\"dinner\\\"]\" ', 1, '\"When you exercise hard for 90 minutes or more, especially if you\'re doing something at high intensity that takes a lot of endurance, you need a diet that can help you perform at your peak and recover quickly afterward.\"', 1, 0);
INSERT INTO `Restaurants` (`id`, `filters`, `rating`, `tip`, `activated`, `changed`) VALUES (23946, '\"[\\\"brunch\\\", \\\"lunch\\\", \\\"dinner\\\"]\" ', 3, '\"When you exercise hard for 90 minutes or more, especially if you\'re doing something at high intensity that takes a lot of endurance, you need a diet that can help you perform at your peak and recover quickly afterward.\"', 1, 0);

COMMIT;


-- -----------------------------------------------------
-- Data for table `Categories`
-- -----------------------------------------------------
START TRANSACTION;
USE `jcore`;
INSERT INTO `Categories` (`id`, `rest_id`, `name`, `tip`) VALUES (NULL, 23865, 'Salads', 'When you exercise hard for 90 minutes or more, especially if you\'re doing something at high intensity that takes a lot of endurance, you need a diet that can help you perform at your peak and recover quickly afterward.');
INSERT INTO `Categories` (`id`, `rest_id`, `name`, `tip`) VALUES (NULL, 23865, 'Entrees', 'When you exercise hard for 90 minutes or more, especially if you\'re doing something at high intensity that takes a lot of endurance, you need a diet that can help you perform at your peak and recover quickly afterward.');
INSERT INTO `Categories` (`id`, `rest_id`, `name`, `tip`) VALUES (NULL, 23865, 'Sides', 'When you exercise hard for 90 minutes or more, especially if you\'re doing something at high intensity that takes a lot of endurance, you need a diet that can help you perform at your peak and recover quickly afterward.');
INSERT INTO `Categories` (`id`, `rest_id`, `name`, `tip`) VALUES (NULL, 23938, 'Salads', 'When you exercise hard for 90 minutes or more, especially if you\'re doing something at high intensity that takes a lot of endurance, you need a diet that can help you perform at your peak and recover quickly afterward.');
INSERT INTO `Categories` (`id`, `rest_id`, `name`, `tip`) VALUES (NULL, 23938, 'Entrees', 'When you exercise hard for 90 minutes or more, especially if you\'re doing something at high intensity that takes a lot of endurance, you need a diet that can help you perform at your peak and recover quickly afterward.');
INSERT INTO `Categories` (`id`, `rest_id`, `name`, `tip`) VALUES (NULL, 23938, 'Sides', 'When you exercise hard for 90 minutes or more, especially if you\'re doing something at high intensity that takes a lot of endurance, you need a diet that can help you perform at your peak and recover quickly afterward.');
INSERT INTO `Categories` (`id`, `rest_id`, `name`, `tip`) VALUES (NULL, 23946, 'Salads', 'When you exercise hard for 90 minutes or more, especially if you\'re doing something at high intensity that takes a lot of endurance, you need a diet that can help you perform at your peak and recover quickly afterward.');
INSERT INTO `Categories` (`id`, `rest_id`, `name`, `tip`) VALUES (NULL, 23946, 'Entrees', 'When you exercise hard for 90 minutes or more, especially if you\'re doing something at high intensity that takes a lot of endurance, you need a diet that can help you perform at your peak and recover quickly afterward.');
INSERT INTO `Categories` (`id`, `rest_id`, `name`, `tip`) VALUES (NULL, 23946, 'Sides', 'When you exercise hard for 90 minutes or more, especially if you\'re doing something at high intensity that takes a lot of endurance, you need a diet that can help you perform at your peak and recover quickly afterward.');

COMMIT;


-- -----------------------------------------------------
-- Data for table `Items`
-- -----------------------------------------------------
START TRANSACTION;
USE `jcore`;
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (19035011, 7, 2, '\"[19035012: [19035014], 19035022: [19035023]]\" ', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (19035025, 7, 1, '\"[19035026: [19035027], 19035036: [19035037]]\" ', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (19035039, 7, 3, '\"[19035040: [19035043], 19035050: [19035051]]\"', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (19035061, 8, 2, '\"[19035062: [19035064], 19035083: [19035084], 19035086: [19035087, 19035088]]\"', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (19035163, 8, 1, '\"[19035164: [19035165]]\"', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (19035429, 8, 3, '\"[19035430: [19035431], 19035433: [19035434], 19035436: [19035437, 19035438], 19035440: [19035441, 19035442, 19035443]]\"', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (19035201, 9, 3, '\"[19035202: [19035203, 19035204]]\"', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (19035206, 9, 1, '\"[19035207: [19035208]]\"', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (19035216, 9, 2, '\"[39237945: [39237946], 19035217: [19035218, 19035220]]\"', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (18916785, 1, 1, NULL, 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (18916778, 1, 2, NULL, 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (18916779, 1, 3, NULL, 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (18916846, 2, 1, '\"[18916847: [18916848]]\"', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (18916854, 2, 2, '\"[18916855: [18916857]]\"', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (18916916, 2, 3, '\"[18916917: [18916919], 33071127: [33071131, 33071132]]\"', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (18916936, 3, 2, '\"[33071303: [33071307]]\"', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (18916938, 3, 1, '\"[33071347: [33071348]]\"', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (18916939, 3, 2, '\"[18916940: [18916943], 33071369: [33071375, 33071376]]\"', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (33586600, 4, 2, '\"[33586601: [33586603], 33586611: [33586612, 33586613]]\"', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (19025900, 4, 1, '\"[19025901: [19025904], 19025911: [19025914, 19025915]]\"', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (19025940, 4, 3, '\"[19025941: [19025945], 19025951: [19025957, 19025958]]\"', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (19026342, 5, 2, '\"[19026343: [32911509], 32911527: [32911528, 32911529]]\"', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (19026382, 5, 1, '\"[19026383: [32911614], 32911633: [32911636]]\"', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (19026422, 5, 2, '\"[19026423: [32911722], 32911739: [32911743, 32911748]]\"', 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (19025848, 6, 1, NULL, 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (19025850, 6, 3, NULL, 1);
INSERT INTO `Items` (`id`, `cat_id`, `rating`, `options`, `activated`) VALUES (19025854, 6, 2, NULL, 1);

COMMIT;

