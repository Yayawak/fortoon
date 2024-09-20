const AMAZON_BUCKET_URL : string = process.env.AMAZON_BUCKET_URL ?? ""

if (!AMAZON_BUCKET_URL) {
    throw new Error("Need AMAZON_BUCKET_URL environment variable for image management")
}

export  {AMAZON_BUCKET_URL}