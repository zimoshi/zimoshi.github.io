export async function playEncryptedVideo({ encryptedFile, keyFile, videoElement }) {
  if (!encryptedFile || !keyFile || !videoElement) {
    throw new Error("Missing required parameters: encryptedFile, keyFile, videoElement");
  }

  const [encryptedArrayBuffer, keyArrayBuffer] = await Promise.all([
    encryptedFile.arrayBuffer(),
    keyFile.arrayBuffer()
  ]);

  const key = await crypto.subtle.importKey(
    "raw",
    keyArrayBuffer,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );

  const iv = encryptedArrayBuffer.slice(0, 16); // First 16 bytes = IV
  const data = encryptedArrayBuffer.slice(16);  // Rest = encrypted content

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: iv },
    key,
    data
  );

  const blob = new Blob([decryptedBuffer], { type: "video/mp4" });
  const url = URL.createObjectURL(blob);
  videoElement.src = url;
}
