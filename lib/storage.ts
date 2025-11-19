// lib/storage.ts
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { storage } from "./firebase";

// Upload single image
export const uploadImage = async (
  file: File,
  path: string
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Upload multiple images
export const uploadImages = async (
  files: File[],
  basePath: string
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file, index) => {
      const path = `${basePath}/${Date.now()}-${index}-${file.name}`;
      return uploadImage(file, path);
    });
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

// Delete image
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

// Delete multiple images
export const deleteImages = async (imageUrls: string[]): Promise<void> => {
  try {
    const deletePromises = imageUrls.map((url) => deleteImage(url));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting images:", error);
    throw error;
  }
};

// Delete all images in a folder
export const deleteFolder = async (folderPath: string): Promise<void> => {
  try {
    const folderRef = ref(storage, folderPath);
    const list = await listAll(folderRef);
    const deletePromises = list.items.map((item) => deleteObject(item));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw error;
  }
};
