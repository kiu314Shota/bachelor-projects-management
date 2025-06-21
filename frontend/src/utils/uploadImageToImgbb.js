export const uploadImageToImgbb = async (file) => {
    const apiKey = "d62e8bf94567bec73b47d6066a90f257";

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Image upload failed");
    }

    const data = await response.json();
    return data.data.url; // ✅ Return image URL
};
