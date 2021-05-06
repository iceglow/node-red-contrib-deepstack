# node-red-contrib-deepstack
Simple Node-RED nodes for interacting with the Deepstack API.

## Node Face Recognition
Sends an image to the Deepstack Face Recognition API and outputs the predictions.

### Inputs
The input message should contain the image to process.

**msg.payload**: Image buffer to process.

### Outputs
The first output always contain all predictions made by the Face Recognition API. If filters are configured, the corresponding outputs 2..* will contain predictions matching that particular filter. If there is no match, there will be no message on that output.

**msg.payload**: Deepstack Face Recognition predictions.

**msg.success**: Deepstack call status.

**msg.duration**: Deepstack call duration.

**msg.originalImage**: The image buffer processed.

**msg.outlinedImage**: Image buffer with rectangular outline around the faces. Only if config option
*drawPredictions* is true.

## Node Face Registration
Sends an image to the Deepstack Face Registration API and outputs the result.

### Inputs
The input message should contain the image to send for registration.

**msg.payload**: Image buffer to process.

### Outputs
The registration result.

**msg.payload**: Deepstack Face Registration result.

**msg.success**: Deepstack call status.

**msg.duration**: Deepstack call duration.

## Node Object Detection
Sends an image to the Deepstack Object Detection API and outputs the predictions.

### Inputs
The input message should contain the image to process.

**msg.payload**: Image buffer to process.

### Outputs
The first output always contain all predictions made by the Object Detection API. If filters are configured, the corresponding outputs 2..* will contain predictions matching that particular filter. If there is no match, there will be no message on that output.

**msg.payload**: Deepstack Object Detection predictions.

**msg.success**: Deepstack call status.

**msg.duration**: Deepstack call duration.

**msg.originalImage**: The image buffer processed.

**msg.outlinedImage**: Image buffer with rectangular outline around detected objects. Only if config option
*drawPredictions* is true.

## Troubleshooting
Common errors and fixes

### Problem with Sharp & libvips on Alpine on Raspberry Pi
The version of Sharp used for this node requires a version of libvips not provided in the current Alpine base image used for the official node-red image.

<details>
<summary>The error</summary>

```bash
$ npm install node-red-contrib-deepstack

> sharp@0.26.3 install /usr/src/node-red/node_modules/sharp
> (node install/libvips && node install/dll-copy && prebuild-install) || (node-gyp rebuild && node install/dll-copy)

info sharp Downloading https://github.com/lovell/sharp-libvips/releases/download/v8.10.0/libvips-8.10.0-linuxmusl-armv7.tar.br
ERR! sharp Prebuilt libvips 8.10.0 binaries are not yet available for linuxmusl-armv7
info sharp Attempting to build from source via node-gyp but this may fail due to the above error
info sharp Please see https://sharp.pixelplumbing.com/install for required dependencies
make: Entering directory '/usr/src/node-red/node_modules/sharp/build'
  CC(target) Release/obj.target/nothing/../node-addon-api/nothing.o
  AR(target) Release/obj.target/../node-addon-api/nothing.a
  COPY Release/nothing.a
  TOUCH Release/obj.target/libvips-cpp.stamp
  CXX(target) Release/obj.target/sharp/src/common.o
../src/common.cc:24:10: fatal error: vips/vips8: No such file or directory
   24 | #include <vips/vips8>
      |          ^~~~~~~~~~~~
compilation terminated.
make: *** [sharp.target.mk:138: Release/obj.target/sharp/src/common.o] Error 1
make: Leaving directory '/usr/src/node-red/node_modules/sharp/build'
gyp ERR! build error
gyp ERR! stack Error: `make` failed with exit code: 2
gyp ERR! stack     at ChildProcess.onExit (/usr/local/lib/node_modules/npm/node_modules/node-gyp/lib/build.js:194:23)
gyp ERR! stack     at ChildProcess.emit (events.js:314:20)
gyp ERR! stack     at Process.ChildProcess._handle.onexit (internal/child_process.js:276:12)
gyp ERR! System Linux 5.4.72-v7l+
gyp ERR! command "/usr/local/bin/node" "/usr/local/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
gyp ERR! cwd /usr/src/node-red/node_modules/sharp
gyp ERR! node -v v12.20.0
gyp ERR! node-gyp -v v5.1.0
gyp ERR! not ok
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! sharp@0.26.3 install: `(node install/libvips && node install/dll-copy && prebuild-install) || (node-gyp rebuild && node install/dll-copy)`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the sharp@0.26.3 install script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /usr/src/node-red/.npm/_logs/2021-01-22T22_37_47_612Z-debug.log
```
</details>

