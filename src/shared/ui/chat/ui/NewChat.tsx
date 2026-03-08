'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, User, Car, MessageCircle, Check, Clock, AlertCircle } from 'lucide-react';
import { Input } from "@shared/shadcn/components/input";
import { Button } from "@shared/shadcn/components/button";

type MessageStatusType = 'sending' | 'sent' | 'delivered' | 'failed';

interface MessageStatus {
    id: string;
    status: MessageStatusType;
    timestamp: Date;
}

interface Message {
    id?: string;
    sender_id: string;
    sender_type: 'user' | 'driver';
    message: string;
    created_at: string;
    type?: 'message' | 'history_message' | 'delivery_confirmation' | 'connection_ready';
    status?: MessageStatusType;
    isLocal?: boolean;
}

interface WebSocketMessage {
    type: 'connection_ready' | 'message' | 'history_message' | 'delivery_confirmation' | string;
    message_id?: string;
    sender_id?: string;
    sender_type?: 'user' | 'driver';
    message?: string;
    created_at?: string;
    delivered?: boolean;
}

interface DeliveryConfirmationMessage extends WebSocketMessage {
    type: 'delivery_confirmation';
    message_id: string;
    delivered: boolean;
}




type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface ChatProps {
    userType: 'user' | 'driver';
    userId: string;
    targetId: string;
    userName: string;
    targetName: string;
}

