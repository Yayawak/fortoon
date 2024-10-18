import { dbConnection } from "@/db/dbConnector";
import { verifyToken } from "@/backend_lib/auth/auth.cookie";
import { formDataToJsonObject } from "@/backend_lib/parsers";
import { postStoryScheme } from "@/schemes/story.scheme";
import { IStandardResponse } from "@/types/IApiCommunication";
import { GenericRowDataPacket } from "@/types/IRowDataPacket";
import { IUser } from "@/types/IUser";
import { mkdirSync } from "fs";
import { RowDataPacket } from "mysql2";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/backend_lib/image_uploading/image_upload.lib";



export async function GET(req: NextRequest) {
    const verifiedRes = await verifyToken(req);
    if (verifiedRes.status !== 200) {
        return NextResponse.json({
            msg: verifiedRes.msg
        }, { status: verifiedRes.status });
    }

    // Step 1: Retrieve all stories
    let [storyRs,] = await dbConnection.query<GenericRowDataPacket<any>[]>(
        `
        SELECT * 
        FROM Story s
        `
    );

    // Step 2: Use Promise.all with map to handle asynchronous chapter and genre fetching
    const ret = await Promise.all(storyRs.map(async (s) => {
        const storyId = s.sId;

        // Fetch chapters for the current story
        let [chapterRs,] = await dbConnection.query<GenericRowDataPacket<any>[]>(
            `
                SELECT * 
                FROM Chapter c
                WHERE c.storyId = ?  
            `,
            [storyId]
        );

        // Fetch genres for the current story
        let [genreRs,] = await dbConnection.query<GenericRowDataPacket<any>[]>(
            `
                SELECT g.gId, g.genreName 
                FROM Genre g
                JOIN StoryGenre sg ON g.gId = sg.genreId
                WHERE sg.storyId = ?
            `,
            [storyId]
        );

        // Return the story object along with its chapters and genres
        return {
            ...s,
            chapters: chapterRs,
            genres: genreRs
        };
    }));

    const stdRes: IStandardResponse = {
        data: ret
    };

    return NextResponse.json(stdRes, {
        status: 200
    });
}


export async function POST(req: Request) {

    let stdRes: IStandardResponse = {
    }

    // const storyData = postStoryScheme.safeParse(req.body)

    let parsed = null
    let formData : FormData
    try {
        formData = await req.formData()
        if (formData === undefined) {
            stdRes = {
                msg: "need formData"
            }
            console.log(stdRes)
            return NextResponse.json(stdRes, {
                status: 400
            })
        }
        // console.log(typeof formData)
        // console.log(formData)
        // console.log(formData.get("age"))
        const jsonObject = formDataToJsonObject(formData)
        console.log(jsonObject)
        parsed = postStoryScheme.parse(jsonObject)
        // const coverImageFile = formData.get("coverImage") as File

        // console.log("cover image")
        // console.log(coverImageFile)

        // let filename = coverImageFile.name
           // const file: File = parsed.profilePic as unknown as File;
        const coverImage = formData.get("coverImage") as File
        const curr = new Date()
        const filename = `storyCover-${curr.toString()}-${coverImage.name}`

        await uploadImage(coverImage, filename)

        try {
            await dbConnection.execute(`
                insert into Story (
                    authorId,
                    title,
                    introduction,
                    coverImageUrl
                )
                    values
                (
                    '${parsed.authorId}',
                    '${parsed.title}',
                    '${parsed.introduction}',
                    '${filename}'
                );
            `)
            stdRes = {
                msg: "successly created a story.",
            }
            return NextResponse.json(stdRes, {
                status: 200
            })

        } catch (error) {
            console.error(`${error}`.bgRed)
            stdRes = {
                msg: "error creating new Story",
                msg2: error
            }
            return NextResponse.json(stdRes, {
                status: 500
            })

        }

    } catch (error: any) {
        // console.error(error)
        stdRes = {
            msg2: "fail parse data",
            msg: error
        }
        return NextResponse.json(stdRes, {
            status: 500
        })
    }
    if (!parsed) {
        return
    }




}