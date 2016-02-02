<?php

include("connect.php");

if (isset($_POST['username']) && isset($_POST['password'])) {     
    $result = mysql_query("SELECT * FROM users WHERE username = '{$_POST['username']}' AND password = '{$_POST['password']}'") or die(mysql_error());
    if($row = mysql_fetch_array($result)) {
		session_start();
		$_SESSION['id'] = $row[0];
        echo "{$row[4]}";
        
    }
	else echo "Account Not Found";
} else {
    if (!isset($_POST['username']) && !isset($_POST['password']))
		echo "Form is empty";
	else if (!isset($_POST['username']))
		echo "No Username Provided";
	else if (!isset($_POST['password']))
		echo "No Password Provided";
}
?>