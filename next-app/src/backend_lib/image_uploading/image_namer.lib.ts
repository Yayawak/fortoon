export type ImageType = 
    "storyCover" |
    "chapterImage" |
    "profilePicture"

export const setStandardImageName = (imageName: string , imageType: ImageType) => {
    const d = new Date()
    return `${imageType}-${imageName}-${d.toISOString()}`
}