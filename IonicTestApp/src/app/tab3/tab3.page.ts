import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonGrid, IonCol, IonFabButton, IonIcon, IonFab, IonFabList } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { image, document, folderOpen } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonFabList, IonFab, IonIcon, IonFabButton, IonCol, IonGrid, IonRow, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class Tab3Page {
  constructor(private photoService: PhotoService) {
    addIcons({ image, document, folderOpen });
  }

  selectPhotoFromStorage() {
    this.photoService.pickFromPhotoLibrary();
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
     // send to service here
     this.photoService.pickFromStorage(selectedFile as File);
    }
  }
  
}
