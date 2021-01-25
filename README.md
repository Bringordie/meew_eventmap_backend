
# Meew Backend

Link to [Frontend](https://github.com/Bringordie/meew_assignment_frontend)

****Demo:****

Install Expo Client: 

[Apple](https://apps.apple.com/us/app/expo-client/id982107779)

[Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US)

or use an emulator

Expo app demo:
https://expo.io/@bringordie/projects/meew-demo

Open the link on your phone and open the client. Or open the link on a computer and take and QR scan the code.

***You should see a LOGIN screen. If that is not the case shake your phone and reload***

**Login credentials**

Username: t2

Password secret



****Setup:****

1. Download the github branch.
2. Run a npm i to install the node-module dependencies

3. In the **meew_assignment_backend** folder create a .env file. In this file you need to add below with **changes**:
```
CONNECTION=mongodb+srv://USERNAME:PASSWORD@CLUSTER.601hh.mongodb.net/DATABASE?retryWrites=true&w=majority

DB_NAME=Meew

PORT=5555

DEBUG=game-project,facade-no-db,facade-with-db,facade-with-db:test,user-endpoint,user-endpoint-test,db-setup

locationiqAPIKEY= APIKEY

SKIP_AUTHENTICATION = false
```

For the **CONNECTION**. If you don't already have an account on https://www.mongodb.com/ create one.
You need to create a account. Once you've created an account you need to make a database. Once that is done you need to create a user for this database then you can copy the URI into **CONNECTION** in the .env file. Or you can change the information above.

Specify the **DB_NAME** to something fitting.

**PORT** is up to you.

**DEBUG** leave it be for now. This is used for displaying "logs" without blocking like console.log
Leave the 

For **locationiqAPIKEY** go to https://locationiq.com/ and create an account and get the API key from there.


****Recommended developer setup:****

For running this with your frontend use [NGROK](https://ngrok.com/) so that you can develop locally without having to have it live on a server.
This software is used by first running your backend with for example
```
nodemon start
```
then you open the ngrok cmd file.
You now write where you specify XXXX as the port you've chosen to go with.
```
ngrok HTTP XXXX
```
