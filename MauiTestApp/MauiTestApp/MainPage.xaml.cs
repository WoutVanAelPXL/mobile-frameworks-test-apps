#if ANDROID
    using System.Net;
#endif

namespace MauiTestApp
{
    public partial class MainPage : ContentPage
    {
        private string? _pickedPdf;

        public MainPage()
        {
            InitializeComponent();

            DisplayPdf("maui.pdf");

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

        private async void OpenPdfAsync(object sender, EventArgs e)
        {
            string pdfFilePath = Path.Combine(FileSystem.CacheDirectory, "maui.pdf");

            if (_pickedPdf != null)
            {
                pdfFilePath = _pickedPdf;
            }

            // Copy the test pdf from the package to the CacheDirectory, otherwise it cannot be launched.
            if (!File.Exists(pdfFilePath))
            {
                await using Stream sourceStream = await FileSystem.OpenAppPackageFileAsync("maui.pdf");
                await using FileStream localFileStream = File.OpenWrite(pdfFilePath);

                await sourceStream.CopyToAsync(localFileStream);
            }

            string result = await OpenPdf(pdfFilePath);

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

                else if (result.FileName.EndsWith("pdf", StringComparison.OrdinalIgnoreCase))
                {
                    DisplayPdf(localFilePath);
                    _pickedPdf = localFilePath;
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

        public async Task<string> OpenPdf(string fullFilePath)
        {
            string popoverTitle = "Open pdf file";

            bool fileWasOpened = await Launcher.Default.OpenAsync(new OpenFileRequest(popoverTitle, new ReadOnlyFile(fullFilePath)));

            return fileWasOpened ? "File has been opened by the pdf viewer" : "File didn't open for some reason";
        }

        public void DisplayPdf(string filePath)
        {
#if ANDROID
            Microsoft.Maui.Handlers.WebViewHandler.Mapper.AppendToMapping("pdfviewer", (handler, View) =>
            {
                handler.PlatformView.Settings.AllowFileAccess = true;
                handler.PlatformView.Settings.AllowFileAccessFromFileURLs = true;
                handler.PlatformView.Settings.AllowUniversalAccessFromFileURLs = true;
            });

            PdfWebView.Source = $"file:///android_asset/pdfjs/web/viewer.html?file=file:///android_asset/{WebUtility.UrlEncode(filePath)}";
#else
            PdfWebView.Source = filePath;
#endif
        }
    }

}
