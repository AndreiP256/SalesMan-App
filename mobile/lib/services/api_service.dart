// lib/services/api_service.dart

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
    await FlutterSecureStorage().write(key: 'token', value: data['access_token']);
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
}
