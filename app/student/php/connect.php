<?php 
    mysql_connect("localhost", "root", ""); 
    mysql_select_db("clicker") or die(mysql_error()); 
	session_set_cookie_params(3156000);
	session_save_path("../sessions");
?>