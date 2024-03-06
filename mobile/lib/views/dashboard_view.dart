// lib/views/dashboard_view.dart

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/services/api_service.dart'; // Import the ApiService
import 'client_selection_view.dart';
import 'package:url_launcher/url_launcher.dart';
import 'meeting_screen.dart'; // Import your MeetingScreen

class DashboardScreen extends StatefulWidget {
  @override
  _DashboardViewState createState() => _DashboardViewState();
}

class _DashboardViewState extends State<DashboardScreen> {
  final _apiService = ApiService(); // Instance of the ApiService
  DateTime currentDate = DateTime.now();
  List<dynamic> visits = [];

  @override
  void initState() {
    super.initState();
    fetchVisits();
  }

  void logout() async {
    await _apiService.logout();
    Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false);
  }

  void fetchVisits() async {
    String date = DateFormat('yyyy-MM-dd').format(currentDate);
    visits = await _apiService
        .getVisitsByDate(date); // pass the date to the function
    setState(() {});
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
      body: Column(
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              IconButton(
                icon: Icon(Icons.arrow_back),
                iconSize: 30.0,
                onPressed: () {
                  setState(() {
                    currentDate = currentDate.subtract(Duration(days: 1));
                  });
                  fetchVisits();
                },
              ),
              TextButton(
                child: Text(
                  DateFormat('yyyy-MM-dd').format(currentDate),
                  style: TextStyle(fontSize: 20.0),
                ),
                onPressed: () async {
                  final DateTime? picked = await showDatePicker(
                    context: context,
                    initialDate: currentDate,
                    firstDate: DateTime(2000),
                    lastDate: DateTime(2100),
                  );
                  if (picked != null && picked != currentDate) {
                    setState(() {
                      currentDate = picked;
                    });
                    fetchVisits();
                  }
                },
              ),
              IconButton(
                icon: Icon(Icons.arrow_forward),
                iconSize: 30.0,
                onPressed: () {
                  setState(() {
                    currentDate = currentDate.add(Duration(days: 1));
                  });
                  fetchVisits();
                },
              ),
            ],
          ),
          Expanded(
            child: ListView.builder(
              itemCount: visits.length,
              itemBuilder: (context, index) {
                DateTime visitDate =
                    DateTime.parse(visits[index]['nextMeeting']);
                if (DateFormat('yyyy-MM-dd').format(visitDate) ==
                    DateFormat('yyyy-MM-dd').format(currentDate)) {
                  return FutureBuilder(
                    future: _apiService.getClient(visits[index]['clientId']),
                    builder: (BuildContext context, AsyncSnapshot snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return CircularProgressIndicator(); // show a loading spinner while waiting for the data
                      } else if (snapshot.hasError) {
                        return Text(
                            'Error: ${snapshot.error}'); // show an error message if something went wrong
                      } else {
                        return ListTile(
                          title: Text(snapshot.data[
                              'companyName']), // replace 'name' with the actual key for the client's name
                          subtitle:
                              Text(DateFormat('hh:mm a').format(visitDate)),
                          onTap: () => showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              content: Row(
                                children: [
                                  Expanded(
                                    flex: 3,
                                    child: ElevatedButton(
                                      child: Text('Start Meeting'),
                                      onPressed: () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                              builder: (context) =>
                                                  MeetingScreen(
                                                    clientId: visits[index]
                                                        ['clientId'],
                                                  )),
                                        );
                                      },
                                    ),
                                  ),
                                  Expanded(
                                    flex: 1,
                                    child: ElevatedButton(
                                      child: Icon(Icons.map),
                                      onPressed: () async {
                                        final latitude = snapshot.data[
                                            'latitude']; // Replace with your actual latitude and longitude keys
                                        final longitude =
                                            snapshot.data['longitude'];
                                        final googleMapsUrl =
                                            'https://www.google.com/maps/search/?api=1&query=$latitude,$longitude';

                                        if (await canLaunch(googleMapsUrl)) {
                                          await launch(googleMapsUrl);
                                        } else {
                                          throw 'Could not launch $googleMapsUrl';
                                        }
                                      },
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      }
                    },
                  );
                } else {
                  return Container(); // return an empty container for non-matching dates
                }
              },
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: FutureBuilder<List<dynamic>>(
                future: _apiService
                    .fetchVisitsForCurrentUser(), // Replace with your user ID
                builder: (BuildContext context,
                    AsyncSnapshot<List<dynamic>> snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return CircularProgressIndicator();
                  } else if (snapshot.hasError) {
                    return Text('Error: ${snapshot.error}');
                  } else {
                    return ListView.builder(
                      itemCount: snapshot.data?.length ?? 0,
                      itemBuilder: (context, index) {
                        var visit = snapshot.data?[index];
                        return ListTile(
                          title:
                              Text('Requested Visit: ${visit['companyName']}'),
                          subtitle: Text('Details: ${visit['date']}'),
                          trailing: ElevatedButton(
                            child: Icon(Icons.check),
                            onPressed: () {
                              _apiService.deleteVisitRequest(visit['id']);
                              setState(() {});
                            },
                          ),
                        );
                      },
                    );
                  }
                },
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: ElevatedButton(
              child: Text('Am ajuns la client'),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => ClientSelectionScreen()),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
