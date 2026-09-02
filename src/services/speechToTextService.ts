const ASR_SERVER_URL = 'http://127.0.0.1:8000';

export interface SpeechToTextResult {
    text: string;
    provider: string;
    model: string;
    language: string | null;
}

const getAudioFilename = (audioBlob: Blob): string => {
    const mimeType = audioBlob.type.toLowerCase();

    if (mimeType.includes('mp4') || mimeType.includes('m4a')) {
        return 'recording.mp4';
    }

    if (mimeType.includes('ogg')) {
        return 'recording.ogg';
    }

    if (mimeType.includes('mpeg') || mimeType.includes('mp3')) {
        return 'recording.mp3';
    }

    if (mimeType.includes('wav')) {
        return 'recording.wav';
    }

    return 'recording.webm';
};

export const speechToTextService = {
    transcribe: async (
        audioBlob: Blob,
        language?: string
    ): Promise<SpeechToTextResult> => {
        if (!audioBlob || audioBlob.size === 0) {
            throw new Error('No audio was recorded.');
        }

        const formData = new FormData();

        formData.append(
            'file',
            audioBlob,
            getAudioFilename(audioBlob)
        );

        // Only send a real language code. Undefined means Whisper
        // should detect the spoken language automatically.
        if (language) {
            formData.append('language', language);
        }

        let response: Response;

        try {
            response = await fetch(`${ASR_SERVER_URL}/transcribe`, {
                method: 'POST',
                body: formData,
            });
        } catch {
            throw new Error(
                'Cannot connect to the speech server. Make sure the FastAPI ASR server is running on port 8000.'
            );
        }

        if (!response.ok) {
            let errorMessage = 'Speech transcription failed.';

            try {
                const errorData = await response.json();
                if (errorData?.detail) {
                    errorMessage = errorData.detail;
                }
            } catch {
                // Keep the default message.
            }

            throw new Error(errorMessage);
        }

        const result: SpeechToTextResult = await response.json();

        if (!result?.text?.trim()) {
            throw new Error('No speech could be detected.');
        }

        return result;
    },
};
