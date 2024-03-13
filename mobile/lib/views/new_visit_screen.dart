import 'package:flutter/material.dart';
import 'package:mobile/services/api_service.dart';

class NewVisitScreen extends StatefulWidget {
  @override
  _NewVisitScreenState createState() => _NewVisitScreenState();
}

class _NewVisitScreenState extends State<NewVisitScreen> {
  final _formKey = GlobalKey<FormState>();
  final _apiService = ApiService();
  int? _selectedClientId;
  DateTime _meetingTime = DateTime.now();
  String _conclusion = '';
  DateTime? _nextMeeting;
  int? _invoice;
  String _visitCode = '';

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _meetingTime, // Refer initial date to the current date
      firstDate: DateTime(2015, 8),
      lastDate: DateTime(2101),
    );
    if (picked != null && picked != _meetingTime)
      setState(() {
        _meetingTime = picked;
      });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('New Visit'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: EdgeInsets.all(16.0),
          children: <Widget>[
            FutureBuilder<List>(
              future: _apiService.getClients(),
              builder: (BuildContext context, AsyncSnapshot<List> snapshot) {
                if (snapshot.hasData) {
                  return DropdownButtonFormField<int>(
                    value: _selectedClientId,
                    items: snapshot.data!.map((client) {
                      return DropdownMenuItem<int>(
                        value: client['id'],
                        child: Text(client['companyName']),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setState(() {
                        _selectedClientId = value;
                      });
                    },
                    validator: (value) {
                      if (value == null) {
                        return 'Please select a client';
                      }
                      return null;
                    },
                  );
                } else if (snapshot.hasError) {
                  return Text('Error: ${snapshot.error}');
                } else {
                  return CircularProgressIndicator();
                }
              },
            ),
            TextFormField(
              decoration: InputDecoration(labelText: 'Conclusion'),
              onSaved: (value) {
                _conclusion = value ?? '';
              },
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter a conclusion';
                }
                return null;
              },
            ),
            TextFormField(
              decoration: InputDecoration(labelText: 'Invoice'),
              onSaved: (value) {
                _invoice = int.tryParse(value ?? '');
              },
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter an invoice';
                }
                return null;
              },
            ),
            TextFormField(
              decoration: InputDecoration(labelText: 'Visit Code'),
              onSaved: (value) {
                _visitCode = value ?? '';
              },
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter a visit code';
                }
                return null;
              },
            ),
            ElevatedButton(
              onPressed: () => _selectDate(context),
              child: Text('Select date'),
            ),
            // Add more fields here
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.save),
       onPressed: () async {
        if (_formKey.currentState!.validate()) {
          _formKey.currentState!.save();
          try {
            await _apiService.createVisit(
              clientId: _selectedClientId!,
              meetingTime: _meetingTime,
              conclusion: _conclusion,
              nextMeeting: _meetingTime,
              invoice: _invoice,
              visitCode: _visitCode,
            );
            Navigator.pop(context);
          } catch (e) {
            print('Error creating visit: $e');
          }
        }
  },
      ),
    );
  }
}