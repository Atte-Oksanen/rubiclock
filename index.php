<?php
error_reporting(0);
try {
    require("html/home.html");
} catch (Error $e) {
    try {
        require("html/error.html");
    } catch (Error $e) {
        echo ($e->getMessage());
    }
}
?>