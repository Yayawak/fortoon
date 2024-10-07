import { AMAZON_BUCKET_URL } from "@/constant/constants";
import { IStandardResponse } from "@/types/IApiCommunication";

// export async function uploadFileToAmazonS3(formData: FormData) {
export async function uploadFileToAmazonS3(file: File, filename: string) {

    let stdRes: IStandardResponse = {}
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(buffer)

    try {
        const amzRes = await fetch(AMAZON_BUCKET_URL + filename, {
            method: 'put',
            body: buffer
        })
        let msg = `successly send image named [${filename}] to amazon s3`.green
        stdRes.status == 200
        stdRes.msg = msg
        console.log(msg)
        // console.log(amzRes)
    } catch (error) {
        console.error(`${error}`.red)
        stdRes.msg = 'error upload file to amazon server'
        stdRes.msg2 = error
        stdRes.status == 500
    }
    return stdRes
}
