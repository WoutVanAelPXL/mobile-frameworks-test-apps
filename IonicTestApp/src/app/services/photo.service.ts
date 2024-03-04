import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  public files: UserFile[] = [];
  private PHOTO_STORAGE: string = 'photos';
  private FILE_STORAGE: string = 'files';
  private platform: Platform;

  constructor(platform: Platform) {
    this.platform = platform;
  }

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    // Save the picture and add it to photo collection
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);

    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  public async pickFromPhotoLibrary() {
    // Pick a photo
    const pickedPhoto = (await Camera.pickImages({
      quality: 100,
      limit: 1
    })).photos[0];

    // Save the picture and add it to photo collection
    const savedImageFile = await this.savePicture(pickedPhoto as Photo);
    this.photos.unshift(savedImageFile);

    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  public async saveFileToStorage(pickedFile: File) {
    // Read & save file or something :)
    const reader = new FileReader();

    // Start reading the file and await for it to be loaded
    const arrayBuffer: ArrayBuffer = await new Promise((resolve, reject) => {
      reader.onloadend = () => {
        if (reader.readyState === FileReader.DONE) {
          resolve(reader.result as ArrayBuffer);
        } else {
          reject(new Error("FileReader error"));
        }
      };

      reader.readAsArrayBuffer(pickedFile);
    });

    // Fetch the photo, read as a blob, then convert to base64 format
    const blob = new Blob([arrayBuffer], { type: pickedFile.type });

    const base64Data = await this.convertBlobToBase64(blob) as string;

    console.log(pickedFile);

    const savedFile = await Filesystem.writeFile({
      path: pickedFile.name,
      data: base64Data,
      directory: Directory.Data
    });

    console.log(savedFile);

    const readFile = await Filesystem.readFile({
      path: pickedFile.name,
      directory: Directory.Data
    })

    console.log(readFile);

    let savedFileAsUserFile: UserFile;
    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      savedFileAsUserFile = {
        fileName: pickedFile.name,
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        fileType: pickedFile.type
      };
    }
    else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      savedFileAsUserFile = {
        fileName: pickedFile.name,
        filepath: pickedFile.name,
        webviewPath: window.URL.createObjectURL(blob),
        fileType: pickedFile.type
      };

      console.log(blob.type);
      console.log(window.URL.createObjectURL(blob));

    }

    this.files.unshift(savedFileAsUserFile);

    Preferences.set({
      key: this.FILE_STORAGE,
      value: JSON.stringify(this.files),
    });
  }

  public async loadSaved() {
    // Retrieve cached photo array data
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];

    // Easiest way to detect when running on the web:
    // “when the platform is NOT hybrid, do this”
    if (!this.platform.is('hybrid')) {
      // Display the photo by reading into base64 format
      for (let photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data
        });

        // Ensure readFile.data is a string before using it
        if (typeof readFile.data === 'string') {
          // Web platform only: Load the photo as base64 data
          photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
        } else {
          // Handle the case where readFile.data is not a string
          console.error('File data is not a string:', readFile.data);
        }
      }
    }

    // [Files]
    const fileValue = (await Preferences.get({ key: this.FILE_STORAGE })).value;
    this.files = (fileValue ? JSON.parse(fileValue) : []) as UserFile[];

    if (!this.platform.is('hybrid')) {
      // Display the photo by reading into base64 format
      for (let file of this.files) {
        console.log(file);
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
          path: file.filepath,
          directory: Directory.Data
        });

        console.log(file);

        // Ensure readFile.data is a string before using it
        if (typeof readFile.data === 'string') {
          // Web platform only: Load the photo as base64 data
          file.webviewPath = `data:${file.fileType};base64,${readFile.data}`;
        } else {
          // Handle the case where readFile.data is not a string
          console.error('File data is not a string:', readFile.data);
        }
      }
    }
  }

  public async deletePicture(photo: UserPhoto, position: number) {
    // Remove this photo from the Photos reference data array
    this.photos.splice(position, 1);

    // Update photos array cache by overwriting the existing photo array
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });

    // delete photo file from filesystem
    const filename = photo.filepath.substring(photo.filepath.lastIndexOf('/') + 1);

    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data
    });
  }

  // Save picture to file on device
  private async savePicture(photo: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);

    // Write the file to the data directory
    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath
      } as UserPhoto;
    }
  }

  private async readAsBase64(photo: Photo): Promise<string> {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: photo.path!
      });

      return file.data as string;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export interface UserFile {
  fileName: string;
  filepath: string;
  webviewPath?: string;
  fileType: string;
}
