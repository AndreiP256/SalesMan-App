// lib/views/login_view.dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'package:flutter/material.dart';
import 'package:mobile/services/api_service.dart'; // Import the ApiService

class LoginView extends StatefulWidget {
  @override
  _LoginViewState createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  final _formKey = GlobalKey<FormState>();
  final _agentCodeController =
      TextEditingController(); // Controller for the agent code text field
  final _apiService = ApiService(); // Instance of the ApiService

  @override
  void initState() {
    super.initState();
    checkAuth();
  }

  void checkAuth() async {
    bool isAuthenticated = await _apiService.checkAuth();
    if (isAuthenticated) {
      final _storage = FlutterSecureStorage();
      String? role = await _storage.read(key: 'role') as String?;
      print("ROLE: $role");
      if (role == 'DRIVER') {
        Navigator.pushNamed(context, '/driver_dashboard');
      } else {
        Navigator.pushNamed(context, '/dashboard');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Login'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: <Widget>[
              TextFormField(
                controller: _agentCodeController, // Use the controller here
                decoration: InputDecoration(labelText: 'Agent Code'),
                validator: (value) {
                  if (value?.isEmpty ?? true) {
                    return 'Please enter your Agent Code';
                  }
                  return null;
                },
              ),
              ElevatedButton(
                onPressed: () async {
                  // Make the callback async
                  if (_formKey.currentState != null &&
                      _formKey.currentState!.validate()) {
                    // Process data.
                    try {
                      await _apiService.login(
                          _agentCodeController.text); // Call the login function

                      final _storage = FlutterSecureStorage();
                      String? role =
                          await _storage.read(key: 'role') as String?;
                      print("ROLE: $role");
                      if (role == 'DRIVER') {
                        Navigator.pushNamed(context, '/driver_dashboard');
                      } else {
                        Navigator.pushNamed(context, '/dashboard');
                      }
                      // Navigate to the next screen if login is successful
                    } catch (e) {
                      // Show an error message if login fails
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Login failed: $e')),
                      );
                    }
                  }
                },
                child: Text('Login'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
