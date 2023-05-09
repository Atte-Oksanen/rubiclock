<?php
error_reporting(0);
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    try {
        require("html/report.html");
    } catch (Error $e) {
        try {
            require("html/error.html");
        } catch (Error $e) {
            echo ($e->getMessage());
        }
    }
} else {
    error_reporting(0);
    $creds = parse_ini_file("../credentials.ini");
    $serverName = $creds["servername"];
    $username = $creds["username"];
    $dbname = $creds["dbname"];
    $password = $creds["password"];
    try {
        $conn = new PDO("mysql:host=$serverName;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO:: ERRMODE_EXCEPTION);
            $msg = $_POST["descr"];
            $query = $conn->prepare("INSERT INTO reports (descr) VALUES ('$msg')");
            $query->execute();
            echo "<h2>Thank you for reporting</h2>
            <p>You will be redirected to the main page shortly</p>
            <style>
                :root {
                    text-align: center;
                }
            </style>
            <script>
                    setTimeout(() => {
                        window.location.href = 'index.php';
                    }, 3000);
            </script>";
    } catch (PDOException $e) {
        try {
            require("html/error.html");
            die();
        } catch (Error $e) {
            die($e->getMessage());
        }
    }
    
}

?>