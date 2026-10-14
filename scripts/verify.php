<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$metadata = json_decode(file_get_contents($root.'/resources/upstream.json'), true, flags: JSON_THROW_ON_ERROR);
$manifest = json_decode(file_get_contents($root.'/resources/manifest.json'), true, flags: JSON_THROW_ON_ERROR);
if (count($manifest) !== $metadata['icons'] || count(glob($root.'/resources/svg/*.svg')) !== $metadata['icons']) {
    throw new RuntimeException('Incomplete icon catalog.');
}
$digest = hash_init('sha256');
foreach ($manifest as $export => $identity) {
    $name = substr($identity, strlen('hugeicons-'));
    $svg = file_get_contents($root.'/resources/svg/'.$name.'.svg');
    $document = new DOMDocument;
    if (! $document->loadXML($svg, LIBXML_NONET) || $document->documentElement->localName !== 'svg'
        || $document->documentElement->getAttribute('viewBox') !== '0 0 24 24'
        || preg_match('/<script|on[a-z]+=|(?:href|src)=/i', $svg)) {
        throw new RuntimeException('Invalid SVG: '.$export);
    }
    hash_update($digest, $name."\0".$svg);
}
if (hash_final($digest) !== $metadata['catalogSha256']) {
    throw new RuntimeException('Catalog checksum mismatch.');
}
echo 'Verified '.$metadata['icons'].' SVGs and catalog checksum.'.PHP_EOL;
