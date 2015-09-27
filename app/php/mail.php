<?php

if($_SERVER['REQUEST_METHOD'] == 'POST') {
	$name = $_POST['name'];
	$email = $_POST['email'];
	$message = $_POST['comment'];
	$name = clean($name);
	$email = clean($email);
	$message = clean($message);
	if(!empty($name) && !empty($email) && !empty($message)) {
	    $email_validate = filter_var($email, FILTER_VALIDATE_EMAIL);
	    if(check_length($name, 1, 25) && check_length($message, 1, 1000) && $email_validate) {
	        send();
	    } else {
	        echo "Введенные данные некорректные";
	    }
	} else {
	    echo "Заполните пустые поля";
	}
}

function clean($value = "") {
    $value = trim($value);
    $value = stripslashes($value);
    $value = strip_tags($value);
    $value = htmlspecialchars($value);

    return $value;
}
function check_length($value = "", $min, $max) {
    $result = (mb_strlen($value) < $min || mb_strlen($value) > $max);
    return !$result;
}

function send(){

	require 'config.php';
	require 'phpmailer/PHPMailerAutoload.php';


  $personName = $_POST['name'];
	$email = $_POST['email'];
	$comment = nl2br($_POST['comment']);

  $td1_style = "border: 1px solid #000; max-width: 140px; padding: 5px 10px; font-weight: bold; background-color: #e8e8e8;";
	$td2_style = "border: 1px solid #000; max-width: 460px; min-width: 300px; padding: 5px 10px;";
	$msg = "
		<html>
			<body>
				<table style=\"border-collapse: collapse;\">
					<tr>
						<td style=\"$td1_style\">Имя</td>
						<td style=\"$td2_style\">$personName</td>
					</tr>
          <tr>
						<td style=\"$td1_style\">Электронный адрес</td>
						<td style=\"$td2_style\">$email</td>
					</tr>
          <tr>
						<td style=\"$td1_style vertical-align: top;\">Сообщение</td>
						<td style=\"$td2_style\">$comment</td>
					</tr>
				</table>
			</body>
		</html>";

	$mail = new PHPMailer;

	$mail->isSMTP();

	$mail->Host = $host;
	$mail->SMTPAuth = true;
	$mail->Username = $login; // логин от вашей почты
	$mail->Password = $pass; // пароль от почтового ящика
	$mail->SMTPSecure = 'ssl';
	$mail->Port = '465';

	$mail->CharSet = 'UTF-8';
	$mail->From = $fromWhom; // адрес почты, с которой идет отправка
	$mail->FromName = $name; // имя отправителя
	$mail->addAddress($mailTo, $name);

	//$mail->addCC('email3@email.com');

	$mail->isHTML(true);

	$mail->Subject = $theme;
	$mail->Body = $msg;

	$mail->AltBody = "Имя: {$_POST['name']}\r\n
	Email: {$_POST['email']}\r\n
	Сообщение: {$_POST['comment']}";

  // $mail->SMTPDebug = 1;

	if( $mail->send() ) {
		$answer = 'ok';
		//echo "Спасибо за сообщение";
	}else{
		$answer = 'ошибка сервера';
		/*echo 'Письмо не может быть отправлено. ';
		echo 'Ошибка: ' . $mail->ErrorInfo;*/
	}
	die( $answer );

}

?>
