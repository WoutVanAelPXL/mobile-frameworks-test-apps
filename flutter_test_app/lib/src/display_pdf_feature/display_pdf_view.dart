import 'package:flutter/material.dart';

/// View where the functionality to displaying a pdf from storage is tested
class DisplayPdfView extends StatelessWidget {
  const DisplayPdfView({super.key});

  static const routeName = '/pdf_viewer';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('DisplayPdfView')),
      body: const Center(child: Text('Under construction')),
    );
  }
}
