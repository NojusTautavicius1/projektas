-- Railway Database Import
-- Ready to use with Railway MySQL

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `activity_log`;
CREATE TABLE `activity_log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(100) DEFAULT NULL,
  `entity_id` int(10) unsigned DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `activity_log` VALUES (1,5,'nojustautavicius007@gmail.com','LOGIN',NULL,NULL,'User logged in successfully','127.0.0.1','2026-01-23 10:31:13'),(2,5,'nojustautavicius007@gmail.com','LOGIN',NULL,NULL,'User logged in successfully','127.0.0.1','2026-02-27 09:14:35');

DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `contact_messages` VALUES (1,'Nojus Tautavicius','nojustautavicius007@gmail.com','aedfegegwser',0,'2026-01-23 11:38:32'),(2,'nojustautavicius007','nojustautavicius007@gmail.com','labas',0,'2026-02-27 09:14:46');

DROP TABLE IF EXISTS `content_sections`;
CREATE TABLE `content_sections` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `section` varchar(100) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `section` (`section`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `content_sections` VALUES (1,'hero_main','Nojus Tautavicius','Building digital experiences that merge creativity with thoughtful engineering',NULL,'{\"subtitle\": \"Creative Developer\", \"initials\": \"NT\"}','2026-01-23 10:24:19','2026-01-23 10:24:19'),(2,'about_me','About Me','I create polished, production-ready digital products with a focus on clarity, reliability, and craft. My background spans design and engineering, which helps me bridge the gap between visual quality and technical excellence.','/images/content/content-1769167652445-723238997.png','{}','2026-01-23 10:24:19','2026-01-23 11:27:32'),(3,'selected_work','Selected Work','A selection of projects demonstrating practical, production-ready solutions.',NULL,NULL,'2026-01-23 10:24:19','2026-01-23 10:24:19'),(4,'skills_section','Skills & Expertise','Technologies and tools used to craft reliable products',NULL,NULL,'2026-01-23 10:24:19','2026-01-23 10:24:19'),(5,'skills_frontend','Frontend Development','',NULL,'{\"skills\":[\"React\",\"TypeScript\",\"Next.js\",\"Tailwind CSS\",\"Motion\"]}','2026-01-23 10:24:19','2026-01-23 11:11:33'),(6,'skills_backend','Backend Development','',NULL,'{\"skills\":[\"Node.js\",\"Python\",\"SQL\",\"MongoDB\"]}','2026-01-23 10:24:19','2026-01-23 11:11:07'),(7,'skills_mobile','Mobile Development','',NULL,'{\"skills\":[\"React Native\",\"Flutter\"]}','2026-01-23 10:24:19','2026-01-23 11:11:48'),(8,'skills_design','Design','',NULL,'{\"skills\":[\"Figma\",\"UI/UX\",\"Prototyping\",\"Design Systems\"]}','2026-01-23 10:24:19','2026-01-23 11:11:18'),(9,'skills_devops','Cloud & DevOps','',NULL,'{\"skills\":[\"Docker\",\"CI/CD\",\"Vercel\"]}','2026-01-23 10:24:19','2026-01-23 11:11:27'),(10,'skills_other','Other Skills','',NULL,'{\"skills\":[\"Git\",\"Agile\",\"Testing\",\"Performance\",\"Accessibility\"]}','2026-01-23 10:24:19','2026-01-23 11:11:55'),(11,'experience','Experience','',NULL,'{\"timeline\": [{\"year\": \"2024 - 2026\", \"role\": \"Learning JavaScript\", \"company\": \"KTMC\", \"description\": \"Studying modern JavaScript frameworks and full-stack development\"}]}','2026-01-23 10:24:19','2026-01-23 10:24:19'),(12,'contact_section','Get In Touch','Have a project in mind or want to collaborate? Feel free to reach out.',NULL,NULL,'2026-01-23 10:24:19','2026-01-23 10:24:19');

DROP TABLE IF EXISTS `feature_boxes`;
CREATE TABLE `feature_boxes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `section` varchar(100) NOT NULL,
  `label` varchar(255) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `feature_boxes` VALUES (1,'about_features','Clean Code','Code2','Writing maintainable and scalable code',0,'2026-01-23 10:24:19','2026-01-23 10:24:19'),(2,'about_features','Design','Palette','Creating beautiful user experiences',1,'2026-01-23 10:24:19','2026-01-23 10:24:19'),(3,'about_features','Performance','Zap','Optimizing for speed and efficiency',2,'2026-01-23 10:24:19','2026-01-23 10:24:19'),(4,'projects_features','Full Stack','Layers','End-to-end application development',0,'2026-01-23 10:24:19','2026-01-23 10:24:19'),(5,'projects_features','Modern Stack','Rocket','Using latest technologies and frameworks',1,'2026-01-23 10:24:19','2026-01-23 10:24:19'),(6,'projects_features','Responsive','Smartphone','Works perfectly on all devices',2,'2026-01-23 10:24:19','2026-01-23 10:24:19'),(7,'skills_features','Frontend Expert','Code','React, TypeScript, Next.js',0,'2026-01-23 10:24:19','2026-01-23 10:24:19'),(8,'skills_features','Backend Pro','Database','Node.js, Python, SQL',1,'2026-01-23 10:24:19','2026-01-23 10:24:19'),(9,'skills_features','DevOps','Cloud','Docker, AWS, CI/CD',2,'2026-01-23 10:24:19','2026-01-23 10:24:19'),(10,'experience_features','2024 - 2026','Clock','Learning JavaScript at KTMC',0,'2026-01-23 10:24:19','2026-01-23 10:24:19'),(11,'experience_features','Full Stack','Layers','Modern web development',1,'2026-01-23 10:24:19','2026-01-23 10:24:19'),(12,'experience_features','Student Projects','Briefcase','Building real applications',2,'2026-01-23 10:24:19','2026-01-23 10:24:19');

DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `demo_url` varchar(500) DEFAULT NULL,
  `github_url` varchar(500) DEFAULT NULL,
  `tags` varchar(500) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 0,
  `publish_date` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `projects` VALUES (1,'Calculator','Modern design calculator with dark and light theme toggle. Implements all basic mathematical operations with beautiful animated UI.','/images/projects/project-1769163901406-50285141.png','/projektas/skaiciuotuvas/index.html','https://github.com/NojusTautavicius1/AtsiskaitomiejiDarbai/tree/master/skaiciuotuvas','JavaScript,HTML5,CSS3,Animations','Frontend',1,'2026-01-20 00:00:00'),(2,'Calendar Generator','Dynamic calendar generator with JavaScript. Automatically generates calendar for any year and month with weekdays and full functionality.','/images/projects/project-1769165359426-420697133.png','/projektas/kalendorius/kalendorius.html','https://github.com/NojusTautavicius1/AtsiskaitomiejiDarbai/tree/master/kalendorius','JavaScript,DOM,Date API','Frontend',2,'2026-01-21 00:00:00'),(3,'Express CRUD System','Full-stack address management system with MySQL database. Implements complete CRUD functionality, MVC architecture and RESTful API.','/images/projects/project-1769165662708-635348042.png',NULL,'https://github.com/NojusTautavicius1/AtsiskaitomiejiDarbai/tree/master/express_crud_adresai','Node.js,Express,MySQL,EJS,REST API','Full Stack',3,'2026-01-21 00:00:00'),(4,'React Learning App','React learning project with component architecture and modern hooks. Practical React.js demonstration.','/images/projects/project-1769166153713-781656743.png',NULL,'https://github.com/NojusTautavicius1/AtsiskaitomiejiDarbai/tree/master/reactas','React,JSX,Components,Hooks','Frontend',4,'2026-01-21 00:00:00'),(5,'Text Processing System','JavaScript application for text processing - string manipulation, search, replacement and formatting. Various algorithms for text analysis.','/images/projects/project-1769166458817-394779570.png','/projektas/Tekstoapdorojimas/index.html','https://github.com/NojusTautavicius1/AtsiskaitomiejiDarbai/tree/master/Tekstoapdorojimas','JavaScript,String Methods,Algorithms','Frontend',5,'2026-01-22 00:00:00'),(6,'Portfolio CMS','This portfolio project with admin panel and full-stack architecture. Implements content management, authentication, and dynamic content.','/images/projects/project-1769166622075-102421369.png','http://localhost:5173','https://github.com/NojusTautavicius1/AtsiskaitomiejiDarbai/tree/master/projektas','React,Node.js,MySQL,JWT,Vite','Full Stack',6,'2026-01-20 00:00:00'),(7,'Weather App','A modern and functional web platform built with web programming technologies. Features convenient design, clear navigation and showcases my programming skills and creativity.','/images/projects/project-1772182031407-591097393.png','/orai/Kodo-virtuozai-2026-main/orai-lietuvoje/index.html','https://github.com/NojusTautavicius1/Kodo-virtuozai-2026',NULL,'Full Stack',0,'2026-02-27 10:47:11');

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `status` tinyint(3) unsigned NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `nickname` (`nickname`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` VALUES (1,'admin@example.com','admin_user','$2a$10$KCTbNN5SNywrBspe0a0MO.B1M4rLShTDGUsetLdh6CVpjttygayga','admin',1,'2026-01-23 10:24:19'),(2,'user@example.com','user_one','$2a$10$KCTbNN5SNywrBspe0a0MO.B1M4rLShTDGUsetLdh6CVpjttygayga','user',1,'2026-01-23 10:24:19'),(3,'user2@example.com','user_two','$2a$10$KCTbNN5SNywrBspe0a0MO.B1M4rLShTDGUsetLdh6CVpjttygayga','user',1,'2026-01-23 10:24:19'),(4,'user3@example.com','user_three','$2a$10$KCTbNN5SNywrBspe0a0MO.B1M4rLShTDGUsetLdh6CVpjttygayga','user',0,'2026-01-23 10:24:19'),(5,'nojustautavicius007@gmail.com','nojus','$2b$10$ugqj70MCUk0b2EsMbvKn5O/ASEliTYUETUzU0EpcRBeINHxwP0maG','admin',1,'2026-01-23 10:31:05');

COMMIT;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
