import express, { Request, Response } from "express";
import routes from "./routes";

const app = express();

app.use(routes);

app.listen(3333);