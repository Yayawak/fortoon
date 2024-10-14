import { dbConnection } from '@/db/dbConnector';
import { IStandardResponse } from '@/types/IApiCommunication';
import { RowDataPacket } from 'mysql2';
import { NextResponse } from 'next/server';

type TReqParams =  {
    params: {
        storyId: string
        chapterId: string
    }
}

export async function GET(req: Request, { params }: TReqParams ) {
// export async function GET(req: Request, { params }: { params: { chapterId: string } }) {
    const { chapterId } = params;

    const stdRes : IStandardResponse = {
    }

    console.log(params)

    const [rs, fs] = await dbConnection.query<RowDataPacket[]>(`
        select * from 
        User u 
        join
        Story s
        on u.uId = s.authorId
        where u.uId = ${chapterId}
    `)
    if (rs.length == 0) {
        stdRes.msg = "Story not found"

        return NextResponse.json(stdRes, {
            status: 404
        })
    }

    console.log(rs)
    // Simulate fetching author data

    const data = rs
    // stdRes.data = 


    const authorData = {
        chapterId,
        name: "Author Name",
        message: 'Author data fetched successfully'
    };

    return NextResponse.json(data, {
        status: 200,
    });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    
    let stdRes = { message: 'Author data sent successfully', id };

    try {
        const body = await req.json();
        // Assuming 'body' contains the new data to save, e.g., author details.
        console.log("Author POST data:", body);

        stdRes = {
            id,
            ...body,
            message: 'Author data successfully received and processed',
        };

        return NextResponse.json(stdRes, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error processing request', error }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    
    let stdRes = { message: 'Author data updated successfully', id };

    try {
        const body = await req.json();
        console.log("Author PUT data:", body);
        // Process the update logic here

        return NextResponse.json(stdRes, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error updating author', error }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    // Simulate deleting the author
    const stdRes = { message: 'Author data deleted successfully', id };

    return NextResponse.json(stdRes, { status: 200 });
}