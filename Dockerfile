FROM idgis/meteor:1.7
MAINTAINER IDgis bv

RUN mkdir /home/meteorapp
WORKDIR /home/meteorapp

ADD . ./app

RUN cd /home/meteorapp/app \
  && meteor npm install --production \
  #
  && meteor build ../build --directory --allow-superuser \
  #
  && cd /home/meteorapp/build/bundle/programs/server \
  && npm install \
  #
  # Get rid of Meteor. We're done with it.
  && rm /usr/local/bin/meteor \
  && rm -rf ~/.meteor \
  #
  # Cleanup the installed files from the meteor image
  && cd / \
  && ./cleanup.sh

RUN mkdir /usr/geoide-upload-folder/ \
    && chown -R meteor /usr/geoide-upload-folder
VOLUME /usr/geoide-upload-folder
USER meteor

CMD ["node", "/home/meteorapp/build/bundle/main.js"]
