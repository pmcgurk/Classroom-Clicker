<?php

include("connect.php");

$username = $_POST['username'];
$realname = $_POST['realname'];
$password = $_POST['password'];


if (isset($username) && isset($password) && isset($realname) && $username != "" && $password != "" && $realname != "") {     
    $result = mysql_query("SELECT * FROM users WHERE username = '{$username}'") or die(mysql_error());
    if($row = mysql_fetch_array($result)) {
        echo '{"error": true, "message": "Error: Username taken."}';
    } else {
        mysql_query ("INSERT INTO `users` (`uid`, `username`, `islecturer`, `realname`, `password`) VALUES (NULL, '$username', '0', '$realname', '$password');") or die(mysql_error());
        echo '{"error": false, "message": "Success: Account created."}';

    }
} else {
    if ($username == "" && $password == "" && $realname == "")
		echo '{"error": true, "message": "Error: Form empty."}';
    else if ($username == "")
		echo '{"error": true, "message": "Error: No username."}';
	else if ($password == "")
		echo '{"error": true, "message": "Error: No password."}';
	else if ($realname == "")
		echo '{"error": true, "message": "Error: No realname."}';
}
?>