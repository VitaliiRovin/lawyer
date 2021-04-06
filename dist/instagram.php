<?php

$loader = require 'vendor/autoload.php';

use InstagramScraper\Instagram;
use GuzzleHttp\Client;

header('Content-Type: application/json');

$dateString = date('m-d-Y');
$fileName = './cache/' . $dateString . '.cache';

$fileDefault = './default.cache';
// Если существует кэшированная версия:
if (file_exists($fileName)) {
    // Читаем и выводим файл
    readfile($fileName);
} else {
    
    $instagram = new Instagram(new Client());
    try {
        $nonPrivateAccountMedias = $instagram->getMedias('yourist_msk');
    } catch(Exception $e){
        header('Content-Type: application/json');
        readfile($fileDefault);
        return;
    }
    $mediaObj = [];

    foreach ($nonPrivateAccountMedias as $acMedia) {
        //    echo $acMedia->getImageStandardResolutionUrl();
        //    echo '<br>';
        //    echo '<br>';

        array_push($mediaObj, [
            'id' => $acMedia->getId(),
            'link' => $acMedia->getLink(),
            'image' => $acMedia->getImageStandardResolutionUrl(),
            'image_high' => $acMedia->getImageHighResolutionUrl(),
            'description' => $acMedia->getCaption(),
            'comments' => array_map(function ($comment) {
                $owner = $comment->getOwner();

                return [
                    'id' => $comment->getId(),
                    'owner' => [
                        'id' => $owner->getId(),
                        'link' => $owner->getExternalUrl(),
                        'full_name' => $owner->getFullName(),
                        'photo' => $owner->getProfilePicUrl(),
                    ],
                    'text' => $comment->getText(),
                    'created_at' => $comment->getCreatedAt(),
                ];
            }, $acMedia->getComments()),
        ]);
    }

    array_map("unlink", glob("./cache/*.cache"));
    // Сохранение кэш-файла с контентом
    $fp = fopen($fileName, 'w');
    $data = json_encode($mediaObj, JSON_UNESCAPED_UNICODE | JSON_OBJECT_AS_ARRAY);
    fwrite($fp, $data);
    fclose($fp);

    echo $data;
}

