export const checkStringIfExcedesChar = (str: string, maxLength: number) => {
    if (str.length < maxLength) {
        return str
    }
    else {
        let value = str.substring(0, maxLength) + '...'
        return value
    }
}

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export function formatDateTime(timestamp: string): string {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function base64ToFile(base64String: string, fileName: string): File {
    // Split the Base64 string to remove metadata
    const base64Data = base64String.split(';base64,').pop() || '';

    // Decode Base64 to binary data
    const binaryData = atob(base64Data);

    // Create a Uint8Array from the binary data
    const uint8Array = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
    }

    // Create a Blob from the binary data
    const blob = new Blob([uint8Array], { type: 'application/octet-stream' });

    // Create a File from the Blob
    const file = new File([blob], fileName, { type: 'application/octet-stream' });

    return file;
}

