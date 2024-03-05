import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:mobile/services/api_service.dart'; // Import the ApiService
import 'package:permission_handler/permission_handler.dart';
import 'meeting_screen.dart'; // Import your MeetingScreen

class NewClientFormView extends StatefulWidget {
    @override
    _NewClientFormViewState createState() => _NewClientFormViewState();
}

class _NewClientFormViewState extends State<NewClientFormView> {
    final _formKey = GlobalKey<FormState>();
    final _descriptionController = TextEditingController();
    final _companyNameController = TextEditingController();
    final _taxCodeController = TextEditingController();
    final _totalOrderController = TextEditingController();
    final _clientCodeController = TextEditingController();
    Position? _currentPosition;

    @override
    void initState() {
        super.initState();
        _getCurrentLocation();
    }

    _getCurrentLocation() async {
        PermissionStatus permission = await Permission.locationWhenInUse.request();

        if (permission.isGranted) {
            Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.best)
                .then((Position position) {
            setState(() {
                _currentPosition = position;
            });
            }).catchError((e) {
            print('Error getting current position: $e');
            });
        } else {
            print('Location permission not granted');
        }
    }

    ApiService apiService = ApiService();

    @override
    Widget build(BuildContext context) {
        return Scaffold(
            appBar: AppBar(
                title: Text('New Client Form'),
            ),
            body: SingleChildScrollView(
                child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Form(
                        key: _formKey,
                        child: Column(
                            children: <Widget>[
                                TextFormField(
                                    controller: _descriptionController,
                                    decoration: InputDecoration(labelText: 'Description'),
                                    validator: (value) {
                                        if (value == null || value.isEmpty) {
                                            return 'Please enter a description';
                                        }
                                        return null;
                                    },
                                ),
                                TextFormField(
                                    controller: _companyNameController,
                                    decoration: InputDecoration(labelText: 'Company Name'),
                                    validator: (value) {
                                        if (value == null || value.isEmpty) {
                                            return 'Please enter a company name';
                                        }
                                        return null;
                                    },
                                ),
                                TextFormField(
                                    controller: _taxCodeController,
                                    decoration: InputDecoration(labelText: 'Tax Code'),
                                    validator: (value) {
                                        if (value == null || value.isEmpty) {
                                            return 'Please enter a tax code';
                                        }
                                        return null;
                                    },
                                ),
                                if (_currentPosition != null) Text('Latitude: ${_currentPosition!.latitude}, Longitude: ${_currentPosition!.longitude}'),
                                TextFormField(
                                    controller: _totalOrderController,
                                    decoration: InputDecoration(labelText: 'Total Order'),
                                    validator: (value) {
                                        if (value == null || value.isEmpty) {
                                            return 'Please enter a total order';
                                        }
                                        return null;
                                    },
                                ),
                                TextFormField(
                                    controller: _clientCodeController,
                                    decoration: InputDecoration(labelText: 'Client Code'),
                                    validator: (value) {
                                        if (value == null || value.isEmpty) {
                                            return 'Please enter a client code';
                                        }
                                        return null;
                                    },
                                ),
                                ElevatedButton(
                                    onPressed: () async {
                                        if (_formKey.currentState?.validate() ?? false) {
                                            // If the form is valid, display a Snackbar.
                                            ScaffoldMessenger.of(context).showSnackBar(
                                                SnackBar(content: Text('Processing Data')),
                                            );
                                            if (_currentPosition != null) {
                                                try {
                                                    int clientId = await apiService.createClient(
                                                        description: _descriptionController.text,
                                                        companyName: _companyNameController.text,
                                                        taxCode: _taxCodeController.text,
                                                        latitude: _currentPosition!.latitude,
                                                        longitude: _currentPosition!.longitude,
                                                        totalOrder: double.parse(_totalOrderController.text).toString(),
                                                        clientCode: _clientCodeController.text,
                                                    );
                                                    Navigator.push(
                                                        context,
                                                        MaterialPageRoute(
                                                            builder: (context) => MeetingScreen(clientId: clientId),
                                                        ),
                                                    );
                                                } catch (e) {
                                                    print('Error creating client: $e');
                                                }
                                            } else {
                                                print('Current position is null');
                                            }
                                        }
                                    },
                                    child: Text('Submit'),
                                ),
                            ],
                        ),
                    ),
                ),
            ),
        );
    }
}