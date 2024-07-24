#!/bin/bash


# assumes 2 env variables: KEYSTORE_FILE_HEX & KEYSTORE_PASSWORD
#
# PS. to turn file to hex and back:
#     $ xxd -plain test.txt > test.hex
#     $ xxd -plain -revert test.hex test2.txt

## TO BE REMOVED
# export KEYSTORE_FILE_HEX=$(cat hex.hex)
# export KEYSTORE_PASSWORD=123456
# export KEYSTORE_KEY_PASSWORD=123456
# export KEYSTORE_ALIAS=key0
######

echo $KEYSTORE_FILE_HEX > bluewallet-release-key.keystore.hex
xxd -plain -revert bluewallet-release-key.keystore.hex > ./android/bluewallet-release-key.keystore
cp ./android/bluewallet-release-key.keystore ./android/app/bluewallet-release-key.keystore
rm bluewallet-release-key.keystore.hex

cd android
TIMESTAMP=$(date +%s | sed 's/...$//')
sed -i'.original'  "s/versionCode 1/versionCode $TIMESTAMP/g" app/build.gradle
./gradlew assembleRelease -P MYAPP_UPLOAD_STORE_FILE=./bluewallet-release-key.keystore -P MYAPP_UPLOAD_KEY_ALIAS=$KEYSTORE_ALIAS -P MYAPP_UPLOAD_STORE_PASSWORD=$KEYSTORE_PASSWORD -P MYAPP_UPLOAD_KEY_PASSWORD=$KEYSTORE_KEY_PASSWORD
mv ./app/build/outputs/apk/release/app-release-unsigned.apk ./app/build/outputs/apk/release/app-release.apk
ls $ANDROID_HOME/build-tools
$ANDROID_HOME/build-tools/33.0.2/apksigner sign --ks ./bluewallet-release-key.keystore   --ks-pass=pass:$KEYSTORE_PASSWORD ./app/build/outputs/apk/release/app-release.apk

