import { NextResponse } from "next/server";

export function GET () {
    return NextResponse.json({
        test: "test test /api/test"
    })
}