import path = require("path")
import { Express, NextFunction, Request, Response } from "express"
import express = require('express');
import passport = require('passport');
import { Strategy } from "passport-local"
import session = require('express-session')
import bodyParser = require('body-parser')
import { IReturn } from "./models/returns.model"
import { IUser } from "./models/user.model"
import * as returnsController from "./returnsController"
import * as userController from "./userController"
require('dotenv').config()


interface ISerializedUser {
  id: string
}

const app: Express = express();
const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(express.static(path.join(__dirname, "../../client/dist")));
app.use(function (inRequest: Request, inResponse: Response, inNext: NextFunction) {
  inResponse.header("Access-Control-Allow-Origin", "*");
  inResponse.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  inResponse.header("Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  inNext();
})

passport.use(new Strategy(
  function (username, password, done) {
    //Hand off to UserController
    const controller: userController.Controller = new userController.Controller();
    controller.verify(username, password).then((user) => {
      console.log("Login Success")
      return done(null, user)
    }).catch((err: Error) => {
      return done(null, false, { message: err.message });
    })
  }));

app.use(express.static("public"));
app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

function deserialize(id: string, done: (err: any, user?: ISerializedUser) => void): void {
  console.log("desialize() called")
  const controller: userController.Controller = new userController.Controller();
  controller.getUserById(id).then((user) => {
    const serializedUser: ISerializedUser = {id: user.id}
    done(null, serializedUser);
  }).catch((err) => {
    done(err);
  })
};

passport.serializeUser(function (user: ISerializedUser, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id: string, done: (err: any, user?: ISerializedUser) => void): void {
  const controller: userController.Controller = new userController.Controller();
  controller.getUserById(id).then((user) => {
    const deserializedUser: ISerializedUser = {id: user.id}
    done(null, deserializedUser);
  }).catch((err) => {
    done(err);
  });
});

//Login Authentication
app.post('/api/login', (inRequest: Request, inResponse: Response, next: NextFunction) => {
  passport.authenticate('local', (err, user: IUser, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return inResponse.status(403).send(info.message);
    }
    inRequest.logIn(user, () => {
      inResponse.send("Authenticated")
    })
  })(inRequest, inResponse, next);
});

//Logs out a user
app.post('/api/logout', (inRequest: Request, inResponse: Response) => {
  passport.deserializeUser(deserialize);
  inResponse.send("Successfully Logged Out");
})

//Signs up a new user
app.post('/api/signup', async (inRequest: Request, inResponse: Response) => {
  const controller: userController.Controller = new userController.Controller();
  controller.addNewUser(inRequest.body).then((newUser: IUser) => {
    inResponse.send(newUser._id);
  }).catch((err: Error) => {
    inResponse.status(403).send(err.message)
  })
});

//Gets all returns from a particular user
app.get('/api/returns/user/:userId', async (inRequest: Request, inResponse: Response) => {
  const controller: returnsController.Controller = new returnsController.Controller();
  const returns: IReturn[] = await controller.listReturns(inRequest.params.userId);
  inResponse.send(returns);
});

//Creates a new return from a user
app.put('/api/returns/user/:userId', async (inRequest: Request, inResponse: Response) => {
  const controller: returnsController.Controller = new returnsController.Controller();
  const confirmationNumber: IReturn = await controller.createReturn(inRequest.body);
  inResponse.send(confirmationNumber._id);
})

//Deletes a return
app.delete('/api/user/:userId/returns/:returnId', async (inRequest: Request, inResponse: Response) => {
  const controller: returnsController.Controller = new returnsController.Controller();
  const confirmationNumber: number = await controller.deleteReturn(inRequest.params.returnId)
  inResponse.send(`deleted: ${confirmationNumber}`);
})

app.get('/api/users', (inRequest: Request, inResponse: Response) => {
  inResponse.send(inRequest.user);
})

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
});


app.listen(PORT, () => {
  console.log("serving")
});

  