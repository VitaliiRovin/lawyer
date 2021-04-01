<?php

$option = (object)[
    'urlHome' => 'site request',
    'mainemail' => 'vitaly.04afapib@gmail.com',
    'nameField' => 'name',
    'addToFile' => true,
    'fileName' => "saveData.txt",
];
$err = '';

$to = $option->mainemail;
$subject = "$option->urlHome от " . $_POST[$option->nameField] . " " . $_POST['last_name'];
$message = '';

$dataLang = [
    'name' => 'Имя',
    'last_name' => 'Фамилия',
    'email' => 'Email',
    'phone' => 'Телефон',
    'agree' => 'Обработка персональных данных',
];

foreach ($_POST as $key => $value) {
    if (!$value) {
        continue;
    }

    $langLey = isset($dataLang[$key]) ? $dataLang[$key] : $key;

    if (is_string($value)) {
        $message .= '<p><b>' . $langLey . '</b>: ' . $value . '</p>';
    } else {
        if (is_array($value)) {
            $message .= '<p><b>' . $langLey . '</b>:';
            foreach ($value as $val) {
                $message .= $val . ', ';
            }
            $message .= '</p>';
        }
    }
}

$headers = "Content-type: text/html; charset=utf8 \r\n";
mail($to, $subject, $message, $headers);

if ($option->addToFile) {
    //соханение данных в файл
    $fd = fopen($option->fileName, 'a') or die("не удалось создать файл");
    fwrite($fd, implode("::", $_POST) . PHP_EOL);
    fclose($fd);
}
