-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 17, 2025 at 05:00 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `blacklistdb`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `search_blacklist` (IN `cccd_input` VARCHAR(20), IN `fullname_input` VARCHAR(255), IN `checked_by_id` INT)   BEGIN	
    DECLARE found INT DEFAULT 0;
    DECLARE violation_detail TEXT DEFAULT 'N/A';
    DECLARE user_fullname VARCHAR(100) DEFAULT 'Unknown';
    DECLARE cccd_detail varchar(12) DEFAULT 'N/A';
    DECLARE fullname_detail varchar(100) DEFAULT 'Unknown';
    DECLARE company_detail varchar(255) DEFAULT 'Unknown';
    DECLARE penalty_start_detail date;
    DECLARE penalty_end_detail date;
    DECLARE created_at_detail date;
    DECLARE note_detail text DEFAULT 'N/A';

    -- Kiểm tra xem checked_by_id có tồn tại trong bảng users không
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = checked_by_id) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: checked_by_id không tồn tại trong bảng users';
    END IF;

    -- Lấy fullname của user từ bảng users
    SELECT fullname INTO user_fullname FROM users WHERE id = checked_by_id LIMIT 1;

    -- Kiểm tra xem có dữ liệu trong blacklist không
    SET found = (SELECT COUNT(*) FROM blacklist WHERE cccd = cccd_input OR fullname = fullname_input);

    -- Nếu có dữ liệu thì lấy thông tin vi phạm
    IF found > 0 THEN
        SELECT IFNULL(violation, 'N/A'), IFNULL(cccd, cccd_detail), IFNULL(fullname, fullname_detail),
        IFNULL(company, 'Unknown'), IFNULL(penalty_start, ''), IFNULL(penalty_end, ''),
        IFNULL( created_at, ''), IFNULL(note, 'N/A')
        INTO violation_detail, cccd_detail, fullname_detail, company_detail, penalty_start_detail,
        penalty_end_detail, created_at_detail, note_detail
        FROM blacklist 
        WHERE cccd = cccd_input OR fullname = fullname_input
        LIMIT 1;
	ELSE
    	SET cccd_detail = cccd_input;
        SET fullname_detail = fullname_input;
        SET company_detail = 'Unknown';
        SET penalty_start_detail = NULL;
        SET penalty_end_detail = NULL;
        SET note_detail = 'N/A';
    END IF;
    
    -- Chèn vào logs (dùng checked_by_id thay vì fullname)
    INSERT INTO logs (cccd, fullname, result, violation_detail, checked_at, checked_by)
    VALUES (
        cccd_detail,
        fullname_detail,
        IF(found > 0, 'Blacklist', 'Allowed'),
        violation_detail,
        NOW(), -- Lưu timestamp
        checked_by_id
    );

    -- Trả về kết quả search
    SELECT cccd, fullname, company, violation, penalty_start, penalty_end, user_fullname as checked_by, created_at, note, IF(found > 0, 'Blacklist', 'Allowed') AS result
    FROM blacklist
    WHERE cccd = cccd_input OR fullname = fullname_input;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `blacklist`
--

