// lib/services/api_service.dart

import 'dart:ffi';

import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

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
}
