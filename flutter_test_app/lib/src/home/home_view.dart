import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import '../sample_feature/sample_item_details_view.dart';
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
                  // Navigate to the details page.
                  Navigator.restorablePushNamed(
                    context,
                    SampleItemDetailsView.routeName,
                  );
                },
                icon: const Icon(Icons.camera),
                label: Text(AppLocalizations.of(context)!.takePhotoViewDescription)),
          ],
        ),
      ),
    );
  }
}
