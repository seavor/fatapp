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
  `tip_subscript` BIT NOT NULL DEFAULT 0,
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
  `activated` BIT NOT NULL DEFAULT 0,
  `changed` BIT NOT NULL DEFAULT 0,
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
  `id` INT NOT NULL,
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
  `activated` BIT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `cat_id_idx` (`cat_id` ASC),
  CONSTRAINT `cat_id_fk`
    FOREIGN KEY (`cat_id`)
    REFERENCES `Categories` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Test`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Test` ;

CREATE TABLE IF NOT EXISTS `Test` (
  `fjsf` INT NOT NULL,
  PRIMARY KEY (`fjsf`))
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
