using Plugin.LocalNotification;
using Plugin.LocalNotification.EventArgs;

namespace MauiTestApp
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();

            // Local Notification tap event listener
            LocalNotificationCenter.Current.NotificationActionTapped += OnNotificationActionTapped;

            MainPage = new AppShell();
        }

        private async void OnNotificationActionTapped(NotificationActionEventArgs e)
        {
            if (e.IsDismissed)
            {
                // Send a new one :)
                if (await LocalNotificationCenter.Current.AreNotificationsEnabled() == false)
                {
                    await LocalNotificationCenter.Current.RequestNotificationPermission();
                }

                var notification = new NotificationRequest
                {
                    NotificationId = 100,
                    Title = "Hey! niet wegslepen",
                    Description = "GRRRRR",
                    ReturningData = "Dummy data", // Returning data when tapped on notification.
                    //Schedule =
                    //{
                    //    NotifyTime = DateTime.Now.AddSeconds(1) // Used for Scheduling local notification, if not specified notification will show immediately.
                    //},
                    Android =
                    {
                        ChannelId = "my_channel_01"
                    }
                };
                await LocalNotificationCenter.Current.Show(notification);
                return;
            }
            if (e.IsTapped)
            {
                // your code goes here
                return;
            }
            // if Notification Action are setup
            switch (e.ActionId)
            {
                // your code goes here
            }
        }
    }
}
