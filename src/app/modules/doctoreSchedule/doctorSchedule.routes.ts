import express from "express";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorScheduleController } from "./doctorSchedule.controller";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.DOCTOR,UserRole.PATIENT),
    DoctorScheduleController.insertIntoDB
)

export const doctorScheduleRoutes = router;