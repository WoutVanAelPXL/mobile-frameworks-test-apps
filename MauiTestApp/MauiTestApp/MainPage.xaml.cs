namespace MauiTestApp
{
    public partial class MainPage : ContentPage
    {

        public MainPage()
        {
            InitializeComponent();

        }

        private async void TakePhotoAsync(object sender, EventArgs e)
        {
            string result = await TakePhoto();

            FeedbackLabel.Text = result;

            // for accessibility
            SemanticScreenReader.Announce(result);
        }

        private async void PickPhotoAsync(object sender, EventArgs e)
        {
            string result = await PickPhoto();

            FeedbackLabel.Text = result;
        }

        public async Task<string> TakePhoto()
        {
            if (!MediaPicker.Default.IsCaptureSupported) return "Photo capture is not supported";

            FileResult photo = await MediaPicker.Default.CapturePhotoAsync();

            if (photo == null) return "No photo has been taken";

            // save the file into local storage
            string localFilePath = Path.Combine(FileSystem.CacheDirectory, photo.FileName);

            using Stream sourceStream = await photo.OpenReadAsync();
            using FileStream localFileStream = File.OpenWrite(localFilePath);

            await sourceStream.CopyToAsync(localFileStream);

            // show where the photo has been stored
            return "photo has been stored at " + localFilePath;
        }

        public async Task<string> PickPhoto()
        {
            FileResult photo = await MediaPicker.Default.PickPhotoAsync();

            if (photo == null) return "No photo has been picked";

            // save the file into local storage
            string localFilePath = Path.Combine(FileSystem.CacheDirectory, photo.FileName);

            using Stream sourceStream = await photo.OpenReadAsync();
            using FileStream localFileStream = File.OpenWrite(localFilePath);

            await sourceStream.CopyToAsync(localFileStream);

            // show where the photo has been stored
            return "photo has been stored at " + localFilePath;
        }
    }

}
