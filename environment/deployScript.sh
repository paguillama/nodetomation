#!/bin/bash
#Stop application
pm2 stop nodetomation

#go to git directory
cd /opt/nodetomation
eval $(ssh-agent)

#pull and checkout tag
git checkout master
git pull --force
git checkout tags/v$1

#packages
npm install

#run
pm2 start ecosystem.json