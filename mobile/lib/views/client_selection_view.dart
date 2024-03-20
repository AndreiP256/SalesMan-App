// lib/views/client_selection_view.dart

import 'package:flutter/material.dart';
import 'package:mobile/services/api_service.dart'; // Import the ApiService
import 'meeting_screen.dart'; // Import your MeetingScreen
import 'new_client_form_view.dart';

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
        title: Text('Selectează clientul'),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.search),
            onPressed: () async {
              final results = await showSearch(
                context: context,
                delegate: ClientSearch(clients),
              );
              if (results != null && results is Map<String, dynamic> && results['id'] != null) {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => MeetingScreen(clientId: results['id'])),
                );
              }
            },
          ),
        ],
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
            child: Text('Adaugă client nou'),
            onPressed: () {
              Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => NewClientFormView()),
                );
            },
          ),
          ),
        ],
      ),
    );
  }
}

class ClientSearch extends SearchDelegate<Map<String, dynamic>> {
  final List<dynamic> clients;

  ClientSearch(this.clients);

  @override
  List<Widget> buildActions(BuildContext context) {
    return [
      IconButton(
        icon: Icon(Icons.clear),
        onPressed: () {
          query = '';
        },
      ),
    ];
  }

  @override
  Widget buildLeading(BuildContext context) {
    return IconButton(
      icon: AnimatedIcon(
        icon: AnimatedIcons.menu_arrow,
        progress: transitionAnimation,
      ),
      onPressed: () {
        close(context, {});
      },
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    final suggestionList = clients.where((client) {
      return client['companyName'].toLowerCase().contains(query.toLowerCase());
    }).toList();

    return ListView.builder(
      itemCount: suggestionList.length,
      itemBuilder: (context, index) => ListTile(
        title: Text(suggestionList[index]['companyName']),
        onTap: () {
          close(context, suggestionList[index]);
        },
      ),
    );
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    final suggestionList = clients.where((client) {
      return client['companyName'].toLowerCase().contains(query.toLowerCase());
    }).toList();

    return ListView.builder(
      itemCount: suggestionList.length,
      itemBuilder: (context, index) => ListTile(
        title: Text(suggestionList[index]['companyName']),
        onTap: () {
          close(context, suggestionList[index]);
        },
      ),
    );
  }
}