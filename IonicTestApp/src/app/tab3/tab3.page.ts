import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonGrid, IonCol, IonFabButton, IonIcon, IonFab, IonFabList, IonImg } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { image, document, folderOpen } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { PhotoService } from '../services/photo.service';
import { FileOpener, FileOpenerOptions } from '@capacitor-community/file-opener'
import { Browser } from '@capacitor/browser';
import { CommonModule } from '@angular/common';
import { Platform } from '@ionic/angular';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonImg, IonFabList, IonFab, IonIcon, IonFabButton, IonCol, IonGrid, IonRow, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, CommonModule, PdfViewerModule],
})
export class Tab3Page {
  errorMessage: string = '';
  public pdfSrc: string = '';

  constructor(public photoService: PhotoService, private platform: Platform) {
    addIcons({ image, document, folderOpen });
  }

  async ngOnInit() {
    await this.photoService.loadSaved();
    this.pdfSrc = this.photoService.files.find((file) => file.fileType == 'application/pdf')?.webviewPath ?? '';
  }

  selectPhotoFromStorage() {
    this.photoService.pickFromPhotoLibrary();
  }

  async onFileSelected(event: any) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      // send to service here
      await this.photoService.saveFileToStorage(selectedFile as File);

      if (selectedFile.type == 'application/pdf') {
        this.pdfSrc = this.photoService.files[0].webviewPath ?? this.pdfSrc;
      }
    }
  }

  async open(url: any, filePath: string, fileType?: string) {
    if (this.platform.is('hybrid')) {
      // Mobile
      const fileOpenerOptions: FileOpenerOptions = {
        filePath: filePath,
        contentType: fileType,
      };

      await FileOpener.open(fileOpenerOptions)
        .then(() => {
          // 'File is opened'
        })
        .catch((error) => {
          console.error(error);
          this.errorMessage = error.message;
        });
    } else {
      // Browser
      Browser.open({ url: url });
    }

  }

}
