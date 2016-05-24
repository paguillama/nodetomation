# Nodetomation
A Node.js automation system for Raspberry Pi & Arduino.

This is a content table, some points here should be on the readme file and some others moved to the project wiki.

## Description
Nodetomation is an open source system that automates components actions based on events.

There many events sources as the user interaction (eg: click on the UI dashboard), a schedule (eg: every sunday at 8 am), or a component event (eg: the temperature sensor says that temp is over 80°F).

Components are pluggable, they have events and/or actions and can be of any kind: physical ones (eg: a camera with a proximity sensor triggering the "move captured" event, or executing the "take a photo" action) or logical ones (eg: an email service triggering the "email arrived" event, or executing the "send email" action).

### Current features
- Live user interaction
- Scheduling
- Component events triggering actions
- System logging
- Authentication

### Components
- Light
- Camera (not working yet on Raspberry Pi)
- Thermometer
- Fan

## Install
### Development Setup
#### Install Node.js
Check [the Node.js download page](https://nodejs.org/en/download) to install it, or use [nvm](https://github.com/creationix/nvm) ([nvm-windows](https://github.com/coreybutler/nvm-windows) for Windows OS) to manage your Node.js versions easy.

#### Dependencies
Installing Grunt and Bower as globals allows us to access them from the CLI. To install them run `npm install -g grunt-cli bower`.

To get the project dependencies run `npm install` and `bower install`.

#### Database configuration
Check [the MongoDB installation guide](https://docs.mongodb.org/manual/installation)

Running `mongo localhost:27017/nodetomation-db environment/nodetomation-db.nosql-js` will add some example data, including an 'admin' user with password 'admin'.

You can use it as it is or make a new configuration based on this one.

#### Install Standard Firmata in your Arduino
If you are not sure if your board already has Standard Firmata on it you can follow [this guide](http://www.instructables.com/id/Arduino-Installing-Standard-Firmata) to install it, skipping the testing step if you want to test it with Nodetomation directly.

### Production Setup
#### OS
Nodetomation will support every [Johnny-Five platform](http://johnny-five.io/platform-support/), but by now we target the [Raspbian](https://www.raspberrypi.org/downloads/raspbian) distribution with just one Arduino board.

[This guide](https://www.raspberrypi.org/documentation/installation) will help you on installing it. You will also want to check [this article](http://elinux.org/RPi_raspi-config#expand_rootfs_-_Expand_root_partition_to_fill_SD_card) to expand your file system to fill the SD card.

Once installed:
- Connect a keyboard/mouse and a wifi dongle and a HDMI screen.
- [Connect your Raspberry Pi to the network](https://www.raspberrypi.org/documentation/configuration/wireless).
- Run `sudo raspi-config`.
- Change the user password.
- Change `Boot options` if you want to change to desktop or console.
- Change `Internationalisation Option` to the proper ones.
- Enable the camera if you have a Raspberry camera and want to use the camera feature (WIP).
- If you want to access the Raspberry remotely through SSH, make you sure SSH is enabled In `Advanced Options`.

#### Install Node.js
Check [this article](https://learn.adafruit.com/node-embedded-development/installing-node-dot-js) to install Node.js in your Raspberry Pi.

#### Install MongoDB
Run:
1. `git clone https://github.com/svvitale/mongo4pi`
2. `./mongo4pi/install.sh`
3. `rm -rf mongo4pi/`

#### Clone Nodetomation and install its dependencies
Run:
1. `cd /opt`
2. `sudo mkdir nodetomation`
3. `chown pi nodetomation` // Replacing `pi` with your username if you want to avoid using the default one
4. `git clone https://github.com/paguillama/nodetomation.git`
5. `git checkout tags/versionNumber` // Replacing `versionNumber` with the version you want to install
5. `npm install --production`

#### Pm2 setup
1. Run `npm install pm2 -g` // Probably you have to run it with `sudo`.
2. Change the ecosystem.json file keys to the proper ones. 
3. Just to test if everything is alright try running the application manually with `pm2 start ecosystem.json`.
3. Check [this article](http://pm2.keymetrics.io/docs/usage/startup/) to run the application on every reboot.

#### Authentication setup
Once we checked the application is running with pm2, we have to add our admin user. To do that run `pm2 restart nodetomation -- --add-admin`.

The `--add-admin` parameter will add the admin user only if there are no users in the users storage.

#### Deploy
Check the `environment/deployScript.sh` bash script to deploy new versions of Nodetomation.

#### Port redirection
Instead of giving root permissions to this application to listen at the 80 port, you can [redirect from port 80 to 3000](http://stackoverflow.com/questions/16573668/best-practices-when-running-node-js-with-port-80-ubuntu-linode#16573737)

## Development
### Main grunt tasks
`server` lint, build and serve
`server:docs` generate and serve frontend documentation
`test` build and test
`release::semver-change` lint, build, test, compile and change version (semver-change = mayor|minor|patch)

### How can you help?
- [Opening or resolving issues](https://github.com/paguillama/nodetomation/issues),
- [Developing a component](https://github.com/paguillama/nodetomation/pulls),
- Creating a theme

### Browser target
This project targets evergreen browsers.

### Used technologies
Raspberry Pi, Arduino, HTML5, CSS3, ES6, Angular, Node.js, ExpressJS, Johnny-five, MongoDB, Socket-io, Bootstrap, Pm2, Grunt, Bower, Npm, Babel, Browserify, SASS, Angular UI-Router, Karma, Jasmine, NGDocs

## Roadmap
###### Component interactions
We can improve the automation of things if every action and event gives and receives data.

That way a component can use other components data as an input, analyze it, execute some action and return some data to be used be other component. That allows us to create diagrams of "smart" actions, each one of those have more data as input giving a more powerful output.

###### Configuration UIs
Right now there are no CRUD UI for most of the collections stored in MongoDB. People need UIs, we are people, we need them.   

###### More components
It's easy to create physical components wrapping Johnny-Five components, lets do it! There are also tv and air conditioner protocols to wrap.

What about logical components such as notifications services (in the app itself, by mail, tweeting), weather APIs, or 

###### Timeline
It would be nice to track historical data such as temperature, humidity, components actions, and create d3 charts with it.
We can also keep photos and show them as with a date range selector or animating it like a timelapse.
  
###### Safety actions
Send notifications, take reactive actions, or shutdown everything if something is really wrong.

###### Multiple environments
Each component could be placed in a environment, that would help to have an overview of all the environments (eg: a house, factory, or whatever you are automating), and detailed views of our environments (eg: your house front, garden, first floor, etc).

###### Nodetomation as separated modules
Nodetomation solves automation of things, but sometimes that's not enough. It would be great to publish Nodetomation as a set of modules that can be used by third party applications:

The idea is to separate the Nodetomation solution into many parts:
- Nodetomation App: A generic-purpose full stack system. Ready to be deployed to your Raspberry Pi, pc, or mac with your custom configuration.
- Nodetomation Core: The core library that manages components, events, schedules, and actions. Optionally it will publish a rest api.
- Nodetomation UI Components: A set of Angular UI components.
- Nodetomation Components: A core components library (provided by default on Nodetomation Core) and pluggable third party components.

###### Nodetomation Internet server
Access your Nodetomation app from the Internet.

## License
The MIT License (MIT)
Copyright (c) 2016 Pablo Guillama

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.