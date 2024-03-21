import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { addIcons } from 'ionicons';
import { notifications } from 'ionicons/icons';
import { LocalNotifications, LocalNotificationSchema, PermissionStatus } from '@capacitor/local-notifications';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonIcon, IonFabButton, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class Tab1Page {
  constructor() {
    addIcons({ notifications })
  }

  async sendNotification() {
    // Check permissions
    let permissionStatus: PermissionStatus = await LocalNotifications.checkPermissions();
    if (permissionStatus.display != 'granted') permissionStatus = await LocalNotifications.requestPermissions();
    if (permissionStatus.display != 'granted') return;

    const notification1: LocalNotificationSchema = {
      title: "Ionic Notification",
      body: "This notification should be delayed by 10 seconds",
      id: 100,
      schedule: { at: new Date(Date.now() + 10000) }
    };

    await LocalNotifications.schedule({ notifications: [notification1] });
  }
}
