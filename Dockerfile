FROM idgis/meteor:1.11 as builder

RUN mkdir /home/meteorapp
WORKDIR /home/meteorapp

ADD . ./app

RUN cd /home/meteorapp/app \
  && meteor npm install --production \
  #
  && meteor build ../build --directory --allow-superuser \
  #
  && cd /home/meteorapp/build/bundle/programs/server \
  && npm install

FROM node:12.18.4 as app
LABEL maintainer="IDgis bv"

RUN mkdir -p /home/meteorapp/build
COPY --from=builder /home/meteorapp/build /home/meteorapp/build

# Create the meteor user
RUN useradd -M --uid 3000 --shell /bin/false meteor

# Create folder/volume for the uploads
RUN mkdir /usr/geoide-upload-folder/ \
    && chown -R meteor /usr/geoide-upload-folder
VOLUME /usr/geoide-upload-folder

# Expose default port 3000
EXPOSE 3000
ENV PORT 3000

USER meteor

CMD ["node", "/home/meteorapp/build/bundle/main.js"]
