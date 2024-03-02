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
}
