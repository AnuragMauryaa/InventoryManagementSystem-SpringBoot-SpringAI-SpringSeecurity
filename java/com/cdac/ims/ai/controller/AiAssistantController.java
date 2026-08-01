package com.cdac.ims.ai.controller;

import lombok.Data;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class AiAssistantController {

    private final ChatModel chatModel;

    public AiAssistantController(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        SystemMessage systemMessage = new SystemMessage(
                "You are an intelligent Inventory Management Assistant for the IMS platform. " +
                "Your job is to help the user check stock levels and order statuses. " +
                "ALWAYS use the provided functions to fetch real database metrics before answering. " +
                "If a user asks about a product, ask for the SKU if they didn't provide it. " +
                "Be concise and professional.");
                
        UserMessage userMessage = new UserMessage(request.getMessage());

        // Securely bind the database tools you created earlier
     // New code with the forced model
        OpenAiChatOptions options = OpenAiChatOptions.builder()
                .withModel("llama-3.3-70b-versatile") // This forces the new model, ignoring Eclipse's cache
                .withFunction("getProductStock")
                .withFunction("getSalesOrderStatus")
                .build();
        Prompt prompt = new Prompt(List.of(systemMessage, userMessage), options);
        
        // Execute the call using the stable ChatModel interface
        String aiResponse = chatModel.call(prompt).getResult().getOutput().getContent();

        return new ChatResponse(aiResponse);
    }

    @Data
    public static class ChatRequest {
        private String message;
    }

    @Data
    public static class ChatResponse {
        private final String reply;
    }
}