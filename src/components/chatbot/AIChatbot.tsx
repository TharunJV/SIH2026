import React, { useRef, useState } from 'react';
import {
    Bot,
    Send,
    X,
    Mic,
    Square,
    Loader2,
} from 'lucide-react';

import { speechToTextService } from '../../services/speechToTextService';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    text: string;
}

interface ChatResponse {
    response: string;
    provider: string;
}

const AI_SERVER_URL = 'http://127.0.0.1:8001';

const VOICE_LANGUAGES = [
    { code: '', label: 'Auto Detect Language' },
    { code: 'en', label: 'English' },
    { code: 'ta', label: 'தமிழ் — Tamil' },
    { code: 'hi', label: 'हिन्दी — Hindi' },
    { code: 'bn', label: 'বাংলা — Bengali' },
    { code: 'te', label: 'తెలుగు — Telugu' },
    { code: 'kn', label: 'ಕನ್ನಡ — Kannada' },
    { code: 'ml', label: 'മലയാളം — Malayalam' },
    { code: 'mr', label: 'मराठी — Marathi' },
    { code: 'gu', label: 'ગુજરાતી — Gujarati' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ — Punjabi' },
    { code: 'ur', label: 'اردو — Urdu' },
    { code: 'or', label: 'ଓଡ଼ିଆ — Odia' },
    { code: 'as', label: 'অসমীয়া — Assamese' },
    { code: 'sat', label: 'Santali — Auto Detect' },
    { code: 'nagpuri', label: 'Nagpuri — Auto Detect' },
    { code: 'kurukh', label: 'Kurukh / Oraon — Auto Detect' },
    { code: 'mundari', label: 'Mundari — Auto Detect' },
    { code: 'khortha', label: 'Khortha — Auto Detect' },
    { code: 'ho', label: 'Ho — Auto Detect' },
];

const EXPLICIT_WHISPER_LANGUAGE_CODES = new Set([
    'en',
    'ta',
    'hi',
    'bn',
    'te',
    'kn',
    'ml',
    'mr',
    'gu',
    'pa',
    'ur',
    'or',
    'as',
]);

export const AIChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [message, setMessage] = useState('');

    const [voiceLanguage, setVoiceLanguage] = useState('');

    const [isRecording, setIsRecording] = useState(false);

    const [isTranscribing, setIsTranscribing] = useState(false);

    const [isSending, setIsSending] = useState(false);

    const [recordingError, setRecordingError] =
        useState<string | null>(null);

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'assistant',
            text:
                "👋 Hi! I'm the SolveSphere AI Assistant. I can help you understand the platform and submit your innovation challenge.",
        },
    ]);

    const mediaRecorderRef =
        useRef<MediaRecorder | null>(null);

    const audioChunksRef =
        useRef<Blob[]>([]);

    const streamRef =
        useRef<MediaStream | null>(null);

    // =====================================================
    // ADD MESSAGE
    // =====================================================

    const addMessage = (
        role: 'user' | 'assistant',
        text: string
    ) => {
        setMessages((current) => [
            ...current,
            {
                id: `${Date.now()}-${role}`,
                role,
                text,
            },
        ]);
    };

    // =====================================================
    // SEND MESSAGE TO GEMINI / GROQ
    // =====================================================

    const handleSendMessage = async () => {
        const text = message.trim();

        if (!text || isSending || isTranscribing) {
            return;
        }

        // Show user message immediately
        addMessage('user', text);

        // Clear input
        setMessage('');

        // Start loading
        setIsSending(true);

        try {
            const response = await fetch(
                `${AI_SERVER_URL}/chat`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                        message: text,
                    }),
                }
            );

            if (!response.ok) {
                let errorMessage =
                    'AI service is temporarily unavailable.';

                try {
                    const errorData =
                        await response.json();

                    if (errorData?.detail) {
                        errorMessage =
                            errorData.detail;
                    }
                } catch {
                    // Ignore JSON parsing errors
                }

                throw new Error(errorMessage);
            }

            const data: ChatResponse =
                await response.json();

            if (!data?.response?.trim()) {
                throw new Error(
                    'The AI returned an empty response.'
                );
            }

            // Add AI response
            addMessage(
                'assistant',
                data.response.trim()
            );

            console.log(
                'AI provider:',
                data.provider
            );
        } catch (error) {
            console.error(
                'AI chatbot error:',
                error
            );

            addMessage(
                'assistant',
                'Sorry, I am unable to respond right now. Please try again in a moment.'
            );
        } finally {
            setIsSending(false);
        }
    };

    // =====================================================
    // STOP MICROPHONE
    // =====================================================

    const stopMicrophoneStream = () => {
        if (streamRef.current) {
            streamRef.current
                .getTracks()
                .forEach((track) => track.stop());

            streamRef.current = null;
        }
    };

    // =====================================================
    // START RECORDING
    // =====================================================

    const handleStartRecording = async () => {
        if (
            isRecording ||
            isTranscribing ||
            isSending
        ) {
            return;
        }

        setRecordingError(null);

        if (
            !navigator.mediaDevices?.getUserMedia
        ) {
            setRecordingError(
                'Microphone recording is not supported in this browser.'
            );

            return;
        }

        try {
            const stream =
                await navigator.mediaDevices.getUserMedia(
                    {
                        audio: true,
                    }
                );

            streamRef.current = stream;

            audioChunksRef.current = [];

            const mimeTypes = [
                'audio/webm;codecs=opus',
                'audio/webm',
                'audio/mp4',
            ];

            const supportedMimeType =
                mimeTypes.find((type) =>
                    MediaRecorder.isTypeSupported(type)
                );

            const recorder =
                supportedMimeType
                    ? new MediaRecorder(stream, {
                        mimeType:
                            supportedMimeType,
                    })
                    : new MediaRecorder(stream);

            mediaRecorderRef.current =
                recorder;

            // =================================================
            // AUDIO DATA
            // =================================================

            recorder.ondataavailable = (
                event
            ) => {
                if (
                    event.data &&
                    event.data.size > 0
                ) {
                    audioChunksRef.current.push(
                        event.data
                    );
                }
            };

            // =================================================
            // RECORDING STOPPED
            // =================================================

            recorder.onstop = async () => {
                const actualMimeType =
                    recorder.mimeType ||
                    supportedMimeType ||
                    'audio/webm';

                const audioBlob =
                    new Blob(
                        audioChunksRef.current,
                        {
                            type: actualMimeType,
                        }
                    );

                stopMicrophoneStream();

                if (!audioBlob.size) {
                    setRecordingError(
                        'No audio was recorded.'
                    );

                    setIsRecording(false);

                    return;
                }

                setIsRecording(false);

                setIsTranscribing(true);

                try {
                    // Only send valid ISO-639-1
                    // Whisper language codes
                    const languageForWhisper =
                        EXPLICIT_WHISPER_LANGUAGE_CODES.has(
                            voiceLanguage
                        )
                            ? voiceLanguage
                            : undefined;

                    // -----------------------------------------
                    // VOICE → TEXT
                    // -----------------------------------------

                    const result =
                        await speechToTextService.transcribe(
                            audioBlob,
                            languageForWhisper
                        );

                    const transcript =
                        result.text.trim();

                    if (!transcript) {
                        throw new Error(
                            'No speech could be detected.'
                        );
                    }

                    // Put transcript into input box
                    setMessage(
                        (currentMessage) => {
                            const existing =
                                currentMessage.trim();

                            return existing
                                ? `${existing} ${transcript}`
                                : transcript;
                        }
                    );
                } catch (error) {
                    console.error(
                        'Chatbot voice transcription error:',
                        error
                    );

                    setRecordingError(
                        error instanceof Error
                            ? error.message
                            : 'Voice transcription failed.'
                    );
                } finally {
                    setIsTranscribing(false);

                    mediaRecorderRef.current =
                        null;
                }
            };

            // =================================================
            // RECORDING ERROR
            // =================================================

            recorder.onerror = () => {
                setRecordingError(
                    'An error occurred while recording your voice.'
                );

                setIsRecording(false);

                stopMicrophoneStream();
            };

            // Start recording
            recorder.start();

            setIsRecording(true);
        } catch (error) {
            console.error(
                'Microphone error:',
                error
            );

            setRecordingError(
                'Microphone permission was denied or the microphone is unavailable.'
            );

            stopMicrophoneStream();
        }
    };

    // =====================================================
    // STOP RECORDING
    // =====================================================

    const handleStopRecording = () => {
        const recorder =
            mediaRecorderRef.current;

        if (
            !recorder ||
            recorder.state === 'inactive'
        ) {
            setIsRecording(false);

            stopMicrophoneStream();

            return;
        }

        recorder.stop();
    };

    // =====================================================
    // VOICE BUTTON
    // =====================================================

    const handleVoiceButton = () => {
        if (isTranscribing || isSending) {
            return;
        }

        if (isRecording) {
            handleStopRecording();
        } else {
            handleStartRecording();
        }
    };

    // =====================================================
    // CLOSE CHAT
    // =====================================================

    const handleCloseChat = () => {
        if (isRecording) {
            handleStopRecording();
        }

        setIsOpen(false);
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <>
            {/* =================================================
                FLOATING CHAT BUTTON
            ================================================= */}

            {!isOpen && (
                <button
                    onClick={() =>
                        setIsOpen(true)
                    }
                    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:scale-105 hover:bg-blue-700"
                    aria-label="Open AI Assistant"
                >
                    <Bot size={28} />
                </button>
            )}

            {/* =================================================
                CHAT WINDOW
            ================================================= */}

            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 flex h-[560px] w-[360px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
                        <div className="flex items-center gap-2">
                            <Bot size={24} />

                            <div>
                                <h2 className="font-semibold">
                                    SolveSphere AI
                                </h2>

                                <p className="text-xs text-blue-100">
                                    Citizen Assistant
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={
                                handleCloseChat
                            }
                            className="rounded-full p-1 hover:bg-blue-700"
                            aria-label="Close chatbot"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* =================================================
                        MESSAGES
                    ================================================= */}

                    <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">

                        {messages.map(
                            (chatMessage) => (
                                <div
                                    key={
                                        chatMessage.id
                                    }
                                    className={
                                        chatMessage.role ===
                                            'user'
                                            ? 'ml-auto max-w-[85%] rounded-2xl rounded-tr-none bg-blue-600 p-3 text-white shadow-sm'
                                            : 'max-w-[85%] rounded-2xl rounded-tl-none bg-white p-3 shadow-sm'
                                    }
                                >
                                    <p className="whitespace-pre-wrap text-sm">
                                        {
                                            chatMessage.text
                                        }
                                    </p>
                                </div>
                            )
                        )}

                        {/* AI typing indicator */}

                        {isSending && (
                            <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-white p-3 shadow-sm">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />

                                    <span>
                                        Thinking...
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* =================================================
                        VOICE LANGUAGE
                    ================================================= */}

                    <div className="border-t bg-white px-3 pt-2">
                        <select
                            value={
                                voiceLanguage
                            }
                            onChange={(e) =>
                                setVoiceLanguage(
                                    e.target.value
                                )
                            }
                            disabled={
                                isRecording ||
                                isTranscribing ||
                                isSending
                            }
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-600 outline-none focus:border-blue-500"
                        >
                            {VOICE_LANGUAGES.map(
                                (language) => (
                                    <option
                                        key={
                                            language.code
                                        }
                                        value={
                                            language.code
                                        }
                                    >
                                        {
                                            language.label
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* =================================================
                        RECORDING / ERROR STATUS
                    ================================================= */}

                    {(isRecording ||
                        isTranscribing ||
                        recordingError) && (
                            <div className="bg-white px-3 pt-2">

                                {isRecording && (
                                    <p className="text-xs font-medium text-red-600">
                                        🔴 Listening... Click the microphone to stop.
                                    </p>
                                )}

                                {isTranscribing && (
                                    <p className="flex items-center gap-1 text-xs text-blue-600">
                                        <Loader2
                                            size={13}
                                            className="animate-spin"
                                        />

                                        Converting your voice to text...
                                    </p>
                                )}

                                {recordingError && (
                                    <p className="text-xs text-red-600">
                                        {
                                            recordingError
                                        }
                                    </p>
                                )}
                            </div>
                        )}

                    {/* =================================================
                        INPUT AREA
                    ================================================= */}

                    <div className="border-t bg-white p-3">
                        <div className="flex items-center gap-2">

                            {/* Text input */}

                            <input
                                type="text"
                                value={message}
                                onChange={(e) =>
                                    setMessage(
                                        e.target.value
                                    )
                                }
                                onKeyDown={(e) => {
                                    if (
                                        e.key ===
                                        'Enter'
                                    ) {
                                        e.preventDefault();

                                        handleSendMessage();
                                    }
                                }}
                                placeholder={
                                    isTranscribing
                                        ? 'Transcribing...'
                                        : isSending
                                            ? 'AI is thinking...'
                                            : 'Ask me anything...'
                                }
                                disabled={
                                    isTranscribing ||
                                    isSending
                                }
                                className="min-w-0 flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
                            />

                            {/* =================================================
                                VOICE BUTTON
                            ================================================= */}

                            <button
                                onClick={
                                    handleVoiceButton
                                }
                                disabled={
                                    isTranscribing ||
                                    isSending
                                }
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition ${isRecording
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-gray-700 hover:bg-gray-800'
                                    } disabled:cursor-not-allowed disabled:opacity-50`}
                                aria-label={
                                    isRecording
                                        ? 'Stop recording'
                                        : 'Start voice input'
                                }
                            >
                                {isTranscribing ? (
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : isRecording ? (
                                    <Square
                                        size={17}
                                    />
                                ) : (
                                    <Mic
                                        size={19}
                                    />
                                )}
                            </button>

                            {/* =================================================
                                SEND BUTTON
                            ================================================= */}

                            <button
                                onClick={
                                    handleSendMessage
                                }
                                disabled={
                                    !message.trim() ||
                                    isTranscribing ||
                                    isSending
                                }
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Send message"
                            >
                                {isSending ? (
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Send
                                        size={18}
                                    />
                                )}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChatbot;