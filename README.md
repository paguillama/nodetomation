# Nodetomation
A Node.js automation system for Raspberry Pi & Arduino.

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

## Installation guide
Check out our [installation guide](https://github.com/paguillama/nodetomation/wiki/Installation-guide)

## Development
Are you a developer? Our [development section](https://github.com/paguillama/nodetomation/wiki/Development) can give you some valuable information about technologies, main grunt tasks, and roadmap.

## License
The MIT License (MIT)
Copyright (c) 2016 Pablo Guillama

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.