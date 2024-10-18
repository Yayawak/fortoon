export type ImageType = 
    "storyCover" |
    "chapterImage" |
    "profilePicture"

export const setStandardImageName = (imageName: string , imageType: ImageType) => {
    return `${imageType}-${imageName}-${new Date()}}`
}