CREATE TABLE `blacklist` (
  `id` int(11) NOT NULL,
  `cccd` varchar(12) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `violation` text NOT NULL,
  `penalty_start` date DEFAULT NULL,
  `penalty_end` date DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blacklist`
--

INSERT INTO `blacklist` (`id`, `cccd`, `fullname`, `company`, `violation`, `penalty_start`, `penalty_end`, `created_by`, `created_at`, `note`) VALUES
(1, '034080001722', 'Nguyễn Đức Cường', 'Pantos', 'Lái xe Pantos vào nhà máy LGE đã có những lời lẽ chửi bới, xúc phạm bảo vệ cổng 4.', '2024-01-03', NULL, NULL, '2025-03-13 01:59:46', 'Ban vĩnh viễn.'),
(2, '030084000897', 'Phạm Mạnh Quyết\r\n', 'Việt Hàn\r\n', 'Mượn thẻ khách số G4-133 trong nhiều ngày không trả để ra vào nhà máy tự do, tự ý đưa thẻ khách của mình cho anh Phạm Huy Khương sử dụng để ra vào nhà máy.\r\n', '2024-01-25', '2024-02-22', NULL, '2025-03-13 01:59:46', 'Hà Anh Tùng IT SEC mở block ngày 22/02/2024.\r\n'),
(3, 'VH007615', 'Hà Anh Tùng', 'LGE', 'Đi xe máy điện trong nhà máy vượt quá tốc độ quy định, chở quá số người quy định, không đội mũ bảo hiểm, không chấp hành biển báo và chỉ dẫn làn đường, vạch kẻ đường.', '2025-03-14', '2025-03-16', NULL, '2025-03-14 12:44:41', 'Test'),
(4, '031091011059', 'Lê Tường Thắng', 'HALLA', 'Mang vật tư ra ngoài cổng công ty nhưng mã đăng kí tài sản mang vào trên đăng kí sai với mã hàng thực tế.', '2025-03-17', NULL, NULL, '2025-03-17 10:00:30', 'Biên bản hàng vi phạm');

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `cccd` varchar(12) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `result` enum('Blacklist','Allowed') NOT NULL,
  `violation_detail` text DEFAULT NULL,
  `checked_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `checked_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `logs`
--

INSERT INTO `logs` (`id`, `cccd`, `fullname`, `result`, `violation_detail`, `checked_at`, `checked_by`) VALUES
(16, '03030', '', 'Allowed', 'N/A', '2025-03-21 07:30:44', NULL),
(17, 'VH009634', 'Đỗ Tràng Nhật Quang', 'Allowed', 'N/A', '2025-03-21 07:31:51', 6),
(18, '', 'Ha Anh Tung', 'Blacklist', 'Đi xe máy điện trong nhà máy vượt quá tốc độ quy định, chở quá số người quy định, không đội mũ bảo hiểm, không chấp hành biển báo và chỉ dẫn làn đường, vạch kẻ đường.', '2025-03-24 07:05:58', 6),
(19, '0', 'Hà Anh Tùng', 'Blacklist', 'Đi xe máy điện trong nhà máy vượt quá tốc độ quy định, chở quá số người quy định, không đội mũ bảo hiểm, không chấp hành biển báo và chỉ dẫn làn đường, vạch kẻ đường.', '2025-03-24 07:22:46', NULL),
(20, '0', 'Hà Anh Tùng', 'Blacklist', 'Đi xe máy điện trong nhà máy vượt quá tốc độ quy định, chở quá số người quy định, không đội mũ bảo hiểm, không chấp hành biển báo và chỉ dẫn làn đường, vạch kẻ đường.', '2025-03-24 07:23:16', NULL),
(21, '0', 'Hà Anh Tùng', 'Blacklist', 'Đi xe máy điện trong nhà máy vượt quá tốc độ quy định, chở quá số người quy định, không đội mũ bảo hiểm, không chấp hành biển báo và chỉ dẫn làn đường, vạch kẻ đường.', '2025-03-24 07:23:52', NULL),
(22, '0', 'Hà Anh Tùng', 'Blacklist', 'Đi xe máy điện trong nhà máy vượt quá tốc độ quy định, chở quá số người quy định, không đội mũ bảo hiểm, không chấp hành biển báo và chỉ dẫn làn đường, vạch kẻ đường.', '2025-03-24 07:25:11', NULL),
(23, '0', 'Unknown', 'Allowed', 'N/A', '2025-03-24 07:28:07', NULL),
(24, '0', 'Unknown', 'Allowed', 'N/A', '2025-03-24 07:28:28', NULL),
(25, '0', 'Hà Anh Tùng', 'Blacklist', 'Đi xe máy điện trong nhà máy vượt quá tốc độ quy định, chở quá số người quy định, không đội mũ bảo hiểm, không chấp hành biển báo và chỉ dẫn làn đường, vạch kẻ đường.', '2025-03-24 07:28:52', NULL),
(26, '0', 'Hà Anh Tùng', 'Blacklist', 'Đi xe máy điện trong nhà máy vượt quá tốc độ quy định, chở quá số người quy định, không đội mũ bảo hiểm, không chấp hành biển báo và chỉ dẫn làn đường, vạch kẻ đường.', '2025-03-24 07:29:35', NULL),
(27, 'VH007615', 'Hà Anh Tùng', 'Blacklist', 'Đi xe máy điện trong nhà máy vượt quá tốc độ quy định, chở quá số người quy định, không đội mũ bảo hiểm, không chấp hành biển báo và chỉ dẫn làn đường, vạch kẻ đường.', '2025-03-24 07:32:10', NULL),
(28, 'N/A', 'Unknown', 'Allowed', 'N/A', '2025-03-24 07:32:47', NULL),
(29, 'N/A', 'Unknown', 'Allowed', 'N/A', '2025-03-24 07:32:59', 6),
(30, '034080001722', 'Nguyễn Đức Cường', 'Blacklist', 'Lái xe Pantos vào nhà máy LGE đã có những lời lẽ chửi bới, xúc phạm bảo vệ cổng 4.', '2025-03-24 07:33:18', 6),
(31, '034080001722', 'Nguyễn Đức Cường', 'Blacklist', 'Lái xe Pantos vào nhà máy LGE đã có những lời lẽ chửi bới, xúc phạm bảo vệ cổng 4.', '2025-03-24 07:35:01', 3),
(32, '034080001722', 'Nguyễn Đức Cường', 'Blacklist', 'Lái xe Pantos vào nhà máy LGE đã có những lời lẽ chửi bới, xúc phạm bảo vệ cổng 4.', '2025-03-24 07:37:52', 6),
(33, '034080001722', 'Nguyễn Đức Cường', 'Blacklist', 'Lái xe Pantos vào nhà máy LGE đã có những lời lẽ chửi bới, xúc phạm bảo vệ cổng 4.', '2025-03-24 07:38:22', NULL),
(34, 'N/A', 'Unknown', 'Allowed', 'N/A', '2025-03-24 07:38:50', NULL),
(35, 'N/A', 'Unknown', 'Allowed', 'N/A', '2025-03-24 07:40:44', NULL),
(36, 'N/A', 'Unknown', 'Allowed', 'N/A', '2025-03-24 07:42:47', NULL),
(37, 'N/A', 'Unknown', 'Allowed', 'N/A', '2025-03-24 07:43:36', NULL),
(38, '', 'Đỗ Tràng Nhật Quang', 'Allowed', 'N/A', '2025-03-24 07:52:40', NULL),
(39, 'VH009634', '', 'Allowed', 'N/A', '2025-03-24 07:55:07', NULL),
(42, '', 'Võ Đức Thành', 'Allowed', 'N/A', '2025-03-24 07:59:31', 6),
(43, '', 'Võ Đức Thành', 'Allowed', 'N/A', '2025-03-24 08:00:02', 6),
(44, '', 'Võ Đức Thành', 'Allowed', 'N/A', '2025-03-24 08:00:15', 6),
(45, 'VH007615', 'Hà Anh Tùng', 'Blacklist', 'Đi xe máy điện trong nhà máy vượt quá tốc độ quy định, chở quá số người quy định, không đội mũ bảo hiểm, không chấp hành biển báo và chỉ dẫn làn đường, vạch kẻ đường.', '2025-03-24 08:19:25', 6),
(46, 'VH007615', 'Hà Anh Tùng', 'Blacklist', 'Đi xe máy điện trong nhà máy vượt quá tốc độ quy định, chở quá số người quy định, không đội mũ bảo hiểm, không chấp hành biển báo và chỉ dẫn làn đường, vạch kẻ đường.', '2025-03-24 10:11:58', 6),
(47, 'VH007615', 'Hà Anh Tùng', 'Blacklist', 'Đi xe máy điện trong nhà máy vượt quá tốc độ quy định, chở quá số người quy định, không đội mũ bảo hiểm, không chấp hành biển báo và chỉ dẫn làn đường, vạch kẻ đường.', '2025-03-24 11:04:06', 6),
(48, 'VH009851', '', 'Allowed', 'N/A', '2025-03-24 11:04:47', 6),
(49, 'VH007615', 'Hà Anh Tùng', 'Blacklist', 'Đi xe máy điện trong nhà máy vượt quá tốc độ quy định, chở quá số người quy định, không đội mũ bảo hiểm, không chấp hành biển báo và chỉ dẫn làn đường, vạch kẻ đường.', '2025-03-24 11:05:30', 6),
(50, 'VH001234', '', 'Allowed', 'N/A', '2025-03-25 01:56:00', 6),
(51, 'VH000001', '', 'Allowed', 'N/A', '2025-04-06 11:22:26', 6),
(52, 'VH000001', 'Nguyen Duy Khanh', 'Allowed', 'N/A', '2025-04-06 11:23:55', 6),
(53, '', 'Nguyen Van Trong', 'Allowed', 'N/A', '2025-04-06 11:24:32', 6),
(54, 'VH007615', 'Hà Anh Tùng', 'Blacklist', 'Đi xe máy điện trong nhà máy vượt quá tốc độ quy định, chở quá số người quy định, không đội mũ bảo hiểm, không chấp hành biển báo và chỉ dẫn làn đường, vạch kẻ đường.', '2025-04-06 11:29:11', 6),
(55, 'VH007615', 'Hà Anh Tùng', 'Blacklist', 'Đi xe máy điện trong nhà máy vượt quá tốc độ quy định, chở quá số người quy định, không đội mũ bảo hiểm, không chấp hành biển báo và chỉ dẫn làn đường, vạch kẻ đường.', '2025-04-06 11:29:25', 6),
(56, 'VH007615', 'Hà Anh Tùng', 'Blacklist', 'Đi xe máy điện trong nhà máy vượt quá tốc độ quy định, chở quá số người quy định, không đội mũ bảo hiểm, không chấp hành biển báo và chỉ dẫn làn đường, vạch kẻ đường.', '2025-04-06 11:29:45', 6),
(57, '034080001722', 'Nguyễn Đức Cường', 'Blacklist', 'Lái xe Pantos vào nhà máy LGE đã có những lời lẽ chửi bới, xúc phạm bảo vệ cổng 4.', '2025-04-06 11:30:28', 6);

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `total_checked` int(11) DEFAULT 0,
  `blacklist_hits` int(11) DEFAULT 0,
  `allowed_entries` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `related_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `role` enum('Admin','Guard') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `fullname`, `role`, `created_at`) VALUES
