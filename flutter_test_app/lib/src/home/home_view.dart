import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_test_app/src/display_pdf_feature/display_pdf_view.dart';
import 'package:flutter_test_app/src/pick_files_feature/pick_files_view.dart';
import 'package:flutter_test_app/src/take_photo_feature/take_photo_view.dart';

import '../settings/settings_view.dart';

/// First view you see when you start the app, with buttons to wanted functionality
class HomeView extends StatelessWidget {
  const HomeView({super.key});

  static const routeName = '/';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocalizations.of(context)!.appTitle),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              // Navigate to the settings page. If the user leaves and returns
              // to the app after it has been killed while running in the
              // background, the navigation stack is restored.
              Navigator.restorablePushNamed(context, SettingsView.routeName);
            },
          ),
        ],
      ),
      body: Center(
        child: Column(
          children: [
            const SizedBox(height: 10),
            ElevatedButton.icon(
                onPressed: () {
                  // Navigate to the take photo page.
                  Navigator.restorablePushNamed(
                    context,
                    TakePhotoView.routeName,
                  );
                },
                icon: const Icon(Icons.camera),
                label: Text(
                    AppLocalizations.of(context)!.takePhotoViewDescription)),
            const SizedBox(height: 10),
            ElevatedButton.icon(
              onPressed: () {
                // Navigate to the pick files page.
                Navigator.pushNamed(context, PickFilesView.routeName);
              },
              icon: const Icon(Icons.file_open),
              label: const Text('Go to files picker view'),
            ),
            const SizedBox(height: 10),
            ElevatedButton.icon(
              onPressed: () {
                // Navigate to the pdf viewer page.
                Navigator.pushNamed(context, DisplayPdfView.routeName);
              },
              icon: const Icon(Icons.picture_as_pdf),
              label: const Text('Go to pdf viewer'),
            ),
          ],
        ),
      ),
    );
  }
}
