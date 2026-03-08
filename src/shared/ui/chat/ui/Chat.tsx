'use client';

import React, { useState, useRef, useEffect, ReactElement } from 'react';
import { Modal } from "@shared/ui/modal";
import { Button } from "@shared/shadcn/components/button";
import { Send } from "lucide-react";
import { Textarea } from "@shared/shadcn/components/textarea";
import { Input } from "@shared/shadcn/components/input";
import { cn } from "@shared/shadcn/lib/utils";

// Типы сообщений
export type MessageType = 'incoming' | 'outgoing';

export interface Message {
    id: string;
    text: string;
    type: MessageType;
    timestamp: Date;
    sender?: string;
    isRead?: boolean;
}

export interface ChatProps {
    messages?: Message[];
    onSendMessage?: (text: string) => void;
    title?: string;
    description?: string;
    isLoading?: boolean;
    placeholder?: string;
    maxHeight?: string;
    triggerButton?: ReactElement;
    avatarUrl?: string;
    showTimestamps?: boolean;
    showReadStatus?: boolean;
}

export const Chat: React.FC<ChatProps> = ({
                                              messages = [],
                                              onSendMessage,
                                              title = 'Поддержка',
                                              description = 'Вы подключены',
                                              isLoading = false,
                                              placeholder = 'Введите сообщение...',
                                              maxHeight = '600px',
                                              triggerButton = <Button>Чат</Button>,
                                              avatarUrl,
                                              showTimestamps = true,
                                              showReadStatus = false,
                                          }) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [localMessages, setLocalMessages] = useState<Message[]>(messages);

    // Прокрутка к последнему сообщению при добавлении новых
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [localMessages]);

    // Обновление локального состояния при изменении входящих сообщений
    useEffect(() => {
        setLocalMessages(messages);
    }, [messages]);

    // Обработка отправки сообщения
    const handleSendMessage = () => {
        if (inputValue.trim() && onSendMessage) {
            onSendMessage(inputValue.trim());
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Форматирование времени
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Modal title={<div className='flex items-center justify-center flex-col w-full pb-4 pt-2'>{title}<p className='text-sm font-normal text-zinc-400 mt-1'>{description}</p></div>} description={''} trigger={triggerButton}>
            <div className={cn("flex flex-col h-full ", `max-h-[70dvh] sm:max-h-[${maxHeight}]`)}>
                {/* Область сообщений */}
                <div className="flex-grow chat-scrollbar overflow-y-auto p-4 space-y-3">
                    {localMessages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.type === 'outgoing' ? 'justify-end' : 'justify-start'} message-animation`}
                        >
                            {message.type === 'incoming' && avatarUrl && (
                                <div className="flex-shrink-0 mr-2">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full overflow-hidden">

                                    </div>
                                </div>
                            )}

                            <div
                                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                                    message.type === 'outgoing'
                                        ? 'bg-blue-500/60 text-white rounded-br-none'
                                        : 'bg-zinc-200 dark:bg-zinc-700 rounded-bl-none'
                                }`}
                            >
                                {message.sender && (
                                    <div className="font-semibold text-xs mb-1">
                                        {message.sender}
                                    </div>
                                )}
                                <div className="break-words">{message.text}</div>
                                <div className="flex items-center justify-end mt-1 space-x-1">
                                    {showTimestamps && (
                                        <span className="text-xs opacity-70">
                      {formatTime(message.timestamp)}
                    </span>
                                    )}
                                    {showReadStatus && message.type === 'outgoing' && (
                                        <span className="text-xs">
                      {message.isRead ? '✓✓' : '✓'}
                    </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-zinc-200 dark:bg-zinc-700 rounded-lg px-4 py-2 flex space-x-1">
                                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Поле ввода */}
                <div className="p-3 flex items-center">
                  <Input
                      placeholder={placeholder}
                      className='resize-none'
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                  />
                    <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className="ml-2"
                        size="icon"
                    >
                        <Send size={18} />
                    </Button>
                </div>
            </div>

            {/* CSS для анимации появления сообщений */}
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
        </Modal>
    );
};

// Дополнительный компонент-построитель для создания разных чатов
export interface ChatBuilderProps extends Omit<ChatProps, 'messages' | 'onSendMessage'> {
    initialMessages?: Message[];
    onMessageReceived?: (message: Message) => void;
    autoReply?: boolean | ((message: string) => string | Promise<string>);
    persistMessages?: boolean;
    storageKey?: string;
}

export const ChatBuilder: React.FC<ChatBuilderProps> = ({
                                                            initialMessages = [],
                                                            onMessageReceived,
                                                            autoReply = false,
                                                            persistMessages = false,
                                                            storageKey = 'chat-messages',
                                                            ...chatProps
                                                        }) => {
    // Загрузка сохраненных сообщений
    const loadMessages = (): Message[] => {
        if (persistMessages) {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    return Array.isArray(parsed) ? parsed.map(msg => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    })) : initialMessages;
                } catch (e) {
                    console.error('Ошибка при загрузке сообщений:', e);
                }
            }
        }
        return initialMessages;
    };

    const [messages, setMessages] = useState<Message[]>(loadMessages);
    const [isLoading, setIsLoading] = useState(false);

    // Сохранение сообщений при изменении
    useEffect(() => {
        if (persistMessages && messages.length > 0) {
            localStorage.setItem(storageKey, JSON.stringify(messages));
        }
    }, [messages, persistMessages, storageKey]);

    // Генерация уникального ID
    const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Отправка сообщения
    const handleSendMessage = async (text: string) => {
        const newMessage: Message = {
            id: generateId(),
            text,
            type: 'outgoing',
            timestamp: new Date(),
            isRead: false
        };

        setMessages(prev => [...prev, newMessage]);

        // Обработка авто-ответа
        if (autoReply) {
            setIsLoading(true);

            try {
                let replyText: string;

                if (typeof autoReply === 'function') {
                    replyText = await Promise.resolve(autoReply(text));
                } else {
                    // Простая имитация ответа с задержкой
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    replyText = 'Спасибо за ваше сообщение! Мы ответим как можно скорее.';
                }

                const replyMessage: Message = {
                    id: generateId(),
                    text: replyText,
                    type: 'incoming',
                    timestamp: new Date(),
                };

                setMessages(prev => [...prev, replyMessage]);

                if (onMessageReceived) {
                    onMessageReceived(replyMessage);
                }
            } catch (error) {
                console.error('Ошибка при отправке сообщения:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Chat
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            {...chatProps}
        />
    );
};