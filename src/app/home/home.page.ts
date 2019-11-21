//home.page.ts
import { Component } from "@angular/core";

import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { File as FileNgx, FileEntry } from "@ionic-native/file/ngx";

@Component({
    selector: "app-home",
    templateUrl: "home.page.html",
    styleUrls: ["home.page.scss"]
})
export class HomePage {
    capturedSnapURL: string;
    public filename = "test.jpg";
    constructor(private camera: Camera, private _file: FileNgx) {}

    public async getPhoto(): Promise<void> {
        const options: CameraOptions = {
            quality: 80,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            correctOrientation: true
        };

        const tempImage = await this.camera.getPicture(options);
        // const pathElements = this.createFileElementsFromPath(tempImage);
        const tempFilename = tempImage.substr(tempImage.lastIndexOf("/") + 1);
        const tempBaseFilesystemPath = tempImage.substr(
            0,
            tempImage.lastIndexOf("/") + 1
        );

        const newBaseFilesystemPath = this._file.dataDirectory;

        await this._file
            .copyFile(
                tempBaseFilesystemPath,
                tempFilename,
                newBaseFilesystemPath,
                this.filename
            )
            .then(res => {
                console.log("file saved", res);
                this.readFile();
            })
            .catch(err => {
                console.error("problem saving file", err);
            });

        const storedPhoto = newBaseFilesystemPath + this.filename;
        console.log(storedPhoto);
        // const displayImage = Capacitor.convertFileSrc(storedPhoto);
    }

    public async readFile(): Promise<void> {
        console.log("reading file");
        await this._file
            .readAsDataURL(this._file.dataDirectory, this.filename)
            .then(res => {
                console.log("file read", res);
            })
            .catch(err => {
                console.error("file not read", err);
            });
        console.log("end of reading file.");
    }
}
