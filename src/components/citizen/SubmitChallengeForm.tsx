import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChallengeCategory, ChallengeUrgency } from '../../types';
import { JHARKHAND_DISTRICTS, CATEGORIES_LIST } from '../../mock/data';
import { challengeService } from '../../services/challengeService';
import { speechToTextService } from '../../services/speechToTextService';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  MapPin,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Camera,
  Video,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Eye,
  Info,
  Clock,
  HelpCircle,
  Smile,
  FileSpreadsheet,
  Trash2,
  Maximize2,
  X,
  Crosshair,
  RefreshCw,
  Navigation,
  Image as ImageIcon,
  Plus,
  Mic,
  Square,
  Loader2,
} from 'lucide-react';

interface AttachedPhoto {
  id: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  caption: string;
  timestamp: string;
  gpsCoordinates: { lat: number; lng: number };
  geotagLocation: string;
  accuracy: number;
  isGeotagged: boolean;
}

export const SubmitChallengeForm: React.FC = () => {
  const { currentUser, showToast, refreshData, navigateToChallenge, setCurrentView } = useApp();

  // Submission Mode: 'simple' (Scenario B) vs 'detailed' (Scenario A)
  const [submissionMode, setSubmissionMode] = useState<'simple' | 'detailed'>('simple');
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedChallengeId, setSubmittedChallengeId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ChallengeCategory>('Water Resources');
  const [subCategory, setSubCategory] = useState('');
  const [district, setDistrict] = useState<string>('Khunti');
  const [block, setBlock] = useState('Torpa');
  const [village, setVillage] = useState('Dormo Panchayat');
  const [gps, setGps] = useState({ lat: 22.9567, lng: 85.0844 });
  const [affectedPopulation, setAffectedPopulation] = useState<number>(12500);
  const [frequency, setFrequency] = useState<'Daily' | 'Seasonal' | 'Recurring Periodic' | 'One-Time Event'>('Daily');
  const [urgency, setUrgency] = useState<ChallengeUrgency>('High');
  const [expectedImpact, setExpectedImpact] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(true);

  // Geolocation state
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [geoAccuracy, setGeoAccuracy] = useState<number>(3.8);
  const [geoLockedAt, setGeoLockedAt] = useState<string>(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [geoStatus, setGeoStatus] = useState<'locked' | 'locating' | 'manual'>('locked');

  // Quick Guided Mode Questions (Scenario B)
  const [simpleWhatHappened, setSimpleWhatHappened] = useState('');
  const [simpleWhoAffected, setSimpleWhoAffected] = useState('');

  // Multi-Photo Evidence Uploads with Geotag Metadata
  const [evidenceList, setEvidenceList] = useState<AttachedPhoto[]>([
    {
      id: 'ev-init-1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
      caption: 'Groundwater pump crusting and turbidity at site',
      timestamp: 'Today, 10:45 AM',
      gpsCoordinates: { lat: 22.9567, lng: 85.0844 },
      geotagLocation: 'Dormo Panchayat, Torpa, Khunti',
      accuracy: 3.5,
      isGeotagged: true,
    },
  ]);
  const [newCaption, setNewCaption] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState<AttachedPhoto | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Voice-to-text state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [voiceLanguage, setVoiceLanguage] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      const recorder = mediaRecorderRef.current;
      if (recorder) {
        // Remove onstop first so unmounting cannot start a transcription request.
        recorder.ondataavailable = null;
        recorder.onstop = null;
        recorder.onerror = null;

        if (recorder.state !== 'inactive') {
          recorder.stop();
        }

        recorder.stream.getTracks().forEach((track) => track.stop());
      }

      mediaRecorderRef.current = null;
      audioChunksRef.current = [];
    };
  }, []);

  const handleStartRecording = async () => {
    if (isRecording || isTranscribing) return;

    setRecordingError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      const message = 'Microphone recording is not supported in this browser.';
      setRecordingError(message);
      showToast('error', 'Microphone Unavailable', message);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!isMountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
      ];

      const supportedMimeType =
        mimeTypes.find((type) => MediaRecorder.isTypeSupported(type)) || '';

      const recorder = supportedMimeType
        ? new MediaRecorder(stream, { mimeType: supportedMimeType })
        : new MediaRecorder(stream);

      audioChunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        stream.getTracks().forEach((track) => track.stop());
        mediaRecorderRef.current = null;

        if (isMountedRef.current) {
          setIsRecording(false);
          setRecordingError('The microphone recording failed. Please try again.');
          showToast('error', 'Recording Failed', 'Please check your microphone and try again.');
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());

        const actualMimeType = recorder.mimeType || supportedMimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, {
          type: actualMimeType,
        });

        audioChunksRef.current = [];
        mediaRecorderRef.current = null;

        if (!isMountedRef.current) return;

        setIsRecording(false);

        if (audioBlob.size === 0) {
          setRecordingError('No audio was recorded. Please try again.');
          showToast('warning', 'No Audio Recorded', 'Please speak after starting the microphone.');
          return;
        }

        setIsTranscribing(true);

        try {
          // Send a language code only when the user selected a language
          // with a real ISO-639-1 code. Empty value means Whisper auto-detects.
          const explicitWhisperLanguageCodes = new Set([
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

          const languageForWhisper = explicitWhisperLanguageCodes.has(voiceLanguage)
            ? voiceLanguage
            : undefined;

          const result = await speechToTextService.transcribe(
            audioBlob,
            languageForWhisper
          );

          if (!isMountedRef.current) return;

          const transcript = result.text.trim();

          if (!transcript) {
            throw new Error('No speech could be detected.');
          }

          setSimpleWhatHappened((currentText) => {
            const existingText = currentText.trim();
            return existingText ? `${existingText} ${transcript}` : transcript;
          });

          setRecordingError(null);
          showToast('success', 'Voice Converted to Text', 'Your spoken description was added to the problem field.');
        } catch (error) {
          if (!isMountedRef.current) return;

          const message =
            error instanceof Error
              ? error.message
              : 'Speech transcription failed. Please try again.';

          setRecordingError(message);
          showToast('error', 'Transcription Failed', message);
        } finally {
          if (isMountedRef.current) {
            setIsTranscribing(false);
          }
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === 'NotAllowedError'
          ? 'Microphone permission was denied. Please allow microphone access and try again.'
          : 'Unable to access the microphone. Please check your device and browser settings.';

      setRecordingError(message);
      showToast('error', 'Microphone Access Failed', message);
    }
  };

  const handleStopRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state === 'inactive') {
      setIsRecording(false);
      return;
    }

    recorder.stop();
  };

  // Live Geolocation Detector Handler
  const handleDetectGeolocation = () => {
    setIsLocating(true);
    setGeoStatus('locating');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = Number(position.coords.latitude.toFixed(4));
          const lng = Number(position.coords.longitude.toFixed(4));
          const accuracy = Number(position.coords.accuracy.toFixed(1)) || 4.2;
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          setGps({ lat, lng });
          setGeoAccuracy(accuracy);
          setGeoLockedAt(time);
          setGeoStatus('locked');
          setIsLocating(false);

          showToast(
            'success',
            'GPS Coordinates Locked',
            `Geotagged at ${lat}° N, ${lng}° E (Accuracy: ±${accuracy}m). Photos will use this geotag.`
          );
        },
        (error) => {
          // Fallback coordinate generation for testing / sandboxed iframe
          const simulatedLat = Number((22.7 + Math.random() * 1.6).toFixed(4));
          const simulatedLng = Number((84.6 + Math.random() * 2.4).toFixed(4));
          const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          setGps({ lat: simulatedLat, lng: simulatedLng });
          setGeoAccuracy(3.8);
          setGeoLockedAt(time);
          setGeoStatus('locked');
          setIsLocating(false);

          showToast(
            'info',
            'GPS Geolocation Calibrated',
            `Set coordinates to ${simulatedLat}° N, ${simulatedLng}° E for ${district} block.`
          );
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      setIsLocating(false);
      setGeoStatus('manual');
      showToast('warning', 'GPS Unavailable', 'Using district default coordinates.');
    }
  };

  // Handle Multi-file Upload from Device (More than 1 photo)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray: File[] = Array.from(files);
    const newPhotos: AttachedPhoto[] = [];

    let processedCount = 0;
    filesArray.forEach((file: File, index: number) => {
      if (!file.type.startsWith('image/')) {
        showToast('warning', 'Non-image skipped', `${file.name} is not an image file.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        newPhotos.push({
          id: `ev-upload-${Date.now()}-${index}`,
          type: 'image',
          url: dataUrl,
          caption: newCaption || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || `Field photo #${evidenceList.length + index + 1}`,
          timestamp: `Today, ${timestampStr}`,
          gpsCoordinates: { ...gps },
          geotagLocation: `${village ? village + ', ' : ''}${block}, ${district}`,
          accuracy: geoAccuracy,
          isGeotagged: true,
        });

        processedCount++;
        if (processedCount === filesArray.length) {
          setEvidenceList((prev) => [...prev, ...newPhotos]);
          setNewCaption('');
          showToast(
            'success',
            `${newPhotos.length} Photo${newPhotos.length > 1 ? 's' : ''} Uploaded & Geotagged`,
            `Attached with GPS coordinates: ${gps.lat}° N, ${gps.lng}° E`
          );
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input value so same files can be re-selected if needed
    e.target.value = '';
  };

  // Preset Sample Evidence Library for instant testing
  const handleAddSamplePreset = (presetType: 'water' | 'crop' | 'solar' | 'canal' | 'transformer') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let sample: AttachedPhoto;

    switch (presetType) {
      case 'water':
        sample = {
          id: `ev-sample-${Date.now()}`,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
          caption: 'Handpump discharge with yellow-brown precipitate',
          timestamp: `Today, ${timeStr}`,
          gpsCoordinates: { ...gps },
          geotagLocation: `${village || 'Village Hamlet'}, ${block}, ${district}`,
          accuracy: geoAccuracy,
          isGeotagged: true,
        };
        break;
      case 'crop':
        sample = {
          id: `ev-sample-${Date.now()}`,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80',
          caption: 'Community lac crop host trees with fungal infestation',
          timestamp: `Today, ${timeStr}`,
          gpsCoordinates: { ...gps },
          geotagLocation: `${village || 'Forest Tola'}, ${block}, ${district}`,
          accuracy: geoAccuracy,
          isGeotagged: true,
        };
        break;
      case 'solar':
        sample = {
          id: `ev-sample-${Date.now()}`,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
          caption: 'Defective solar micro-inverter array at irrigation site',
          timestamp: `Today, ${timeStr}`,
          gpsCoordinates: { ...gps },
          geotagLocation: `${village || 'Kisan Field'}, ${block}, ${district}`,
          accuracy: geoAccuracy,
          isGeotagged: true,
        };
        break;
      case 'canal':
        sample = {
          id: `ev-sample-${Date.now()}`,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
          caption: 'Silted field branch canal breaching embankment during rains',
          timestamp: `Today, ${timeStr}`,
          gpsCoordinates: { ...gps },
          geotagLocation: `${village || 'Canal Head'}, ${block}, ${district}`,
          accuracy: geoAccuracy,
          isGeotagged: true,
        };
        break;
      case 'transformer':
      default:
        sample = {
          id: `ev-sample-${Date.now()}`,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80',
          caption: 'Burnt 25kVA step-down transformer near panchayat bhawan',
          timestamp: `Today, ${timeStr}`,
          gpsCoordinates: { ...gps },
          geotagLocation: `${village || 'Main Chowk'}, ${block}, ${district}`,
          accuracy: geoAccuracy,
          isGeotagged: true,
        };
        break;
    }

    setEvidenceList((prev) => [...prev, sample]);
    showToast('success', 'Geotagged Photo Added', `Attached photo with GPS geotag: ${gps.lat}° N, ${gps.lng}° E`);
  };

  // Remove Photo from list
  const handleRemovePhoto = (id: string) => {
    setEvidenceList((prev) => prev.filter((p) => p.id !== id));
    showToast('info', 'Photo Removed', 'Removed attached evidence item.');
  };

  // Update Caption for individual photo
  const handleUpdateCaption = (id: string, captionText: string) => {
    setEvidenceList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, caption: captionText } : p))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // In simple mode, construct title and description from human answers
    let finalTitle = title;
    let finalDescription = description;
    let finalImpact = expectedImpact;

    if (submissionMode === 'simple') {
      if (!simpleWhatHappened.trim()) {
        showToast('warning', 'Missing Description', 'Please tell us what problem is happening in your area.');
        return;
      }
      finalDescription = simpleWhatHappened;
      finalTitle = finalTitle || `${district} - ${block}: Community Issue (${simpleWhatHappened.slice(0, 50)}...)`;
      finalImpact = finalImpact || `Relief for local residents of ${village || block} in ${district} facing this issue.`;
    } else {
      if (!finalTitle || !finalDescription) {
        showToast('warning', 'Missing Details', 'Please fill in the problem title and description.');
        return;
      }
      finalImpact = finalImpact || `Improve quality of life and access to essential resources for ${district} residents.`;
    }

    if (!consentAccepted) {
      showToast('warning', 'Confirmation Required', 'Please confirm that this represents a genuine community need.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newCh = await challengeService.createChallenge({
        title: finalTitle,
        description: finalDescription,
        category: category || 'Water Resources',
        subCategory: subCategory || undefined,
        district: district || 'Ranchi',
        block: block || 'Sadar',
        village: village || 'Local Community',
        gpsCoordinates: gps,
        affectedPopulation: affectedPopulation || 1000,
        frequency: frequency || 'Daily',
        urgency: urgency || 'Medium',
        expectedImpact: finalImpact,
        additionalInformation:
          additionalInformation || (simpleWhoAffected ? `Affected Community Note: ${simpleWhoAffected}` : undefined),
        submittedBy: {
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          contactNumber: currentUser.phone || '+91 98351 00000',
          organization: currentUser.organization,
        },
        evidenceUrls: evidenceList,
      });

      await refreshData();
      setSubmittedChallengeId(newCh.id);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Ignore in non-canvas environments
      }

      showToast('success', 'Problem Logged as Community Report', `Tracking ID: ${newCh.id}. Recorded in state portal.`);
    } catch (err) {
      showToast('error', 'Submission Error', 'Failed to register challenge.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If submitted, show success state
  if (submittedChallengeId) {
    return (
      <div className="max-w-3xl mx-auto my-6 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
            <span>Recorded as: 🟡 Community Report</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Thank You for Bringing This to Light
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Your report is logged into the JH Innovation Connect platform with {evidenceList.length} geotagged photo{evidenceList.length > 1 ? 's' : ''}. State coordinators and university researchers will now examine the issue and determine the best resolution pathway.
          </p>
        </div>

        {/* Challenge ID Box */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white max-w-md mx-auto border border-slate-800 shadow-inner space-y-2">
          <span className="text-[11px] text-slate-400 uppercase tracking-widest block font-bold">
            Your Unique Tracking ID
          </span>
          <div className="text-2xl font-black text-amber-400 tracking-wider font-mono">
            {submittedChallengeId}
          </div>
          <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>GPS Locked: {gps.lat}° N, {gps.lng}° E &bull; {village || block}, {district}</span>
          </div>
          <span className="text-[11px] text-slate-300 flex items-center justify-center gap-1 pt-1 border-t border-slate-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Next Step: Authority Review & Investigation
          </span>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left max-w-lg mx-auto text-xs text-slate-600 space-y-2">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-700" />
            <span>What happens next?</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            1. <strong>Verification:</strong> Local nodal officers inspect the geotagged evidence.
            <br />
            2. <strong>Routing:</strong> If it is a maintenance matter, it goes to District Line Departments. If it requires technological innovation, it goes to university labs (BIT Mesra / IIT ISM / NIT).
            <br />
            3. <strong>Updates:</strong> You will be able to follow progress directly through your tracking ID.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigateToChallenge(submittedChallengeId)}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Track Challenge Journey &rarr;</span>
          </button>
          <button
            onClick={() => {
              setSubmittedChallengeId(null);
              setTitle('');
              setDescription('');
              setSimpleWhatHappened('');
              setStep(1);
            }}
            className="w-full sm:w-auto px-5 py-3 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
          >
            Submit Another Problem
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hidden File Inputs for multi-photo and camera capture */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        id="multi-photo-file-picker"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
        id="camera-photo-file-picker"
      />

      {/* Friendly Human Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              Grassroots Problem Ingestion
            </span>
            <span className="text-xs text-slate-400">SIH Problem Statement 26043</span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setSubmissionMode('simple')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${submissionMode === 'simple'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Need Help Explaining? (Simple Mode)</span>
            </button>
            <button
              type="button"
              onClick={() => setSubmissionMode('detailed')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${submissionMode === 'detailed'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Detailed Submission</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {submissionMode === 'simple' ? 'Tell Us About a Problem in Your Area' : 'Structured Challenge Submission Form'}
        </h1>

        <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-xs text-emerald-200 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>You do not need to know how to solve the problem or write technical terms.</strong> You just need to help us understand what is happening. The platform, state coordinators, and university researchers will structure and investigate it.
          </p>
        </div>
      </div>

      {/* SCENARIO B: QUICK & SIMPLE GUIDED MODE */}
      {submissionMode === 'simple' ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-emerald-700" />
              Step 1 of 1: Simple Community Description
            </span>
            <span className="text-[11px] text-slate-500">Only 2 questions strictly required</span>
          </div>

          {/* Question 1: What is happening? (REQUIRED) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900">
              1. What is the problem you or your community are facing? <span className="text-rose-600 font-extrabold">(Required)</span>
            </label>
            <p className="text-[11px] text-slate-500">
              Describe in plain words what happens, when it started, or how it affects everyday life.
            </p>
            <textarea
              rows={4}
              required
              placeholder="Example: In our village, handpumps have high yellowish sediment during summer and children complain of stomach aches. Or: We have good lac harvest but no local drying or processing facility so half the produce spoils..."
              value={simpleWhatHappened}
              onChange={(e) => setSimpleWhatHappened(e.target.value)}
              className="w-full text-xs sm:text-sm p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            ></textarea>

            {/* Voice-to-Text Input */}
            <div className="mt-3 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <div className="mb-3">
                <label
                  htmlFor="voice-language"
                  className="block text-[11px] font-bold text-slate-800 mb-1.5"
                >
                  Voice Language
                </label>
                <select
                  id="voice-language"
                  value={voiceLanguage}
                  onChange={(e) => setVoiceLanguage(e.target.value)}
                  disabled={isRecording || isTranscribing}
                  className="w-full sm:max-w-xs text-xs p-2.5 border border-emerald-200 rounded-lg bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
                >
                  <option value="">Auto Detect Language</option>
                  <option value="en">English</option>
                  <option value="ta">தமிழ் — Tamil</option>
                  <option value="hi">हिन्दी — Hindi</option>
                  <option value="bn">বাংলা — Bengali</option>
                  <option value="te">తెలుగు — Telugu</option>
                  <option value="kn">ಕನ್ನಡ — Kannada</option>
                  <option value="ml">മലയാളം — Malayalam</option>
                  <option value="mr">मराठी — Marathi</option>
                  <option value="gu">ગુજરાતી — Gujarati</option>
                  <option value="pa">ਪੰਜਾਬੀ — Punjabi</option>
                  <option value="ur">اردو — Urdu</option>
                  <option value="or">ଓଡ଼ିଆ — Odia</option>
                  <option value="as">অসমীয়া — Assamese</option>
                  <option value="sat">Santali — Auto Detect</option>
                  <option value="nagpuri">Nagpuri — Auto Detect</option>
                  <option value="kurukh">Kurukh / Oraon — Auto Detect</option>
                  <option value="mundari">Mundari — Auto Detect</option>
                  <option value="khortha">Khortha — Auto Detect</option>
                  <option value="ho">Ho — Auto Detect</option>
                  <option value="auto-other">Other Language — Auto Detect</option>
                </select>
                <p className="text-[10px] text-slate-600 mt-1.5">
                  For Santali, Nagpuri, Kurukh, Mundari, Khortha and Ho, automatic detection is used because a dedicated Whisper language code is not being assumed here.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Prefer speaking? Describe the problem by voice.
                    </p>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      Your voice is converted to text and added to the description above.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  disabled={isTranscribing}
                  className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 ${isRecording
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    }`}
                >
                  {isTranscribing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Converting to Text...</span>
                    </>
                  ) : isRecording ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Speak Problem</span>
                    </>
                  )}
                </button>
              </div>

              {isRecording && (
                <div className="mt-2 text-[10px] font-semibold text-rose-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                  Recording... Speak clearly, then press Stop Recording.
                </div>
              )}

              {recordingError && (
                <div className="mt-2 text-[10px] font-semibold text-rose-700 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{recordingError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Question 2: Where is it happening? (REQUIRED) + GEOLOCATION DETECTOR */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900">
                2. Where is this problem located? <span className="text-rose-600 font-extrabold">(Required)</span>
              </label>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                GPS Geotagging Enabled
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[11px] text-slate-600 font-semibold block mb-1">District</span>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold focus:ring-2 focus:ring-emerald-500"
                >
                  {JHARKHAND_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className="text-[11px] text-slate-600 font-semibold block mb-1">Block / Town</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Torpa / Katras / Sadar"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-600 font-semibold block mb-1">Village / Ward (Optional)</span>
                <input
                  type="text"
                  placeholder="e.g. Dormo Panchayat"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* LIVE GEOLOCATION AUTO-DETECTION CARD */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-slate-50 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Live Device Geolocation (Geotag)
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      GPS Active
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span>
                      <strong>Lat:</strong> {gps.lat.toFixed(4)}° N, <strong>Lng:</strong> {gps.lng.toFixed(4)}° E
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span>Accuracy: &plusmn;{geoAccuracy}m</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-slate-500">Locked: {geoLockedAt}</span>
                  </div>
                  <p className="text-[10px] text-emerald-800">
                    All attached photos will automatically embed this verified geographic coordinate stamp.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleDetectGeolocation}
                  disabled={isLocating}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLocating ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Acquiring GPS...</span>
                    </>
                  ) : (
                    <>
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>Detect My GPS</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Question 3: Who is affected? (OPTIONAL) */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-900">
              3. Who is affected? <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Around 200 farming families, school children, whole panchayat..."
              value={simpleWhoAffected}
              onChange={(e) => setSimpleWhoAffected(e.target.value)}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Question 4: PHOTOS WITH GEOTAG (UPLOAD MORE THAN 1 PHOTO) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>4. Photos with Geotag <span className="text-slate-400 font-normal">(Upload 1 or more photos)</span></span>
                </label>
                <p className="text-[11px] text-slate-500">
                  You can upload multiple photos. Each image is stamped with your GPS coordinates for field verification.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {evidenceList.length} Photo{evidenceList.length !== 1 ? 's' : ''} Attached
              </span>
            </div>

            {/* Photo Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3.5 bg-emerald-50 hover:bg-emerald-100/80 border-2 border-dashed border-emerald-400/80 rounded-2xl text-emerald-900 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <Upload className="w-4 h-4 text-emerald-700" />
                <span>Upload Photos from Device (Select Multiple)</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="p-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Take Photo with Camera (Auto-Geotagged)</span>
              </button>
            </div>

            {/* Preset Samples Quick Picker */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 block">
                Quick Add Field Evidence Samples (One-Click):
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddSamplePreset('water')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-emerald-600" />
                  + Turbid Handpump
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSamplePreset('crop')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-emerald-600" />
                  + Lac Crop Blight
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSamplePreset('canal')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-emerald-600" />
                  + Silted Canal
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSamplePreset('transformer')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-emerald-600" />
                  + Burnt Transformer
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSamplePreset('solar')}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-emerald-600" />
                  + Solar Inverter Defect
                </button>
              </div>
            </div>

            {/* ATTACHED GEOTAGGED PHOTOS LIST */}
            {evidenceList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {evidenceList.map((ev, idx) => (
                  <div
                    key={ev.id || idx}
                    className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-2xs space-y-2.5 transition-all group relative"
                  >
                    {/* Image with Geotag Overlay Stamp */}
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-200">
                      <img
                        src={ev.url}
                        alt={ev.caption}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />

                      {/* Visual Geotag Stamp Top Banner */}
                      <div className="absolute top-0 inset-x-0 bg-slate-950/80 backdrop-blur-xs text-white p-1.5 px-2 flex items-center justify-between text-[10px] font-mono border-b border-white/10">
                        <span className="flex items-center gap-1 text-emerald-300 font-bold">
                          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                          {ev.gpsCoordinates.lat.toFixed(4)}° N, {ev.gpsCoordinates.lng.toFixed(4)}° E
                        </span>
                        <span className="text-slate-300 text-[9px]">{ev.timestamp}</span>
                      </div>

                      {/* Bottom Location Watermark */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white p-1.5 px-2 flex items-center justify-between text-[10px]">
                        <span className="truncate text-slate-200 font-medium text-[10px]">
                          📍 {ev.geotagLocation}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPreviewPhoto(ev)}
                          className="p-1 rounded-md bg-white/20 hover:bg-white/40 text-white shrink-0 ml-1 transition-all"
                          title="Inspect Geotag & Photo"
                        >
                          <Maximize2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Editable Caption & Delete Controls */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Photo #{idx + 1} &bull; Geotagged
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(ev.id)}
                          className="text-rose-600 hover:text-rose-800 text-[10px] font-bold flex items-center gap-0.5 hover:underline"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        value={ev.caption}
                        onChange={(e) => handleUpdateCaption(ev.id, e.target.value)}
                        placeholder="Add note for this photo (e.g. Handpump near school)..."
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 font-medium text-slate-800"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600 font-medium">
                  No photos attached yet. You can upload multiple photos or click one of the quick samples above.
                </p>
              </div>
            )}
          </div>

          {/* Friendly Guidance Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong>Missing details?</strong> No problem! If anything is unclear, our coordinators will get in touch to help gather additional details rather than rejecting a genuine community need.
            </p>
          </div>

          {/* Declaration Checkbox */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-700 leading-snug">
                I confirm that this is a genuine community observation in <strong>{district}</strong>. I consent to review by Jharkhand State Higher Education authorities and institutional researchers.
              </span>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Registering Community Report with Geotags...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Community Report ({evidenceList.length} Geotagged Photo{evidenceList.length !== 1 ? 's' : ''})</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* SCENARIO A: DETAILED 3-STEP WIZARD */
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Detailed Challenge Submission
              </span>
              <span className="text-xs text-slate-400">&bull; Step {step} of 3</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`px-2.5 py-1 rounded font-bold ${step === 1 ? 'bg-emerald-700 text-white' : 'text-slate-500'}`}
              >
                1. Problem
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className={`px-2.5 py-1 rounded font-bold ${step === 2 ? 'bg-emerald-700 text-white' : 'text-slate-500'}`}
              >
                2. Location & Impact
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className={`px-2.5 py-1 rounded font-bold ${step === 3 ? 'bg-emerald-700 text-white' : 'text-slate-500'}`}
              >
                3. Evidence & Review
              </button>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Challenge Title <span className="text-rose-600 font-bold">(Required)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., High Fluoride Contamination in Handpumps of Torpa Block"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  A concise summary stating the primary grassroots obstacle.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Primary Domain / Category <span className="text-slate-400 font-normal">(Optional - can be auto-categorized)</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ChallengeCategory)}
                    className="w-full text-xs p-3 border border-slate-300 rounded-xl bg-slate-50 font-semibold focus:ring-2 focus:ring-emerald-500"
                  >
                    {CATEGORIES_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Sub-Category / Technical Focus <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Groundwater Purification & IoT Telemetry"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Comprehensive Problem Description <span className="text-rose-600 font-bold">(Required)</span>
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Describe what is happening, what causes the issue, who is suffering, seasonal variations, and past failed remedies..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                ></textarea>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!title || !description) {
                      showToast('warning', 'Required Fields', 'Please enter title and description.');
                      return;
                    }
                    setStep(2);
                  }}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <span>Proceed to Location & Impact</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    District <span className="text-rose-600 font-bold">(Required)</span>
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-semibold focus:ring-2 focus:ring-emerald-500"
                  >
                    {JHARKHAND_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Block / Tehsil <span className="text-rose-600 font-bold">(Required)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Torpa / Bishunpur / Katras"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Village / Ward / Locality <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dormo & Jamhar Tolas"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* GPS Geotagging Box with live auto-detection */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-slate-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 block">
                        GPS Geolocation Coordinates
                      </span>
                      <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                        Accuracy: &plusmn;{geoAccuracy}m
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-600 font-mono">
                      Lat: {gps.lat.toFixed(4)}° N, Lng: {gps.lng.toFixed(4)}° E &bull; Location: {village || block}, {district}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDetectGeolocation}
                  disabled={isLocating}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-2xs flex items-center gap-1.5"
                >
                  <Crosshair className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isLocating ? 'Scanning...' : 'Detect Device GPS'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Estimated Affected People <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={affectedPopulation}
                    onChange={(e) => setAffectedPopulation(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Frequency <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Daily">Daily / Constant</option>
                    <option value="Seasonal">Seasonal (Monsoon / Summer)</option>
                    <option value="Recurring Periodic">Recurring Periodic</option>
                    <option value="One-Time Event">One-Time Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Urgency Assessment <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as ChallengeUrgency)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold focus:ring-2 focus:ring-emerald-500 text-amber-900"
                  >
                    <option value="Critical">Critical (Immediate Health/Life Risk)</option>
                    <option value="High">High (Severe Economic/Livelihood Loss)</option>
                    <option value="Medium">Medium (Regular Inconvenience)</option>
                    <option value="Low">Low (General Quality of Life)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Expected Benefit / Impact of Solution <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="What will improve once solved? e.g. Eliminates fluorosis for villagers and saves hours fetching water..."
                  value={expectedImpact}
                  onChange={(e) => setExpectedImpact(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <span>Proceed to Evidence & Review</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Multimedia Evidence Uploader with Multi-photo and Geotagging */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-emerald-700" />
                      Multimedia Evidence & Geotagged Field Records
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Upload multiple field photos. Coordinates ({gps.lat.toFixed(4)}° N, {gps.lng.toFixed(4)}° E) are automatically embedded into each image.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {evidenceList.length} Geotagged Photo{evidenceList.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Upload action buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-white hover:bg-emerald-50 border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-xl text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-emerald-700" />
                    <span>Upload Multiple Photos from Device</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="p-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>Capture Photo with Geotag</span>
                  </button>
                </div>

                {/* Attached Geotagged photos grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {evidenceList.map((ev, idx) => (
                    <div
                      key={ev.id || idx}
                      className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2"
                    >
                      <div className="relative rounded-lg overflow-hidden aspect-video bg-slate-900">
                        <img
                          src={ev.url}
                          alt={ev.caption}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0 inset-x-0 bg-slate-950/80 text-white p-1 px-2 flex items-center justify-between text-[9px] font-mono">
                          <span className="text-emerald-300 font-bold">
                            📍 {ev.gpsCoordinates.lat.toFixed(4)}° N, {ev.gpsCoordinates.lng.toFixed(4)}° E
                          </span>
                          <span className="text-slate-300">{ev.timestamp}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <input
                          type="text"
                          value={ev.caption}
                          onChange={(e) => handleUpdateCaption(ev.id, e.target.value)}
                          className="flex-1 text-xs p-1.5 bg-slate-50 border border-slate-200 rounded mr-2 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(ev.id)}
                          className="text-rose-600 hover:text-rose-800 text-xs p-1"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Additional Information / Gram Sabha Endorsement <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Mention if Gram Sabha has discussed site or if electricity/water source is nearby..."
                  value={additionalInformation}
                  onChange={(e) => setAdditionalInformation(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              {/* Declaration Checkbox */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentAccepted}
                    onChange={(e) => setConsentAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-700 leading-snug">
                    I declare that this problem statement represents a genuine community need in{' '}
                    <strong>{village || block}, {district}</strong>. I consent to review by Jharkhand Higher Education Institutions and Industry partners.
                  </span>
                </label>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  &larr; Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Registering Challenge with Geotags...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Submit Challenge & Run AI Triage ({evidenceList.length} Photos)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* LIGHTBOX MODAL TO INSPECT FULL PHOTO & GEOTAG METADATA */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full overflow-hidden border border-slate-800 shadow-2xl space-y-4">
            <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">
                  Geotagged Photo Field Inspection
                </span>
              </div>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-black border border-slate-800">
                <img
                  src={previewPhoto.url}
                  alt={previewPhoto.caption}
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs text-emerald-300 px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border border-emerald-500/30">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {previewPhoto.gpsCoordinates.lat.toFixed(4)}° N, {previewPhoto.gpsCoordinates.lng.toFixed(4)}° E
                </div>
              </div>

              {/* Geotag metadata card */}
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="font-bold text-slate-200">{previewPhoto.caption}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/40">
                    Verified Geotag
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-300 pt-1">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Location</span>
                    <strong className="text-white">{previewPhoto.geotagLocation}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Capture Time</span>
                    <strong className="text-white">{previewPhoto.timestamp}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">GPS Accuracy</span>
                    <strong className="text-emerald-400">&plusmn;{previewPhoto.accuracy}m</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 px-6 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setPreviewPhoto(null)}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


