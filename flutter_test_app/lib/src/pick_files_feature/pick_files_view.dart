import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test_app/src/display_pdf_feature/display_pdf_view.dart';
import 'package:mime/mime.dart';

import '../take_photo_feature/take_photo_view.dart';

/// View where the functionality to pick files from storage is tested
class PickFilesView extends StatelessWidget {
  const PickFilesView({super.key});

  static const routeName = '/pick_files';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pick files from your device')),
      body: const Center(
          child:
              Text('If you pick a picture it gets shown on a separate screen')),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          try {
            FilePickerResult? result = await FilePicker.platform.pickFiles();

            if (result != null) {
              File file = File(result.files.single.path!);

              if (!context.mounted) return;

              final mimeType = lookupMimeType(file.path);

              // Display the file if it is a image
              if (mimeType!.startsWith('image/')) {
                // If the file was uploaded, display it on a new screen.
                await Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => DisplayPictureScreen(
                      // Pass the automatically generated path to
                      // the DisplayPictureScreen widget.
                      imagePath: file.path,
                    ),
                  ),
                );
              } else if (mimeType.contains('pdf')) {
                // send file to display_pdf_view
                await Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => DisplayPdfView(
                      // Pass the automatically generated path to
                      // the DisplayPdfView widget.
                      pdfPath: file.path,
                    ),
                  ),
                );
              }
            } else {
              // User canceled the picker
            }
          } catch (e) {
            // If an error occurs, log the error to the console.
            print(e);
          }
        },
        child: const Icon(Icons.file_upload),
      ),
    );
  }
}
