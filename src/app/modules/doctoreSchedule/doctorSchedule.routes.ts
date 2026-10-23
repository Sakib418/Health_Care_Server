import express from "express";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleValidation } from "./DoctorScheduleValidation";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.DOCTOR),
    validateRequest(DoctorScheduleValidation.createDoctorScheduleValidationSchema),
    DoctorScheduleController.insertIntoDB
)
router.get(
    '/',
    auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    DoctorScheduleController.getAllFromDB
);

router.get(
    '/my-schedule',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.getMySchedule
)
export const doctorScheduleRoutes = router;


router.delete(
    '/:id',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.deleteFromDB
);