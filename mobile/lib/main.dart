// lib/main.dart

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'views/login_view.dart';
import 'views/dashboard_view.dart';
import 'views/meeting_screen.dart'; // Import your MeetingScreen

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
      home: FutureBuilder<bool>(
        future: _checkOngoingMeeting(),
        builder: (BuildContext context, AsyncSnapshot<bool> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return CircularProgressIndicator();
          } else if (snapshot.hasError) {
            return Text('Error: ${snapshot.error}');
          } else {
            if (snapshot.data == true) {
              return FutureBuilder<int?>(
                future: _meetingClientId(),
                builder: (BuildContext context, AsyncSnapshot<int?> clientIdSnapshot) {
                  if (clientIdSnapshot.connectionState == ConnectionState.waiting) {
                    return CircularProgressIndicator();
                  } else if (clientIdSnapshot.hasError) {
                    return Text('Error: ${clientIdSnapshot.error}');
                  } else {
                    int? clientId = clientIdSnapshot.data;
                    // Use clientId here
                    return MeetingScreen(clientId: clientId!); // Replace with your widget
                  }
                },
              );
            } else {
              return LoginView();
            }
          }
        },
      ),
      routes: {
        '/dashboard': (context) => DashboardScreen(),
      },
    );
  }

  Future<bool> _checkOngoingMeeting() async {
    final prefs = await SharedPreferences.getInstance();
    int? clientId = prefs.getInt('clientId');
    return clientId != null && clientId > 0;
  }

  Future<int?> _meetingClientId() async {
    final prefs = await SharedPreferences.getInstance();
    int? clientId = prefs.getInt('clientId');
    return clientId;
  }
}