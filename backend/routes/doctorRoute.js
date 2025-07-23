import express from "express";
import { changeAvailability, doctorsList } from "../controllers/doctorController.js";

const doctorRouter = express.Router();

doctorRouter.get("/list", doctorsList);
doctorRouter.post("/change-availability", changeAvailability);
export default doctorRouter;
