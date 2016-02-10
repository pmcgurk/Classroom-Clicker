<?php
include("connect.php");
session_start();
$uid = $_SESSION['id'];
echo $_GET['questions'];
?>