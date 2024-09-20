import { AMAZON_BUCKET_URL } from "@/constant/constants";
import { dbConnection } from "@/db/dbConnector";
import { IStandardResponse } from "@/types/IApiCommunication";
import { NextRequest, NextResponse } from "next/server";

// curl -X PUT localhost:3000/api/user/profilePicture -d "{}"
export async function PUT(req: Request) {

    let stdRes: IStandardResponse = {}
    try {
        const res = await req.json()

        const uId: string = res.uId
        const profilePicUrl: string = res.profilePicUrl

        if (!uId) {
            stdRes = {
                msg: "need 'uId'"
            }
            return NextResponse.json(stdRes, {
                status: 400
            })
        }
        else if (!profilePicUrl) {
            stdRes = {
                msg: "need 'profilePicUrl'"
            }
            return NextResponse.json(stdRes, {
                status: 400
            })
        }

        // console.log(res)
        // console.log(req.body)
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