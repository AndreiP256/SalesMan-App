// lib/main.dart

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'views/login_view.dart';
import 'views/dashboard_view.dart';

Future main() async {
  await dotenv.load();
  runApp(ClientVisitApp());
}

class ClientVisitApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Client Visit App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: LoginView(),
      routes: {
        '/dashboard': (context) => DashboardScreen(),
      },
    );
  }
}