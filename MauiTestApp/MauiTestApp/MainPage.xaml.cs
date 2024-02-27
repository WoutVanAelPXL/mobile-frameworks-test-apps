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

        private async void PickFileAsync(object sender, EventArgs e)
        {
            string result = await PickFile();

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

            HeroImg.Source = ImageSource.FromFile(localFilePath);

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

            HeroImg.Source = ImageSource.FromFile(localFilePath);

            // show where the photo has been stored
            return "photo has been stored at " + localFilePath;
        }

        public async Task<string> PickFile()
        {
            try
            {
                var result = await FilePicker.Default.PickAsync();

                if (result == null) return "No file has been picked";

                // save the file into local storage
                string localFilePath = Path.Combine(FileSystem.CacheDirectory, result.FileName);

                using Stream sourceStream = await result.OpenReadAsync();
                using FileStream localFileStream = File.OpenWrite(localFilePath);

                await sourceStream.CopyToAsync(localFileStream);

                if (result.FileName.EndsWith("jpg", StringComparison.OrdinalIgnoreCase) ||
                    result.FileName.EndsWith("png", StringComparison.OrdinalIgnoreCase))
                {
                    HeroImg.Source = ImageSource.FromFile(localFilePath);
                }

                // show where the photo has been stored
                return "photo has been stored at " + localFilePath;

            }
            catch (Exception ex)
            {
                // The user canceled or something went wrong
                return "Something went wrong";
            }
        }
    }

}
