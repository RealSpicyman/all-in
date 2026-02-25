<?php
    $email = $_POST['email'];
    $password = $_POST['passsword'];

    //database connection
    $conn = new mysqli('localhost','root','','Tests');
    if($conn->connect_error){
            die('Connection Failed : '.$conn->connect_error);
    }else{
        $stmt = $conn->prepare("insert into rester(email, password")
        value(?,?);
        $stmt->bind_param("ss", $email, $password);
        $stmt->execure();
        echo "registration Sucessfully...";
        $stmt->close();
        $conn->close();
    }
?>