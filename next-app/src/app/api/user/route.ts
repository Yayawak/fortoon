import { dbConnection } from "@/db/dbConnector";
import { IStandardResponse } from "@/types/IApiCommunication";
import { GenericRowDataPacket } from "@/types/IRowDataPacket";
import {  IUser } from "@/types/IUser";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req:  Request) {
    // let ret : 
    const [results, fs] = await dbConnection.query<GenericRowDataPacket<IUser>[]>(`select * from User`)

    // console.log(results)
    // results = 
    // const updatedObj = Object.fromEntries(
    //     Object.entries(results).filter(([key]) => key !== 'password')
    // );
    // console.log(updatedObj)

    const stdRes : IStandardResponse =  {
        data: results
    }
    return NextResponse.json(stdRes, {
        status: 200
    })
}

export async function POST (req:  Request) {

    const res = await req.json()

    const expectedBody : IUser = res


    console.log(res)
    // console.log(req.body)

    return NextResponse.json({
        test: "test post user"
    })
}