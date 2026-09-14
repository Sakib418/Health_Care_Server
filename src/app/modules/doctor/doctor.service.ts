import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { IOptions, paginationHelper } from "../../../helper/paginationHelper";
import { doctorFilterableFields, doctorSearchableFields } from "./doctor.constrain";
import prisma from "../../shared/prisma";
import { IDoctorUpdateInput } from "./doctor.interface";
import ApiError from "../../errors/apiError";
import httpStatus from 'http-status';
import { openai } from "../../../helper/Open-router";
import { extractJsonFromMessage } from "../../../helper/extractJsonFromMessage";

// const getAllFromDB = async (filters: any, options: IOptions) => {
//         const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
//         const { searchTerm, specialties, ...filterData } = filters;
//         const andConditions: Prisma.DoctorWhereInput[] = [];

//          if (searchTerm) {
//         andConditions.push({
//             OR: doctorSearchableFields.map((field) => ({
//                 [field]: {
//                     contains: searchTerm,
//                     mode: "insensitive"
//                 }
//             }))
//         })
//     }

//         // "", "medicine"
//     if (specialties && specialties.length > 0) {
//         andConditions.push({
//             doctorSpecialties: {
//                 some: {
//                     specialities: {
//                         title: {
//                             contains: specialties,
//                             mode: "insensitive"
//                         }
//                     }
//                 }
//             }
//         })
//     }

//         if (Object.keys(filterData).length > 0) {
//         const filterConditions = Object.keys(filterData).map((key) => ({
//             [key]: {
//                 equals: (filterData as any)[key]
//             }
//         }))

//         andConditions.push(...filterConditions)
//        }
//           const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

//     const result = await prisma.doctor.findMany({
//         where: whereConditions,
//         skip,
//         take: limit,
//         orderBy: {
//             [sortBy]: sortOrder
//         },
//         include: {
//             doctorSpecialties: {
//                 include: {
//                     specialities: true
//                 }
//             }
//         }
//          });
//          const total = await prisma.doctor.count({
//         where: whereConditions
//     })

