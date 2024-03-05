// lib/views/client_selection_view.dart

import 'package:flutter/material.dart';
import 'package:mobile/services/api_service.dart'; // Import the ApiService
import 'meeting_screen.dart'; // Import your MeetingScreen

class ClientSelectionScreen extends StatefulWidget {
  @override
  _ClientSelectionScreenState createState() => _ClientSelectionScreenState();
}

class _ClientSelectionScreenState extends State<ClientSelectionScreen> {
  final _apiService = ApiService(); // Instance of the ApiService
  List<dynamic> clients = [];

  @override
  void initState() {
    super.initState();
    fetchClients();
  }

  void fetchClients() async {
    clients = await _apiService.getUserClients() as List<dynamic>;
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Select Client'),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: clients.length,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text(clients[index]['companyName']),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => MeetingScreen(clientId: clients[index]['id'])),
                    ); // Pass the client to the MeetingScreen
                  },
                );
              },
            ),
          ),
          Padding(padding:const EdgeInsets.all(8.0),
            child: ElevatedButton(
            child: Text('Add New Client'),
            onPressed: () {
              // navigate to the new client screen
            },
          ),
          ),
        ],
      ),
    );
  }
}