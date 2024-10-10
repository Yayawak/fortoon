import { dbConnection } from '@/db/dbConnector';
import { IStandardResponse } from '@/types/IApiCommunication';
import { RowDataPacket } from 'mysql2';
import { MissingSlotContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {

    return NextResponse.json({
        test: "ABC"
    }, {
        status: 200,
    });
}
