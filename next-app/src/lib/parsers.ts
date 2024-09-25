export const formDataToJsonObject = (formData: FormData) => {
    const data: { [key: string]: any } = {};

    formData.forEach((value, key) => (data[key] = value));

    return data
}