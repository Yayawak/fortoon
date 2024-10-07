import { AMAZON_BUCKET_URL } from "@/constant/constants";
import { dbConnection } from "@/db/dbConnector";
import { IStandardResponse } from "@/types/IApiCommunication";
import { NextRequest, NextResponse } from "next/server";

// curl -X PUT localhost:3733/api/user/profilePicture -d "{}"
// only accept data as form-data
export async function PUT(req: NextRequest) {

    let stdRes: IStandardResponse = {}

    const formData = await req.formData();
    console.log(formData)
    let file = formData.get("file");
    const uId = formData.get("uId");
    

    if (!uId) {
        stdRes = {
            msg: "need 'uId'"
        }
        return NextResponse.json(stdRes, {
            status: 400
        })
    }

    console.log(file)
    if (!file) {
        // If no file is received, return a JSON response with an error and a 400 status code
        stdRes = {
            msg: "No files received."
        }
        return NextResponse.json(stdRes, { status: 400 });
    }

    // const f = file as File
    // Convert the file data to a Buffer
    // if file.slice()
    file = (file as File)
    const buffer =  Buffer.from(await file.arrayBuffer());


    // console.log(buffer)

    console.log("ABC")
    // console.log(AMAZON_BUCKET_URL)
    // console.log(file.name)

    try {
        const url = AMAZON_BUCKET_URL + file.name
        console.log(url)
        // console.log(`url = ${url}`.blue)
        const amzRes = await fetch(url, {
            method: 'PUT',
            body: buffer
        })
        if (amzRes.status !== 200) {
            // console.error()
            // console.error(await amzRes.json())
            stdRes['msg'] = "can not upload file to amazon"
            stdRes['msg2'] = await amzRes.json()
            console.error(stdRes)
            return NextResponse.json(stdRes, {
                status: amzRes.status
            })
        }
        else {
            console.log("successly send image to amazon s3".green)
            console.log()
            // console.log(amzRes)
            // stdRes['msg'] = "successly send image to amazon s3"
            // stdRes['msg2'] = await amzRes.json()


        }
    } catch (error) {
        // console.error("Error on upload to amazon")
        console.error(`${error}`.red)
        console.log(error)
        stdRes['msg'] = "error upload to amazon server"
        stdRes['msg2'] = error


    }
    const profilePicUrl = file.name

    try {
        dbConnection.execute(`update User set profilePicUrl = '${profilePicUrl}' where uId = ${uId}`)

        stdRes = {
            msg: "success edited profile picture."
        }
        return NextResponse.json(stdRes, {
            status: 200
        })

    } catch (error) {
        console.error(error)

        stdRes = {
            msg: "unhandled sql error",
            msg2: error
        }
        return NextResponse.json(stdRes, {
            status: 500
        })

    }


}



export async function DELETE(req: Request) {

    let stdRes: IStandardResponse = {}
    try {
        const res = await req.json()

        const uId: string = res.uId

        if (!uId) {
            stdRes = {
                msg: "need 'uId'"
            }
            return NextResponse.json(stdRes, {
                status: 400
            })
        }


        try {
            dbConnection.execute(`update User set profilePicUrl = null where uId = ${uId}`)

            stdRes = {
                msg: "success deleted profile picture."
            }
            return NextResponse.json(stdRes, {
                status: 200
            })

        } catch (error) {
            console.error(error)

            stdRes = {
                msg: "unhandled sql error",
                msg2: error
            }
            return NextResponse.json(stdRes, {
                status: 500
            })

        }

    } catch (error) {
        stdRes = {
            msg: "error parsing json (need body) or something",
            msg2: error
        }
        return NextResponse.json(stdRes, {
            status: 500
        })

    }

}