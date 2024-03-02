// lib/views/dashboard_view.dart

import 'package:flutter/material.dart';
import 'package:mobile/services/api_service.dart'; // Import the ApiService

class DashboardScreen extends StatefulWidget {
  @override
  _DashboardViewState createState() => _DashboardViewState();
}

class _DashboardViewState extends State<DashboardScreen> {
  final _apiService = ApiService(); // Instance of the ApiService

  void logout() async {
    await _apiService.logout();
    Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Dashboard'),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: logout,
          ),
        ],
      ),
      // ...
    );
  }
}