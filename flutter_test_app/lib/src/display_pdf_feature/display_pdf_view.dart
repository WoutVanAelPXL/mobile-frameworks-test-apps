import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:open_filex/open_filex.dart';
import 'package:path_provider/path_provider.dart';
import 'package:pdf_render/pdf_render_widgets.dart';

/// View where the functionality to displaying a pdf from storage is tested
class DisplayPdfView extends StatelessWidget {
  final String pdfPath;

  const DisplayPdfView({super.key, this.pdfPath = 'assets/files/testpdf.pdf'});

  static const routeName = '/pdf_viewer';

  Uri get _url => Uri.parse('file:$pdfPath');

  Future<String> _copyPdfToLocal() async {
    final Directory directory = await getTemporaryDirectory();
    final String localPdfPath = '${directory.path}/testpdf.pdf';
    final File file = File(localPdfPath);
    if (!file.existsSync()) {
      final ByteData data = await rootBundle.load(pdfPath);
      final List<int> bytes = data.buffer.asUint8List();
      await file.writeAsBytes(bytes);
    }
    return file.path;
  }

  Future<void> _launchUrl() async {
    try {
      if (pdfPath == 'assets/files/testpdf.pdf') {
        String pathOfLocalPdf = await _copyPdfToLocal();
        await OpenFilex.open(pathOfLocalPdf);
      } else {
        await OpenFilex.open(_url.toFilePath());
      }
    } catch (ex) {
      print(ex);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('DisplayPdfView')),
      body: Center(
        child: Column(
          children: [
            ElevatedButton(
              onPressed: _launchUrl,
              child: const Text('Open pdf with local app.'),
            ),
            Expanded(
              child: pdfPath == 'assets/files/testpdf.pdf'
                  ? PdfViewer.openFutureFile(() async => await _copyPdfToLocal())
                  : PdfViewer.openFile(_url.toFilePath()),
            ),
          ],
        ),
      ),
    );
  }
}
