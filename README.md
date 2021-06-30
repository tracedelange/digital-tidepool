# The Digital Tidepool

## Welcome to the digital-tidepool folks!

The digital tidepool is a cellular simulation that takes place entirely in the browser. This project was written almost entirely from scratch, excluding use of the PIXI 
canvas library for drawing purposes. 

If you'd like to jump right in and begin experiment with the Digital-Tidepool you can visit the web friendly version [here](https://tracedelange.github.io/digital-tidepool/).

The purpose of this project was to create a microcosm of nature and give users an opportunity to tweak, experiment with and explore the different interactions that take place
inside the simulation, additionally, this project aims to highlight the fragility of ecological balance.

This project was heavily inspired by the cellular automata featured in the Game of Life.

As it currently stands, there are three elements participating in the simulation:
1. Greens, an analogue for primary producers which are the foundation of the ecosystem:
![green](https://user-images.githubusercontent.com/59540375/124007760-8718ce80-d990-11eb-8614-750e7d90b0bd.png)
2. Eaters, an analogue for primary consumers
![eater](https://user-images.githubusercontent.com/59540375/124007789-9009a000-d990-11eb-94c9-4c17eb9b4edf.png)
3. Hunters, an analogue for secondary consumers and apex predators of an ecosystem
![hunter](https://user-images.githubusercontent.com/59540375/124007803-939d2700-d990-11eb-8793-ab4e16498582.png)

The goal of the simulation is to maintain balance for as long as possible. If the population of any three elements reaches zero, the current timestep of the simulation will be saved and a message explaining the collapse will appear. The default parameters of the simulation are not special in themselves, they are simply one configuration stumbled upon during development that consistently reaches a duration around 1000 timesteps. There very well may be better parameter configurations that result in more stable systems, **the goal of the user is to discover those configurations. **

# Installation

There are two main versions of the Digital Tidepool:

The first utilizes a persistent local JSON-Server to maintain parameter configuration and timesteps between simulations and runs entirely on your local machine. 

The second utilizes cookies to maintain data between simulations and runs entirely on the web, you can visit this version [here](https://tracedelange.github.io/digital-tidepool/)

The benefit of installing the Digital Tidepool on your local machine is long-term persistence of your parameter configuration and your record of past trials. If you don't care about long term persistence and would just like to experiment, you should visit the web version linked above. 

**Local Installation**
To install locally using npm, navigate to the branch "finished-json", and clone the repository onto your system. 

After this is done, run the following commands in your terminal:

  `npm install -g json-server`
  `json-server --watch db.json`
  `open html.index`

This should allow you to write timestep records and save parameter configurations directly to your local machine. 

# Thank you!

Thanks for visiting and thank you for *hopefully* experimenting with the digital tidepool yourself!

If you're interested in reading about the dev process behind the digital tidepool, you can visit [my blog](https://tracedelange.github.io/).

If you have any questions, suggestions, or comments about this project, you can reach me at tracedelange@me.com 

Again, thank you very much for stopping by. I hope you enjoy.

*All sprite art was created by me, I hope you can get a kick out of them, I'm no artist but hey I tried*

![eater-lovey (1)](https://user-images.githubusercontent.com/59540375/124006900-a4996880-d98f-11eb-8d5c-75d71ed07058.png)






