<?php

include("connect.php");

if (isset($_POST['username']) && isset($_POST['password'])) {     
    $result = mysql_query("SELECT * FROM users WHERE username = '{$_POST['username']}' AND password = '{$_POST['password']}'") or die(mysql_error());
    if($row = mysql_fetch_array($result)) {
		session_start();
		$_SESSION['id'] = $row[0];
        echo "{$row[4]}";
        
    }
	else echo "err-wrongdata";
} else {
    if (!isset($_POST['username']) && !isset($_POST['password']))
		echo "err-nodata";
	else if (!isset($_POST['username']))
		echo "err-nousername";
	else if (!isset($_POST['password']))
		echo "err-nopw";
}
?>