<details>
<summary>The fix</summary>

Build a [custom libvips](https://sharp.pixelplumbing.com/install#custom-libvips) before installation of this node.

Running Docker, you can use this Dockerfile:
```Dockerfile
FROM nodered/node-red:latest-12

USER root

ARG LIBVIPS_VERSION_MAJOR_MINOR=8.10
ARG LIBVIPS_VERSION_PATCH=5
ARG MOZJPEG_VERSION="v3.3.1"

ENV CPATH /usr/local/include
ENV LIBRARY_PATH /usr/local/lib
ENV PKG_CONFIG_PATH=/usr/local/lib/pkgconfig:$PKG_CONFIG_PATH

RUN apk update && \
    apk upgrade && \
    apk add --update \
      zlib libxml2 libxslt glib ca-certificates \
      expat cairo orc libjpeg-turbo libwebp libexif lcms2 librsvg \
      poppler-glib fftw giflib libpng tiff && \
    apk add --no-cache --virtual \
      .build-dependencies autoconf automake build-base cmake \
      git libtool nasm zlib-dev libxml2-dev libxslt-dev wget \
      expat-dev cairo-dev orc-dev libjpeg-turbo-dev libwebp-dev \
      libexif-dev lcms2-dev librsvg-dev poppler-dev fftw-dev \
      giflib-dev libpng-dev tiff-dev glib-dev && \
    \
    echo 'Install mozjpeg' && \
    cd /tmp && \
    git clone git://github.com/mozilla/mozjpeg.git && \
    cd /tmp/mozjpeg && \
    git checkout ${MOZJPEG_VERSION} && \
    autoreconf -fiv && ./configure --prefix=/usr && make install && \
    \
    echo 'Install libvips' && \
    wget -O- https://github.com/libvips/libvips/releases/download/v${LIBVIPS_VERSION_MAJOR_MINOR}.${LIBVIPS_VERSION_PATCH}/vips-${LIBVIPS_VERSION_MAJOR_MINOR}.${LIBVIPS_VERSION_PATCH}.tar.gz | tar xzC /tmp && \
    cd /tmp/vips-${LIBVIPS_VERSION_MAJOR_MINOR}.${LIBVIPS_VERSION_PATCH} && \
    ./configure --prefix=/usr \
                --without-gsf \
                --enable-debug=no \
                --disable-dependency-tracking \
                --disable-static \
                --enable-silent-rules && \
    make -s install-strip && \
    cd /data/ && \
    echo 'Install Node-RED modules' && \
    npm install node-red-contrib-deepstack && \
    \
    echo 'Cleanup' && \
    rm -rf /tmp/vips-${LIBVIPS_VERSION_MAJOR_MINOR}.${LIBVIPS_VERSION_PATCH} && \
    rm -rf /tmp/mozjpeg && \
    apk del --purge .build-dependencies && \
    rm -rf /var/cache/apk/*
```
</details>

## Credits
Credits should go to [Deepstack](https://deepstack.cc/) for providing such an awesome service!

## Buy me a coffee
Find it useful? Please consider buying me or other contributors a coffee.

<a href="https://www.buymeacoffee.com/iceglow" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>