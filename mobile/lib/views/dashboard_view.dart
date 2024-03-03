// lib/views/dashboard_view.dart

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/services/api_service.dart'; // Import the ApiService

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
        ],
      ),
    );
  }
}
