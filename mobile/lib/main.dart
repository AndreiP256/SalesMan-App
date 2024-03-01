// lib/main.dart

import 'package:flutter/material.dart';
import 'views/login_view.dart';

void main() {
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
    );
  }
}