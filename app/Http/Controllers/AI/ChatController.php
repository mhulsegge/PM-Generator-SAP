<?php

namespace App\Http\Controllers\AI;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ChatController extends Controller
{
    /**
     * Stream a chat response from the AI.
     * Compatible with Vercel AI SDK useChat hook.
     */
    public function chat(Request $request): StreamedResponse
    {
        $request->validate([
            'messages' => 'required|array',
            'messages.*.role' => 'required|string|in:user,assistant,system',
            'messages.*.content' => 'required|string',
        ]);

        $messages = $request->input('messages');

        return response()->stream(function () use ($messages) {
            // Get the last user message
            $lastMessage = collect($messages)->last();
            $userMessage = $lastMessage['content'] ?? '';

            // Here you would integrate with NeuronAI
            // For now, we'll simulate a streaming response
            //
            // Example with NeuronAI (uncomment when neuron-laravel is installed):
            //
            // use App\AI\Agents\AssistantAgent;
            //
            // $agent = new AssistantAgent();
            // $stream = $agent->stream($userMessage);
            //
            // foreach ($stream as $chunk) {
            //     echo "0:\"{$this->escapeForStream($chunk->content)}\"\n";
            //     ob_flush();
            //     flush();
            // }

            // Simulated streaming response for demo
            $response = $this->generateDemoResponse($userMessage);
            $words = explode(' ', $response);

            foreach ($words as $index => $word) {
                $text = ($index > 0 ? ' ' : '') . $word;
                // AI SDK Data Stream Protocol format
                echo '0:"' . $this->escapeForStream($text) . "\"\n";

                if (ob_get_level() > 0) {
                    ob_flush();
                }
                flush();

                // Simulate typing delay
                usleep(50000); // 50ms
            }

            // Send finish message
            echo "d:{\"finishReason\":\"stop\"}\n";

        }, 200, [
            'Content-Type' => 'text/plain; charset=utf-8',
            'Cache-Control' => 'no-cache',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    /**
     * Escape text for the AI SDK stream protocol.
     */
    private function escapeForStream(string $text): string
    {
        return addslashes($text);
    }

    /**
     * Generate a demo response (replace with NeuronAI).
     */
    private function generateDemoResponse(string $message): string
    {
        $responses = [
            'Hallo! Ik ben je AI assistent. Hoe kan ik je vandaag helpen?',
            'Dat is een interessante vraag. Laat me daar even over nadenken...',
            'Ik begrijp wat je bedoelt. Hier is mijn antwoord op je vraag.',
        ];

        // Simple keyword matching for demo
        if (str_contains(strtolower($message), 'hallo') || str_contains(strtolower($message), 'hey')) {
            return 'Hallo! Welkom bij de Pontifexx AI Assistent. Ik ben hier om je te helpen met al je vragen. Wat kan ik vandaag voor je doen?';
        }

        if (str_contains(strtolower($message), 'laravel')) {
            return 'Laravel is een fantastisch PHP framework! Deze starter kit gebruikt Laravel 12 met React 19 via Inertia.js. Je kunt de NeuronAI integratie gebruiken om AI-functionaliteit toe te voegen aan je applicatie. Heb je specifieke vragen over Laravel?';
        }

        if (str_contains(strtolower($message), 'help')) {
            return 'Ik kan je helpen met verschillende zaken: vragen over de starter kit, Laravel, React, of algemene programmeer vragen. Stel gerust je vraag en ik doe mijn best om je te helpen!';
        }

        return 'Bedankt voor je bericht! Dit is een demo response. Wanneer je NeuronAI configureert met je API keys, zal ik echte AI-gegenereerde antwoorden kunnen geven. Probeer vragen te stellen over Laravel, de starter kit, of zeg gewoon hallo!';
    }
}
