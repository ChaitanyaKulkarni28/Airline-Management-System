-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 20, 2018 at 05:18 AM
-- Server version: 5.7.14
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `airline_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_profile`
--

CREATE TABLE `admin_profile` (
  `email_id` varchar(30) DEFAULT NULL,
  `user_password` varchar(50) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin_profile`
--

INSERT INTO `admin_profile` (`email_id`, `user_password`) VALUES
('chaitanya@gmail.com', '7fc4c05e401c6a7355dcedc978f839d9');

-- --------------------------------------------------------

--
-- Table structure for table `air_flight`
--

CREATE TABLE `air_flight` (
  `flight_id` int(10) NOT NULL,
  `airline_name` varchar(30) DEFAULT NULL,
  `from_location` varchar(20) DEFAULT NULL,
  `to_location` varchar(20) DEFAULT NULL,
  `total_seats` int(4) DEFAULT NULL,
  `deleted` int(1) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `air_flight`
--

INSERT INTO `air_flight` (`flight_id`, `airline_name`, `from_location`, `to_location`, `total_seats`, `deleted`) VALUES
(1, 'Emirates', 'dfw', 'bom', 50, 0);

-- --------------------------------------------------------

--
-- Table structure for table `air_flight_details`
--

CREATE TABLE `air_flight_details` (
  `flight_id` int(10) DEFAULT NULL,
  `flight_departure_date` date DEFAULT NULL,
  `departure_time` time DEFAULT NULL,
  `flight_arrival_date` date DEFAULT NULL,
  `arrival_time` time DEFAULT NULL,
  `price` float DEFAULT NULL,
  `available_seats` int(4) DEFAULT NULL,
  `deleted` int(1) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `air_flight_details`
--

INSERT INTO `air_flight_details` (`flight_id`, `flight_departure_date`, `departure_time`, `flight_arrival_date`, `arrival_time`, `price`, `available_seats`, `deleted`) VALUES
(1, '2018-06-03', '03:00:00', '2018-06-04', '15:00:00', 800, 40, 0);

-- --------------------------------------------------------

--
-- Table structure for table `air_ticket_info`
--

CREATE TABLE `air_ticket_info` (
  `ticket_id` int(10) NOT NULL,
  `profile_id` int(10) DEFAULT NULL,
  `flight_id` int(10) DEFAULT NULL,
  `flight_departure_date` date DEFAULT NULL,
  `flight_status` varchar(10) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `air_ticket_info`
--

INSERT INTO `air_ticket_info` (`ticket_id`, `profile_id`, `flight_id`, `flight_departure_date`, `flight_status`) VALUES
(1, 1, 1, '2018-06-03', '1'),
(2, 1, 1234, '2018-02-02', '1'),
(3, 1, 1234, '2018-02-02', '1'),
(123456, 2, 12345, '2018-02-03', 'on time'),
(123457, 3, 1, '2018-06-03', '1'),
(123458, 3, 1, '2018-06-03', '1');

-- --------------------------------------------------------

--
-- Table structure for table `passenger_checkin`
--

CREATE TABLE `passenger_checkin` (
  `ticket_id` int(10) DEFAULT NULL,
  `checkedin` tinyint(1) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `passenger_checkin`
--

INSERT INTO `passenger_checkin` (`ticket_id`, `checkedin`) VALUES
(1234, 1);

-- --------------------------------------------------------

--
-- Table structure for table `passenger_profile`
--

CREATE TABLE `passenger_profile` (
  `ticket_id` int(10) NOT NULL,
  `fullname` varchar(30) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `passenger_seat`
--

CREATE TABLE `passenger_seat` (
  `ticket_id` int(10) DEFAULT NULL,
  `fullname` varchar(60) DEFAULT NULL,
  `seat_number` varchar(4) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `passenger_seat`
--

INSERT INTO `passenger_seat` (`ticket_id`, `fullname`, `seat_number`) VALUES
(123456, 'kulkarni', '1A'),
(123456, 'kulkarni', '1B'),
(1, 'abc', '6A'),
(123457, 'aa', '10D'),
(123457, 'qq', '10E'),
(123458, 'abc', '2A'),
(123458, 'def', '2B'),
(123458, 'ghi', '2C');

-- --------------------------------------------------------

--
-- Table structure for table `user_profile`
--

CREATE TABLE `user_profile` (
  `profile_id` int(10) NOT NULL,
  `user_password` varchar(50) DEFAULT NULL,
  `firstname` varchar(15) DEFAULT NULL,
  `lastname` varchar(15) DEFAULT NULL,
  `mobile_number` varchar(13) NOT NULL,
  `email_id` varchar(30) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_profile`
--

INSERT INTO `user_profile` (`profile_id`, `user_password`, `firstname`, `lastname`, `mobile_number`, `email_id`) VALUES
(1, '25d55ad283aa400af464c76d713c07ad', 'Chaitanya', 'Kulkarni', '6824148322', 'abc@gmail.com'),
(2, '25d55ad283aa400af464c76d713c07ad', 'abcd', 'abcd', '123', 'abcd@gmail.com'),
(3, 'e807f1fcf82d132f9bb018ca6738a19f', 'A', 'B', '5555555555', 'abcde@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `user_token`
--

CREATE TABLE `user_token` (
  `profile_id` int(10) DEFAULT NULL,
  `token` varchar(50) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `air_flight`
--
ALTER TABLE `air_flight`
  ADD PRIMARY KEY (`flight_id`);

--
-- Indexes for table `air_ticket_info`
--
ALTER TABLE `air_ticket_info`
  ADD PRIMARY KEY (`ticket_id`);

--
-- Indexes for table `passenger_profile`
--
ALTER TABLE `passenger_profile`
  ADD PRIMARY KEY (`ticket_id`,`fullname`);

--
-- Indexes for table `user_profile`
--
ALTER TABLE `user_profile`
  ADD PRIMARY KEY (`profile_id`),
  ADD UNIQUE KEY `mobile_number` (`mobile_number`),
  ADD UNIQUE KEY `email_id` (`email_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `air_flight`
--
ALTER TABLE `air_flight`
  MODIFY `flight_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;
--
-- AUTO_INCREMENT for table `air_ticket_info`
--
ALTER TABLE `air_ticket_info`
  MODIFY `ticket_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123459;
--
-- AUTO_INCREMENT for table `user_profile`
--
ALTER TABLE `user_profile`
  MODIFY `profile_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
