<?php

include("connect.php");

 $result = mysql_query("SELECT * FROM questions WHERE questions.qid=$_GET[qid] AND questions.answer='$_GET[value]'");
        if(mysql_num_rows($result) > 0 )
        { 
            echo "correct";
        }
        else
        {
            echo 'incorrect';
        }
?> 