export const NewChat: React.FC<ChatProps> = ({ userType, userId, targetId, userName, targetName }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
    const [messageStatuses, setMessageStatuses] = useState<Map<string, MessageStatus>>(new Map());
    const websocketRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const generateMessageId = (): string => {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    };

    const handleWebSocketMessage = useCallback((data: WebSocketMessage) => {
        switch (data.type) {
            case 'connection_ready':
                console.log('Connection ready');
                break;

            case 'message':
                if (data.message_id && data.sender_id && data.sender_type && data.message && data.created_at) {
                    const incomingMessage: Message = {
                        id: data.message_id,
                        sender_id: data.sender_id,
                        sender_type: data.sender_type,
                        message: data.message,
                        created_at: data.created_at,
                        type: data.type
                    };
                    setMessages(prev => [...prev, incomingMessage]);
                }
                break;

            case 'history_message':
                if (data.message_id && data.sender_id && data.sender_type && data.message && data.created_at) {
                    const historyMessage: Message = {
                        id: data.message_id,
                        sender_id: data.sender_id,
                        sender_type: data.sender_type,
                        message: data.message,
                        created_at: data.created_at,
                        type: data.type
                    };
                    setMessages(prev => [...prev, historyMessage]);
                }
                break;

            case 'delivery_confirmation':
                if (data.message_id && typeof data.delivered !== 'undefined') {
                    handleDeliveryConfirmation(data as DeliveryConfirmationMessage);
                }
                break;

            default:
                if (data.sender_id && data.message && data.sender_type && data.created_at) {
                    const legacyMessage: Message = {
                        sender_id: data.sender_id,
                        sender_type: data.sender_type,
                        message: data.message,
                        created_at: data.created_at
                    };
                    setMessages(prev => [...prev, legacyMessage]);
                }
                break;
        }
    }, [])

    useEffect(() => {
        const connectWebSocket = () => {
            setConnectionStatus('connecting');
            const wsUrl = `wss://primibox.com/ws/${userType}?id=${userId}&target_id=${targetId}`;

            const ws = new WebSocket(wsUrl);
            websocketRef.current = ws;

            ws.onopen = () => {
                setIsConnected(true);
                setConnectionStatus('connected');
                console.log('WebSocket connected');
            };

            ws.onmessage = (event: MessageEvent) => {
                try {
                    const data: WebSocketMessage = JSON.parse(event.data);
                    handleWebSocketMessage(data);
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            };

            ws.onclose = () => {
                setIsConnected(false);
                setConnectionStatus('disconnected');
                console.log('WebSocket disconnected');
            };

            ws.onerror = (error: Event) => {
                console.error('WebSocket error:', error);
                setConnectionStatus('disconnected');
            };
        };

        connectWebSocket();

        return () => {
            if (websocketRef.current) {
                websocketRef.current.close();
            }
        };
    }, [userType, userId, targetId, handleWebSocketMessage]);

    const handleDeliveryConfirmation = (data: DeliveryConfirmationMessage) => {
        const messageId = data.message_id;
        const delivered = data.delivered;

        setMessageStatuses(prev => {
            const newStatuses = new Map(prev);
            const existingStatus = newStatuses.get(messageId);
            if (existingStatus) {
                existingStatus.status = delivered ? 'delivered' : 'failed';
                newStatuses.set(messageId, existingStatus);
            }
            return newStatuses;
        });

        setMessages(prev => prev.map(msg => {
            if (msg.id === messageId && msg.isLocal) {
                return {
                    ...msg,
                    status: delivered ? 'delivered' : 'failed',
                    isLocal: false
                };
            }
            return msg;
        }));
    };

    const sendMessage = () => {
        if (newMessage.trim() && websocketRef.current && isConnected) {
            const messageId = generateMessageId();
            const now = new Date();

            const localMessage: Message = {
                id: messageId,
                sender_id: userId,
                sender_type: userType,
                message: newMessage.trim(),
                created_at: now.toISOString(),
                status: 'sending',
                isLocal: true
            };

            setMessages(prev => [...prev, localMessage]);

            setMessageStatuses(prev => {
                const newStatuses = new Map(prev);
                newStatuses.set(messageId, {
                    id: messageId,
                    status: 'sending',
                    timestamp: now
                });
                return newStatuses;
            });

            const messageData = {
                type: 'message',
                message: newMessage.trim(),
                message_id: messageId
            };

            try {
                websocketRef.current.send(JSON.stringify(messageData));

                setMessageStatuses(prev => {
                    const newStatuses = new Map(prev);
                    const existingStatus = newStatuses.get(messageId);
                    if (existingStatus) {
                        existingStatus.status = 'sent';
                        newStatuses.set(messageId, existingStatus);
                    }
                    return newStatuses;
                });

                setMessages(prev => prev.map(msg => {
                    if (msg.id === messageId) {
                        return { ...msg, status: 'sent' };
                    }
                    return msg;
                }));

                setNewMessage('');
            } catch (error) {
                console.error('Error sending message:', error);

                setMessageStatuses(prev => {
                    const newStatuses = new Map(prev);
                    const existingStatus = newStatuses.get(messageId);
                    if (existingStatus) {
                        existingStatus.status = 'failed';
                        newStatuses.set(messageId, existingStatus);
                    }
                    return newStatuses;
                });

                setMessages(prev => prev.map(msg => {
                    if (msg.id === messageId) {
                        return { ...msg, status: 'failed' };
                    }
                    return msg;
                }));
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const getConnectionStatusColor = (): string => {
        switch (connectionStatus) {
            case 'connected': return 'bg-green-500';
            case 'connecting': return 'bg-yellow-500';
            case 'disconnected': return 'bg-red-500';
            default: return 'bg-zinc-500';
        }
    };

    const getMessageStatusIcon = (message: Message): JSX.Element | null => {
        if (message.sender_id !== userId) return null;

        const status = message.status || 'delivered';

        switch (status) {
            case 'sending':
                return <Clock className="w-3 h-3 text-zinc-400 animate-spin" />;
            case 'sent':
                return <Check className="w-3 h-3 text-zinc-400" />;
            case 'delivered':
                return <Check className="w-3 h-3 text-blue-400" />;
            case 'failed':
                return <AlertCircle className="w-3 h-3 text-red-400" />;
            default:
                return <Check className="w-3 h-3 text-blue-400" />;
        }
    };

    const getMessageStatusText = (message: Message): string => {
        if (message.sender_id !== userId) return '';

        const status = message.status || 'delivered';

        switch (status) {
            case 'sending':
                return 'Отправляется...';
            case 'sent':
                return 'Отправлено';
            case 'delivered':
                return 'Доставлено';
            case 'failed':
                return 'Ошибка отправки';
            default:
                return 'Доставлено';
        }
    };

    const formatTime = (dateString: string): string => {
        return new Date(dateString).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="w-full max-w-2xl mx-auto h-[600px] flex flex-col  text-white rounded-lg shadow-lg">
            <div className="p-4 shadow-2xl">
                <div className="flex items-center justify-end">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}></div>
                        <div className="text-sm">
                            {connectionStatus === 'connected' ? 'Онлайн' :
                                connectionStatus === 'connecting' ? 'Подключение...' : 'Не в сети'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto p-4 chat-scrollbar">
                    <div className="space-y-3">
                        {messages.length === 0 ? (
                            <div className="text-center text-zinc-500 py-8">
                                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Начните общение!</p>
                            </div>
                        ) : (
                            messages.map((message, index) => {
                                const isOwnMessage = message.sender_id === userId;
                                return (
                                    <div
                                        key={message.id || index}
                                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} message-animation`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                                                isOwnMessage
                                                    ? 'bg-blue-600/80 text-white rounded-br-none'
                                                    : 'bg-zinc-800 text-white rounded-bl-none'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                {message.sender_type === 'user' ? (
                                                    <User className="w-3 h-3 text-blue-300" />
                                                ) : (
                                                    <Car className="w-3 h-3 text-green-300" />
                                                )}
                                                <span className="text-xs opacity-75">
                                                    {message.sender_type === 'user' ? 'Пользователь' : 'Водитель'}
                                                </span>
                                            </div>
                                            <p className="text-sm leading-relaxed">{message.message}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className={`text-xs ${isOwnMessage ? 'text-blue-200' : 'text-zinc-400'}`}>
                                                    {formatTime(message.created_at)}
                                                </p>
                                                {isOwnMessage && (
                                                    <div className="flex items-center gap-1">
                                                        {getMessageStatusIcon(message)}
                                                        <span className={`text-xs ${isOwnMessage ? 'text-blue-200' : 'text-zinc-400'}`}>
                                                            {getMessageStatusText(message)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <div className="flex items-center gap-2">
                    <Input
                        type="text"
                        placeholder="Введите сообщение..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        disabled={!isConnected}
                    />
                    <Button
                        size={'icon'}
                        onClick={sendMessage}
                        disabled={!isConnected || !newMessage.trim()}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <style jsx>{`
                .message-animation {
                    animation: message-slide-in 0.3s ease-out;
                    transform-origin: bottom;
                }
                
                @keyframes message-slide-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};