import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";
import { dbConnection } from "@/db/dbConnector";
import { setJwtTokenCookie } from "@/lib/auth/login.lib";

// Dummy user data (replace with real authentication logic)
// const users = [
//     { username: "admin", password: "admin123" },
//     { username: "user", password: "user123" },
// ];

// Secret key for JWT (store this securely, e.g., in an env variable)
const JWT_SECRET = process.env.JWT_SECRET || ""
// console.log(JWT_SECRET)
// Token expiration time (adjust as needed)
const JWT_EXPIRATION = "1h"; // 1 hour


export async function POST(req: Request) {
    let jsobj = null
    try {
        jsobj = await req.json();
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error: "Need request body.",
        }, { status: 400 });
    }

    try {
        const [resultSet, fs] = await dbConnection.query<RowDataPacket[]>("select * from User")
        // console.log(resultSet)

        // if (!jsobj) {
        //     return NextResponse.json(
        //         { error: "Need body for processing" },
        //         { status: 401 }
        //     );
        // }
        const { username, password } = jsobj
        // console.log("A")
        // console.log(resultSet)

        // Find the user in the dummy users array
        const user = resultSet.find(
            (u) => u.username === username && u.password === password
        );
        // console.log(jsobj)
        // console.log(resultSet)

        if (!user) {
            // Invalid credentials
            return NextResponse.json(
                { error: "Invalid username or password" },
                { status: 401 }
            );
        }

        let response = NextResponse.json({ message: `You're welcome ${username} :D` });
        response = setJwtTokenCookie({ username, uId: user.uId }, response);
        return response;

        return response;
    } catch (error) {
        return NextResponse.json({
            error: "Error processing request",
            error2: error
        }, { status: 400 });
    }
}