(3, 'thao02.nguyen', '$2b$10$0nz/V3gbcqt2qFvn5oxAWuneD9urJkpaN3fc6E/cwvWqyMPjmQv5y', 'Nguyen Phuong Thao', 'Guard', '2025-03-13 01:57:12'),
(4, 'thanh.vo', '$2b$10$ekd.DDHmsRG/8vjSikP6euLXXszvMF/00dXWA7mG.XrSVjrTmbw0m', 'Vo Duc Thanh', 'Guard', '2025-03-14 02:33:52'),
(5, 'phat01.nguyen', '$2b$10$YWJVnYrjjon5BvFY6PNUk.DqXWo3e9tg2WzHYhhl.P8jGwZrVMvmG', 'Phat Nguyen', 'Admin', '2025-04-13 07:31:38'),
(6, 'admin', '$2b$10$XQP2ucagTLKya96smA.QourbNl1jIA1SzlPxIjUrzcKWIe98OQc9S', 'Admin', 'Admin', '2025-03-17 06:36:04'),
(7, 'quang.trang', '$2b$10$oF4BxF63.xucEfnaahubn.VH6qLQJ8YjoBXqouuPnYKSsKQM/7mVC', 'Do Trang Nhat Quang', 'Admin', '2025-04-07 04:40:25'),
(8, 'guard', '$2b$10$WM4UNSYJPRRsEC3RgHg6I.lqltEqWqobChwXpaE94kuIvg5/nWR/m', 'Guard', 'Guard', '2025-04-13 07:34:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blacklist`
--
ALTER TABLE `blacklist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cccd` (`cccd`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cccd` (`cccd`),
  ADD KEY `fk_logs_users` (`checked_by`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `reports_ibfk_1` (`related_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blacklist`
--
ALTER TABLE `blacklist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blacklist`
--
ALTER TABLE `blacklist`
  ADD CONSTRAINT `blacklist_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `fk_logs_users` FOREIGN KEY (`checked_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`related_id`) REFERENCES `blacklist` (`id`),
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
