import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";

import sendResponse from "../../shared/sendResponse";
import { UserService } from "./user.service";
import { string } from "zod";
import pick from "../../../helper/pick";
import { userfilterablefields } from "./user.constant";
import httpStatus from "http-status";
import { IJWTPayload } from "../../types/common";

const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createPatient(req);
   console.log(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Patient created successfully",
        data: result
    })
})

const createAdmin = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createAdmin(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Admin Created successfuly!",
        data: result
    })
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createDoctor(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Doctor Created successfuly!",
        data: result
    })
});


const getMyProfile = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {

    const user = req.user;

    const result = await UserService.getMyProfile(user as IJWTPayload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile data fetched!",
        data: result
    })
});



const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, userfilterablefields)
    const options = pick(req.query, ["page","limit","sortBy","sortOrder"])
    const result = await UserService.getAllFromDB(filters,options);
   console.log(req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User retrive successfully",
        meta: result.meta,
        data: result.data
    })
})


const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await UserService.changeProfileStatus(id as string, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users profile status changed!",
        data: result
    })
});
const updateMyProfie = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {

    const user = req.user;

    const result = await UserService.updateMyProfie(user as IJWTPayload, req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile updated!",
        data: result
    })
});
export const UserController = {
    createPatient,
    createAdmin,
    createDoctor,
    getMyProfile,
    getAllFromDB,
    changeProfileStatus,
    updateMyProfie
}