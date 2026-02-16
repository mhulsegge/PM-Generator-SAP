import { Head } from '@inertiajs/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Send, User, Loader2, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'AI Chat',
        href: '/ai-chat',
    },
];

// Custom useChat hook that works with our Laravel streaming endpoint
function useChat({ api }: { api: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setInput(e.target.value);
        },
        [],
    );

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!input.trim() || isLoading) return;

            const userMessage: Message = {
                id: crypto.randomUUID(),
                role: 'user',
                content: input.trim(),
            };

            const assistantMessage: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: '',
            };

            setMessages((prev) => [...prev, userMessage, assistantMessage]);
            setInput('');
            setIsLoading(true);

            abortControllerRef.current = new AbortController();

            try {
                const response = await fetch(api, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                        Accept: 'text/plain',
                    },
                    body: JSON.stringify({
                        messages: [...messages, userMessage].map((m) => ({
                            role: m.role,
                            content: m.content,
                        })),
                    }),
                    signal: abortControllerRef.current.signal,
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }

                const reader = response.body?.getReader();
                const decoder = new TextDecoder();

                if (!reader) {
                    throw new Error('No reader available');
                }

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk
                        .split('\n')
                        .filter((line) => line.trim());

                    for (const line of lines) {
                        // AI SDK Data Stream Protocol: 0:"text" for text chunks
                        if (line.startsWith('0:')) {
                            const text = line
                                .slice(2)
                                .replace(/^"|"$/g, '')
                                .replace(/\\n/g, '\n')
                                .replace(/\\"/g, '"')
                                .replace(/\\\\/g, '\\');

                            setMessages((prev) => {
                                const newMessages = [...prev];
                                const lastMessage =
                                    newMessages[newMessages.length - 1];
                                if (lastMessage?.role === 'assistant') {
                                    lastMessage.content += text;
                                }
                                return newMessages;
                            });
                        }
                    }
                }
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    console.error('Chat error:', error);
                    setMessages((prev) => {
                        const newMessages = [...prev];
                        const lastMessage = newMessages[newMessages.length - 1];
                        if (
                            lastMessage?.role === 'assistant' &&
                            !lastMessage.content
                        ) {
                            lastMessage.content =
                                'Er is een fout opgetreden. Probeer het opnieuw.';
                        }
                        return newMessages;
                    });
                }
            } finally {
                setIsLoading(false);
                abortControllerRef.current = null;
            }
        },
        [api, input, isLoading, messages],
    );

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    return {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        setMessages: clearMessages,
    };
}

export default function AIChat() {
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        setMessages: clearChat,
    } = useChat({
        api: '/api/chat',
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const setInputValue = (value: string) => {
        const event = {
            target: { value },
        } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(event);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="AI Chat" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card className="flex flex-1 flex-col">
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Bot className="h-5 w-5" />
                                AI Assistent
                            </CardTitle>
                            <CardDescription>
                                Chat met de Pontifexx AI Assistent powered by
                                NeuronAI
                            </CardDescription>
                        </div>
                        {messages.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearChat}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Wissen
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col overflow-hidden">
                        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
                            <div className="space-y-4 pb-4">
                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <Bot className="mb-4 h-12 w-12 text-muted-foreground" />
                                        <h3 className="mb-2 text-lg font-medium">
                                            Welkom bij de AI Assistent
                                        </h3>
                                        <p className="max-w-sm text-sm text-muted-foreground">
                                            Stel een vraag om te beginnen. Ik
                                            kan je helpen met vragen over
                                            Laravel, React, de starter kit, en
                                            meer.
                                        </p>
                                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                                            <SuggestionButton
                                                onClick={() =>
                                                    setInputValue(
                                                        'Hallo, wie ben jij?',
                                                    )
                                                }
                                            >
                                                Hallo, wie ben jij?
                                            </SuggestionButton>
                                            <SuggestionButton
                                                onClick={() =>
                                                    setInputValue(
                                                        'Wat kan deze starter kit?',
                                                    )
                                                }
                                            >
                                                Wat kan deze starter kit?
                                            </SuggestionButton>
                                            <SuggestionButton
                                                onClick={() =>
                                                    setInputValue(
                                                        'Help me met Laravel',
                                                    )
                                                }
                                            >
                                                Help me met Laravel
                                            </SuggestionButton>
                                        </div>
                                    </div>
                                )}
                                {messages.map((message) => (
                                    <ChatMessage
                                        key={message.id}
                                        role={message.role}
                                        content={message.content}
                                        isStreaming={
                                            isLoading &&
                                            message.role === 'assistant' &&
                                            message ===
                                                messages[messages.length - 1]
                                        }
                                    />
                                ))}
                            </div>
                        </ScrollArea>
                        <form
                            onSubmit={handleSubmit}
                            className="mt-4 flex gap-2"
                        >
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Typ je bericht..."
                                disabled={isLoading}
                                className="flex-1"
                            />
                            <Button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                                <span className="sr-only">Verstuur</span>
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function ChatMessage({
    role,
    content,
    isStreaming,
}: {
    role: string;
    content: string;
    isStreaming?: boolean;
}) {
    const isUser = role === 'user';

    return (
        <div
            className={cn(
                'flex items-start gap-3',
                isUser && 'flex-row-reverse',
            )}
        >
            <Avatar className="h-8 w-8">
                <AvatarFallback
                    className={cn(
                        isUser
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-primary text-primary-foreground',
                    )}
                >
                    {isUser ? (
                        <User className="h-4 w-4" />
                    ) : (
                        <Bot className="h-4 w-4" />
                    )}
                </AvatarFallback>
            </Avatar>
            <div
                className={cn(
                    'max-w-[80%] rounded-lg px-4 py-3',
                    isUser ? 'bg-primary text-primary-foreground' : 'bg-muted',
                )}
            >
                {content ? (
                    <p className="text-sm whitespace-pre-wrap">{content}</p>
                ) : isStreaming ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">
                            Aan het typen...
                        </span>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function SuggestionButton({
    children,
    onClick,
}: {
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="rounded-full border border-input px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
            {children}
        </button>
    );
}
