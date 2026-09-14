import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import pick from "../../../helper/pick";
import { doctorFilterableFields } from "./doctor.constrain";
import sendResponse from "../../shared/sendResponse";
import { DoctorService } from "./doctor.service";


const getAllFromDB = catchAsync(async (req: Request,res: Response) => {
    const options = pick(req.query, ["page","limit","sortBy","sortOrder"]);
    const fillters = pick(req.query, doctorFilterableFields);

    const result = await DoctorService.getAllFromDB(fillters,options);
    
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Doctor fetched successfully",
        meta: result.meta,
        data: result.data
        
    })

})
 const softDelete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorService.softDelete(id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor soft deleted successfully',
        data: result,
    });
});
const updateIntoDB = catchAsync(async (req: Request,res: Response) => {
    const {id} = req.params;

    const result = await DoctorService.updateIntoDB(id as string,req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor updated successfully!",
        data: result
    })
})

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorService.getByIdFromDB(id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor retrieval successfully',
        data: result,
    });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorService.deleteFromDB(id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Doctor deleted successfully',
        data: result,
    });
});

const getAISuggestions =  catchAsync(async (req: Request,res: Response) => {
    const result = await DoctorService.getAISuggestions(req.body);
     sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "AI suggestions fetched successfully",
        data: result
    })
})

export const DoctorController = {
    getAllFromDB,
   updateIntoDB,
   getAISuggestions,
   getByIdFromDB,
   deleteFromDB,
   softDelete
}