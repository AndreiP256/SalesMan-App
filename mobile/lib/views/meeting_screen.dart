import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dashboard_view.dart';
import 'package:mobile/services/api_service.dart';

class MeetingScreen extends StatefulWidget {
  final int clientId;
  MeetingScreen({required this.clientId});
  @override
  _MeetingScreenState createState() => _MeetingScreenState();
}

class _MeetingScreenState extends State<MeetingScreen> {
  final _summaryController = TextEditingController();
  final _invoiceValueController = TextEditingController();
  final _visitCodeController = TextEditingController();
  late DateTime _meetingStartTime;
  DateTime? _selectedDate;

  @override
  void initState() {
    super.initState();
    _startMeeting(widget.clientId);
  }

  Future<void> _startMeeting(int clientId) async {
  _meetingStartTime = DateTime.now();

  // Save meeting start time and client ID to shared preferences
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString('meetingStartTime', _meetingStartTime.toIso8601String());
  await prefs.setInt('clientId', clientId);
}

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2015, 8),
      lastDate: DateTime(2101),
    );
    if (picked != null && picked != _selectedDate)
      setState(() {
        _selectedDate = picked;
      });
  }

  Future<void> _endMeeting() async {
    // Here you can handle the end of the meeting.
    // For example, you can save the summary to your database.
    String summary = _summaryController.text;
    String invoiceValue = _invoiceValueController.text;
    String visitCode = _visitCodeController.text;
    print('Meeting ended. Summary: $summary, Invoice Value: $invoiceValue, Visit Code: $visitCode');

    ApiService apiService = ApiService();
    apiService.createVisit(
    clientId: widget.clientId, // replace with your client ID
    meetingTime: _meetingStartTime,
    conclusion: _summaryController.text,
    nextMeeting: _selectedDate, // replace with your selected date
    invoice: int.tryParse(_invoiceValueController.text),
    visitCode: _visitCodeController.text,
  );

    // Clear meeting start time from shared preferences
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('meetingStartTime');
    await prefs.remove('clientId');

    // Call your createVisit method here with the collected data

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => DashboardScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Meeting'),
        automaticallyImplyLeading: false,
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          children: <Widget>[
            TextField(
              controller: _summaryController,
              minLines: 3,
              maxLines: 5,
              decoration: InputDecoration(
                labelText: 'Meeting Summary',
                border: OutlineInputBorder(),
              ),
            ),
            TextField(
              controller: _invoiceValueController,
              decoration: InputDecoration(
                labelText: 'Invoice Value',
                border: OutlineInputBorder(),
              ),
            ),
            TextField(
              controller: _visitCodeController,
              decoration: InputDecoration(
                labelText: 'Visit Code',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 8.0),
            TextButton(
              child: Text('Select Next Meeting Date'),
              onPressed: () => _selectDate(context),
            ),
            TextButton(
              child: Text('End Meeting'),
              style: ButtonStyle(
                backgroundColor:
                    MaterialStateProperty.all<Color>(Colors.purple),
                foregroundColor: MaterialStateProperty.all<Color>(Colors.white),
              ),
              onPressed: _endMeeting,
            ),
          ],
        ),
      ),
    );
  }
}