# World Radios webApp

[You can try it here](https://worldradioswebapp.netlify.app)

## Description

In this project I'm using <https://api.radio-browser.info/> for fetch Radios from all over the world. Enjoy!

## Features

Home page render Top 5 radios sorted by user clicks.

You can adjust volume by slider.

You can play chosen radio by clicking directly to it in carousel or at "play-stop" button.

You can stop playing by clicking to the same "play-stop" button.

You can change selected radios by click to "<" and ">" buttons.

You can Choose country of radio stations by clicking to "globes" button. If country chosen the Search and Top 5 will be for this country. If you want back to world search use first "All countries" option.

You can search any radio with or without country filter. Every filter render first five radios. You can clarify you search for better result.

You can add radios to Favorites by "+" bottom, and data will be saved in local storage of your browser. Limited to 5 favorites. If more, oldest favorite will be replaced. You can unfavorite by same button.

You can open your favorites list by clicking to "heart" button and listen one of your favorites stations. 

You can filter radios by genre by clicking to "musical note" button (under construction).

If radio carousel loading slow or you see the alert, you can change the server in settings.

You can back to homepage by click to the player picture.

## Structure of the project

```text
root
└── index.html
└── public
    └── style.css
    └── images
└── src
    └── utils
    └── app.js
    └── carousel.js
```
