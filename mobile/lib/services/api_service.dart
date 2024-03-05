// lib/services/api_service.dart

import 'dart:ffi';

import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  final String baseUrl = dotenv.env['BASE_URL']!;
  String? token;

  // Method to login
  Future<void> login(String agentCode) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'agentCode': agentCode,
      }),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      await FlutterSecureStorage()
          .write(key: 'token', value: data['access_token']);
    } else {
      throw Exception(data['message']);
    }
  }

  Future<bool> checkAuth() async {
    final _storage = FlutterSecureStorage();
    final token = await _storage.read(key: 'token');

    if (token == null) {
      return false;
    }

    final response = await http.get(
      Uri.parse('$baseUrl/login/verify'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return true;
    } else {
      await _storage.delete(key: 'token'); // Delete the token if it's not valid
      return false;
    }
  }

  Future<void> logout() async {
    final _storage = FlutterSecureStorage();
    await _storage.delete(key: 'token');
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }

  Future<List<dynamic>> getVisitsByDate(String date) async {
    final _storage = FlutterSecureStorage();
    final token = await _storage.read(key: 'token');

    final user_auth = await http.get(
      Uri.parse('$baseUrl/login/verify'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $token',
      },
    );

    final data = jsonDecode(user_auth.body);
    final id = data['userId'];

    final response = await http.get(
      Uri.parse('$baseUrl/visit/date/$date'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $token',
      },
    );

    final visits = jsonDecode(response.body);

    if (visits is! List) {
      throw Exception('Unexpected response format: ${response.body}');
    }

    print(visits);
    final userVisits = visits.where((visit) => visit['userId'] == id).toList();
    print(userVisits);
    return userVisits;
  }

  Future<Map<String, dynamic>> getClient(int id) async {
    // Append /client/id to the base URL
    var url = Uri.parse('$baseUrl/clients/$id');

    // Send a GET request to the API
    var response = await http.get(url);

    // If the request was successful, parse the JSON response and return it
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      // If the request was not successful, throw an error
      throw Exception('Failed to load client');
    }
  }

  Future<Map<String, dynamic>> getClients() async {
    // Append /clients to the base URL
    var url = Uri.parse('$baseUrl/clients');

    // Send a GET request to the API
    var response = await http.get(url);

    // If the request was successful, parse the JSON response and return it
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      // If the request was not successful, throw an error
      throw Exception('Failed to load clients');
    }
  }

  Future<List<dynamic>> getUserClients() async {
    final _storage = FlutterSecureStorage();
    final token = await _storage.read(key: 'token');

    final user_auth = await http.get(
      Uri.parse('$baseUrl/login/verify'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $token',
      },
    );

    final data = jsonDecode(user_auth.body);
    final id = data['userId'];

    final response = await http.get(
      Uri.parse('$baseUrl/clients'), // replace with your actual endpoint
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $token',
      },
    );

    final clients = jsonDecode(response.body);
    print(clients);
    if (clients is! List) {
      throw Exception('Unexpected response format: ${response.body}');
    }

    final userClients =
        clients.where((client) => client['salesAgentId'] == id).toList();
    return userClients;
  }

  Future<void> createVisit({
    required int clientId,
    required DateTime meetingTime,
    required String conclusion,
    DateTime? nextMeeting,
    int? invoice,
    required String visitCode,
  }) async {
    final _storage = FlutterSecureStorage();
    final token = await _storage.read(key: 'token');
    final user_auth = await http.get(
      Uri.parse('$baseUrl/login/verify'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $token',
      },
    );

    final data = jsonDecode(user_auth.body);
    final id = data['userId'];
    final response = await http.post(
      Uri.parse('$baseUrl/visit'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(<String, dynamic>{
        'clientId': clientId,
        'meetingTime': '${meetingTime.toIso8601String()}Z',
        'conclusion': conclusion,
        'nextMeeting': '${nextMeeting?.toIso8601String()}Z',
        'invoice': invoice,
        'visitCode': visitCode,
        'userId': id,
      }),
    );
    print("Token: $token");
    print(response.body);

    if (response.statusCode == 200) {
      // If the server returns a 200 OK response,
      // then parse the JSON.
      print('Visit created successfully');
    } else {
      // If the server did not return a 200 OK response,
      // then throw an exception.
      throw Exception('Failed to create visit');
    }
  }
}
