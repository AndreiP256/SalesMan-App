// lib/controllers/agent_controller.dart

class AgentController {
  bool isValidAgentCode(String code) {
    // For now, let's just check if the code is not empty.
    // In a real app, you would likely check this code against a database or an API.
    return code.isNotEmpty;
  }
}