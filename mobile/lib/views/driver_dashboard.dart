import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mobile/services/api_service.dart';
import 'package:url_launcher/url_launcher.dart';

class DriverDashboard extends StatefulWidget {
  @override
  _DriverDashboardState createState() => _DriverDashboardState();
}

class _DriverDashboardState extends State<DriverDashboard> {
  ApiService _apiService = ApiService();

  void _launchMapsUrl(double lat, double lng) async {
    final url = 'https://www.google.com/maps/search/?api=1&query=$lat,$lng';
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }

  void logout() async {
    await _apiService.logout();
    Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text('Driver Dashboard'),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.search),
            onPressed: () async {
              print('Search button pressed'); // Debug statement
              var clientsFuture = _apiService.getClients();
              print('Got clients future: $clientsFuture'); // Debug statement
              var clients = await clientsFuture;
              var mappedClients = clients.map((client) => client as Map<String, dynamic>).toList();
              showSearch(
                context: context,
                delegate: ClientSearch(
                  Future.value(mappedClients),
                  _launchMapsUrl,
                ),
              );
            },
          ),
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: logout,
          ),
        ],
      ),
      body: FutureBuilder(
        future: _apiService.getClients(),
        builder: (BuildContext context, AsyncSnapshot snapshot) {
          if (snapshot.hasData) {
            return ListView.builder(
              itemCount: snapshot.data.length,
              itemBuilder: (context, index) {
                var client = snapshot.data[index];
                return ListTile(
                  title: Text(client['companyName']),
                  trailing: ElevatedButton(
                    child: Icon(Icons.map),
                    onPressed: () {
                      _launchMapsUrl(client['latitude'].toDouble(),
                          client['longitude'].toDouble());
                    },
                  ),
                );
              },
            );
          } else if (snapshot.hasError) {
            return Text('Error: ${snapshot.error}');
          } else {
            return CircularProgressIndicator();
          }
        },
      ),
    );
  }
}

class ClientSearch extends SearchDelegate {
  final Future<List<Map<String, dynamic>>> clientsFuture;
  final Function(double, double) launchMapsUrl;

  ClientSearch(this.clientsFuture, this.launchMapsUrl);

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
      icon: Icon(Icons.arrow_back),
      onPressed: () {
        close(context, null);
      },
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    return Container();
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    return FutureBuilder(
      future: clientsFuture,
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return Center(child: CircularProgressIndicator());
        }

        final suggestions = snapshot.data?.where((client) {
          return client['companyName'].toLowerCase().contains(query.toLowerCase());
        }).toList();

        return ListView.builder(
          itemCount: suggestions?.length ?? 0,
          itemBuilder: (context, index) {
            var client = suggestions?[index];
            return ListTile(
              title: Text(client?['companyName'] ?? ''),
              trailing: ElevatedButton(
                child: Icon(Icons.map),
                onPressed: () {
                  launchMapsUrl(client?['latitude'].toDouble(), client?['longitude'].toDouble());
                },
              ),
            );
          },
        );
      },
    );
  }
}