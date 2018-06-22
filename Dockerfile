FROM ubuntu:16.04
MAINTAINER IDgis bv

RUN mkdir /home/meteorapp
WORKDIR /home/meteorapp

ADD . ./app

# Get curl in order to download meteor
RUN apt-get update && apt-get install -y curl python git bzip2 bsdtar build-essential python git

# Install Meteor
RUN (curl https://install.meteor.com/?release=1.7.0.3 | sh) \
  # Build the Meteor app
  && cd /home/meteorapp/app \
  && meteor npm install --production \
  && meteor build ../build --directory --allow-superuser \
  # Install the version of Node.js we need.
  && cd /home/meteorapp/build/bundle \
  && bash -c 'curl "https://nodejs.org/dist/$(<.node_version.txt)/node-$(<.node_version.txt)-linux-x64.tar.gz" > /home/meteorapp/build/required-node-linux-x64.tar.gz' \
  && cd /usr/local \
  && tar --strip-components 1 -xzf /home/meteorapp/build/required-node-linux-x64.tar.gz \
  && rm /home/meteorapp/build/required-node-linux-x64.tar.gz \
  # Build the NPM packages needed for build
  && cd /home/meteorapp/build/bundle/programs/server \
  && npm install \
  # Get rid of Meteor. We're done with it.
  && rm /usr/local/bin/meteor \
  && rm -rf ~/.meteor \
  # no longer need installed deps
  && apt-get remove --purge -y curl python git bzip2 bsdtar build-essential python git && apt-get --purge autoremove -y && apt-get clean

RUN npm install -g forever

EXPOSE 80
ENV PORT 80

CMD ["forever", "--minUptime", "1000", "--spinSleepTime", "1000", "build/bundle/main.js"]