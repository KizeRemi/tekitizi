# Tekitizi
**Slider created by Mavillaz Rémi and Paul Girardin**

Javascript project developed during the Master Web Developer at the ECV Digitale - Paris.

Javascript OpenSource library that allows to integrate a slider of image directly on an html page. Once again
This library is called, it adds an action button on each image that displays the image in large overlay.
Several actions are then available for the user.

## Fonctionalities
- [x] Discrete zoom button on each image
- [x] Displays images in full screen with an overlay.
- [x] Button Next: Go to next image
- [x] Bouton Before: Return to previous image
- [x] Button close: Close the overlay
- [x] Button Play: Scroll images automatically
- [x] Button Stop: Stop the automatic scrolling of images
- [x] Scroll animation
- [x] Thumbnails



## Prerequisites
- Node: https://nodejs.org/en/
- Bower: https://bower.io/

## Installation

Open the terminal or command line, and in the directory of your choice:

```
git pull https://github.com/KizeRemi/tekitizi.git
```

Next, install dependencies with:
```
bower install
```

## Integration in your website

In your html page, copy to include dependencies:
```
<script src="../js/tekitizy.js"></script>
<script src="../bower_components/jquery/dist/jquery.js"></script>
<link rel="stylesheet" href="../bower_components/font-awesome/css/font-awesome.css" >
<link rel="stylesheet" href="../css/tekitizy.css" >
```

And the script for integrate Tekitizy:
```
<script>
Tekitizy.setup('#YourElement img', {
  prevNext: true, 
  play: true, 
  autoPlay: true, // démarre automatiquement l'animation - Etape 3
  imageDuration: 2, // en secondes le temps qu'apparaît une image quand l'animation tourne - Etape 3
  effect: true, // peut être `true`: une image pousse l'autre (de gauche à droite ou de droite à gauche suivant l'action, Etape 4)
  thumbnails: true // affiche l'action "planche contact" (Thumbnails) - Etape BONUS
})
</script>
```

The script requires several parameters
* prevNext: Display buttons next and previous
* play: Display buttons play and stop
* autoPlay: Enables automatic scroll by default
* imageDuration: The duration of an image display during automatic scrolling
* effect: Activate the slide effect
* thumbnails: Activate the thumbnail

## TODO
- [x] Render of close button
- [x] More parameters: number of image in thumbnail