//     return {
//         meta: {
//             total,
//             page,
//             limit
//         },
//         data: result
//     }
// }
const getAllFromDB = async (filters: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    // "", "medicine"
    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialities: {
                        title: {
                            contains: specialties,
                            mode: "insensitive"
                        }
                    }
                }
            }
        })
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData as any)[key]
            }
        }))

        andConditions.push(...filterConditions)
    }

    const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    });

    const total = await prisma.doctor.count({
        where: whereConditions
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}
const updateIntoDB = async (id: string,payload : Partial<IDoctorUpdateInput>) => {
    const doctorInfo = await prisma.doctor.findFirstOrThrow({
        where: {
            id
        }
    })
    const {specialties,...doctorData} = payload;

    return await prisma.$transaction(async (tnx) => {
       if(specialties && specialties.length > 0){
        const deleteSpecialitiyIds = specialties.filter((specialty) => specialty.isDeleted);
         
        for(const specialty of deleteSpecialitiyIds){
            await tnx.doctorSpecialties.deleteMany({
                where: {
                    doctorId: id,
                    specialitiesId: specialty.specialtyId
                }
            })
        }
         const createSpecialitiyIds = specialties.filter((specialty) => !specialty.isDeleted);
         for(const specialty of createSpecialitiyIds){
            await tnx.doctorSpecialties.create({
                data: {
                    doctorId: id,
                    specialitiesId: specialty.specialtyId
                }
            })
        }

       const updateData = await tnx.doctor.update({
        where : {
            id: doctorInfo.id
        },
        data: doctorData,
        include:{
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
       })
    
       return updateData

       }
    })
}

const getAISuggestions = async (payload: {symptoms: string}) => {
   
    if(!(payload && payload.symptoms)){
        throw new ApiError(httpStatus.BAD_REQUEST, "Symptions are required!")
    }
    // const doctors = await prisma.doctor.findMany({
    //     where: {isDeleted : false},
    //     include : {
    //         doctorSpecialties : {
    //             include : {
    //                 specialities : true
    //             }
    //         }
    //     }
    // });
    //console.log(doctors);
//     console.log("doctors data loaded.......\n");
//     const prompt = `
// You are a medical assistant AI. Based on the patient's symptoms, suggest the top 3 most suitable doctors.
// Each doctor has specialties and years of experience.
// Only suggest doctors who are relevant to the given symptoms.

// Symptoms: ${payload.symptoms}

// Here is the doctor list (in JSON):
// ${JSON.stringify(doctors, null, 2)}

// Return your response in JSON format with full individual doctor data. 
// `;

  
// console.log("analyzing......\n")
//     const completion = await openai.chat.completions.create({
//         model: 'openrouter/free',
//         messages: [
//             {
//                 role: "system",
//                 content:
//                     "You are a helpful AI medical assistant that provides doctor suggestions.",
//             },
//             {
//                 role: 'user',
//                 content: prompt,
//             },
//         ],
//     });
//   const result = await extractJsonFromMessage(completion.choices[0].message)
//     return result;
 // Get available specialties
    const specialties = await prisma.specialties.findMany({
        select: {
            id: true,
            title: true,
        },
    });

    if (!specialties.length) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            "No specialties found!"
        );
    }

    console.log("Specialties loaded...");

    const specialtyList = specialties
        .map((specialty) => `${specialty.id}: ${specialty.title}`)
        .join("\n");

    const prompt = `
You are a medical specialty classification AI.

Based ONLY on the patient's symptoms, identify the most relevant
medical specialties from the provided list.

Do NOT diagnose the patient.
Do NOT prescribe medicine.
Do NOT provide treatment.

Patient symptoms:
${payload.symptoms}

Available specialties:
${specialtyList}

Return ONLY valid JSON:

{
    "specialtyIds": ["id1", "id2"]
}

Select a maximum of 3 specialties.
`;

    console.log("AI analyzing...");

    const completion = await openai.chat.completions.create({
        model: "openrouter/free",

        temperature: 0,

        messages: [
            {
                role: "system",
                content:
                    "You classify symptoms into appropriate medical specialties. Return only JSON.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    const message = completion.choices[0]?.message;

    if (!message) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "AI did not return a response"
        );
    }

    const result = await extractJsonFromMessage(message);

    console.log("AI result:", result);

    // Validate AI response
    if (
        !result ||
        !Array.isArray(result.specialtyIds) ||
        result.specialtyIds.length === 0
    ) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "AI returned invalid specialty suggestions"
        );
    }

    // Find doctors from DB
    const doctors = await prisma.doctor.findMany({
        where: {
            isDeleted: false,

            doctorSpecialties: {
                some: {
                    specialitiesId : {
                        in: result.specialtyIds,
                    },
                },
            },
        },

        include: {
            doctorSpecialties: {
                include: {
                    specialities: true,
                },
            },
        },

        take: 5,
    });

    return {
        symptoms: payload.symptoms,
        suggestedSpecialties: specialties.filter((specialty) =>
            result.specialtyIds.includes(specialty.id)
        ),
        doctors,
    };
}

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
    const result = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true,
                },
            },
            doctoreShedules: {
                include: {
                    schedule: true
                }
            }
        },
    });
    return result;
};


const deleteFromDB = async (id: string): Promise<Doctor> => {
    return await prisma.$transaction(async (transactionClient) => {
        const deleteDoctor = await transactionClient.doctor.delete({
            where: {
                id,
            },
        });

        await transactionClient.user.delete({
            where: {
                email: deleteDoctor.email,
            },
        });

        return deleteDoctor;
    });
};


const softDelete = async (id: string): Promise<Doctor> => {
    return await prisma.$transaction(async (transactionClient) => {
        const deleteDoctor = await transactionClient.doctor.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });

        await transactionClient.user.update({
            where: {
                email: deleteDoctor.email,
            },
            data: {
                status: UserStatus.DELETED,
            },
        });

        return deleteDoctor;
    });
};

export const DoctorService = {
    getAllFromDB,
    updateIntoDB,
    getAISuggestions,
    getByIdFromDB,
    deleteFromDB,
    softDelete
}