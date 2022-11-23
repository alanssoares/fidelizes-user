FROM node:lts-alpine
ENV NODE_ENV=production
ENV DB_URL = localhost
ENV DB_USER = root
ENV DB_PW = 123456
ENV JWT_SECRET = qwertyui
ENV PORT = 3001
ENV EMAIL_NOREPLY = fidelizes@gmail.com
ENV EMAIL_NOREPLY_PW = xiaezabjyejryywz
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3001
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
