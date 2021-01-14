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

**msg.originalImage**: The image buffer processed.

**msg.outlinedImage**: Image buffer with rectangular outline around the faces. Only if config option
*drawPredictions* is true.

## Node Object Detection
Sends an image to the Deepstack Object Detection API and outputs the predictions.

### Inputs
The input message should contain the image to process.

**msg.payload**: Image buffer to process.

### Outputs
The first output always contain all predictions made by the Object Detection API. If filters are configured, the corresponding outputs 2..* will contain predictions matching that particular filter. If there is no match, there will be no message on that output.

**msg.payload**: Deepstack Object Detection predictions.

**msg.success**: Deepstack call status.

**msg.originalImage**: The image buffer processed.

**msg.outlinedImage**: Image buffer with rectangular outline around detected objects. Only if config option
*drawPredictions* is true.

## Credits
Credits should go to [Deepstack](https://deepstack.cc/) for providing such an awesome service!

## Buy me a coffee
Find it useful? Please consider buying me or other contributors a coffee.

<a href="https://www.buymeacoffee.com/iceglow" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>