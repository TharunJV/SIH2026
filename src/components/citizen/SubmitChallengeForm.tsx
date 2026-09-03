import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { JHARKHAND_DISTRICTS } from '../../mock/data';
import { challengeService } from '../../services/challengeService';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Camera,
  Video,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Eye,
  Info,
  Clock,
  Trash2,
  X,
  Crosshair,
  Image as ImageIcon,
  Plus,
  Edit3,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  Check,
  Paperclip,
} from 'lucide-react';
import { ChallengeCategory } from '../../types';

interface AttachedPhoto {
  id: string;
  type: 'image';
  url: string;
  caption?: string;
  timestamp: string;
  gpsCoordinates?: { lat: number; lng: number };
  geotagLocation?: string;
  accuracy?: number;
  isGeotagged?: boolean;
  fileName?: string;
  fileSize?: string;
  source?: 'camera' | 'upload' | 'sample';
}

interface AttachedFile {
  id: string;
  type: 'video' | 'document';
  name: string;
  size: string;
  url?: string;
}

const CITIZEN_CATEGORIES = [
  { id: 'Water Resources', label: 'Water', icon: '💧', desc: 'Drinking water, borewells, ponds, pipelines' },
  { id: 'Agriculture & Rural Economy', label: 'Agriculture', icon: '🌾', desc: 'Crops, irrigation, storage, livestock' },
  { id: 'Education', label: 'Education', icon: '📚', desc: 'School facilities, books, smart classrooms' },
  { id: 'Healthcare & Telemedicine', label: 'Healthcare', icon: '🏥', desc: 'Clinics, medicines, ambulances, health centers' },
  { id: 'Roads & Transport', label: 'Roads & Transport', icon: '🛣️', desc: 'Potholes, broken bridges, village connectivity' },
  { id: 'Sanitation & Waste Management', label: 'Sanitation', icon: '🧹', desc: 'Drainage, garbage disposal, public toilets' },
  { id: 'Environment & Forest Livelihood', label: 'Environment', icon: '🌲', desc: 'Forestry, pollution, clean energy, soil' },
  { id: 'Renewable Energy & Power', label: 'Electricity', icon: '⚡', desc: 'Power cuts, solar lights, broken transformers' },
  { id: 'Urban Infrastructure & Mobility', label: 'Public Infrastructure', icon: '🏛️', desc: 'Community halls, streetlights, markets' },
  { id: 'Accessibility', label: 'Accessibility', icon: '♿', desc: 'Ramps, elderly & disabled access' },
  { id: 'Livelihood', label: 'Livelihood', icon: '💼', desc: 'Self-help groups, craft value addition, markets' },
  { id: 'Other', label: 'Other', icon: '📌', desc: 'Any other general community issue' },
];

export const SubmitChallengeForm: React.FC = () => {
  const {
    currentUser,
    showToast,
    refreshData,
    navigateToChallenge,
    setCurrentView,
  } = useApp();

  // Wizard Step: 1 = Describe, 2 = Location, 3 = Evidence, 4 = Review, 5 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedChallengeId, setSubmittedChallengeId] = useState<string | null>(null);

  // STEP 1: Describe the Problem
  const [problemTitle, setProblemTitle] = useState('');
  const [whatIsHappening, setWhatIsHappening] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Water Resources');

  // STEP 2: Location
  const [district, setDistrict] = useState<string>(currentUser.district || 'Khunti');
  const [block, setBlock] = useState('Torpa');
  const [village, setVillage] = useState('Dormo Panchayat');
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [geoAccuracy, setGeoAccuracy] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState<string | null>(null);

  // STEP 3: Evidence (Multiple Photos, Video, Document)
  const [photos, setPhotos] = useState<AttachedPhoto[]>([
    {
      id: 'photo-sample-1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
      caption: 'Main handpump site with discolored water',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      gpsCoordinates: { lat: 22.9567, lng: 85.0844 },
      geotagLocation: `${village}, ${block}, ${district}`,
      accuracy: 3.5,
      isGeotagged: true,
      source: 'sample',
      fileName: 'handpump_evidence.jpg',
      fileSize: '1.4 MB',
    },
  ]);
  const [otherFiles, setOtherFiles] = useState<AttachedFile[]>([]);
  const [previewPhoto, setPreviewPhoto] = useState<AttachedPhoto | null>(null);

  // Live Camera Modal State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // STEP 4: Review & Confirmation
  const [confirmAccuracy, setConfirmAccuracy] = useState<boolean>(true);

  // File Input Refs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Geolocation Handler
  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    setLocationSuccessMsg(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = Number(position.coords.latitude.toFixed(4));
          const lng = Number(position.coords.longitude.toFixed(4));
          const acc = Number(position.coords.accuracy.toFixed(1));
          setGps({ lat, lng });
          setGeoAccuracy(acc);
          setIsLocating(false);
          setLocationSuccessMsg(`GPS Location captured (${lat}, ${lng}) with ±${acc}m accuracy.`);
          showToast('success', 'Location Captured', `GPS coordinates identified via your device.`);
        },
        (error) => {
          setIsLocating(false);
          setLocationError('GPS location unavailable. You can enter the location manually.');
          showToast('info', 'GPS Unavailable', 'You can easily select your District, Block, and Village manually.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setIsLocating(false);
      setLocationError('Geolocation is not supported by your browser. Please enter location manually.');
    }
  };

  // Camera Open Handler
  const handleOpenCamera = async () => {
    setIsCameraOpen(true);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable, showing simulated capture fallback', err);
      setCameraError('Camera access unavailable. You can upload photos directly from your gallery.');
    }
  };

  // Capture Photo from Live Stream
  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        const newPhoto: AttachedPhoto = {
          id: `photo-${Date.now()}`,
          type: 'image',
          url: dataUrl,
          caption: `Captured on site`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          gpsCoordinates: gps || undefined,
          geotagLocation: gps ? `${village}, ${block}, ${district}` : undefined,
          accuracy: geoAccuracy || undefined,
          isGeotagged: !!gps,
          source: 'camera',
          fileName: `camera_snap_${Date.now()}.jpg`,
          fileSize: '1.2 MB',
        };

        setPhotos((prev) => [...prev, newPhoto]);
        showToast('success', 'Photo Captured', 'Added directly to your evidence gallery.');
        handleCloseCamera();
      }
    }
  };

  // Close Camera
  const handleCloseCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  // Photo Upload Handler (Files from disk / gallery)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: AttachedPhoto[] = [];
    Array.from(files).forEach((file: File, idx) => {
      const url = URL.createObjectURL(file);
      newPhotos.push({
        id: `upload-photo-${Date.now()}-${idx}`,
        type: 'image',
        url,
        caption: file.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        gpsCoordinates: gps || undefined,
        geotagLocation: gps ? `${village}, ${block}, ${district}` : undefined,
        accuracy: geoAccuracy || undefined,
        isGeotagged: !!gps,
        source: 'upload',
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
    });

    setPhotos((prev) => [...prev, ...newPhotos]);
    showToast('success', 'Photos Added', `${newPhotos.length} photo(s) added to evidence.`);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  // Remove Photo
  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // Video / Doc Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'video' | 'document') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: AttachedFile[] = [];
    Array.from(files).forEach((file: File, idx) => {
      const url = URL.createObjectURL(file);
      newFiles.push({
        id: `file-${Date.now()}-${idx}`,
        type: fileType,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url,
      });
    });

    setOtherFiles((prev) => [...prev, ...newFiles]);
    showToast('success', `${fileType === 'video' ? 'Video' : 'Document'} Attached`, 'File added to evidence.');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submit Handler
  const handleSubmitProblem = async () => {
    if (!problemTitle.trim() || !whatIsHappening.trim()) {
      showToast('error', 'Missing Information', 'Please provide a title and describe what is happening.');
      setStep(1);
      return;
    }

    if (!confirmAccuracy) {
      showToast('error', 'Confirmation Required', 'Please confirm that this report is based on a real problem you observed.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newChallenge = await challengeService.createChallenge({
        title: problemTitle,
        description: whatIsHappening,
        category: selectedCategory as ChallengeCategory,
        district,
        block,
        village,
        gpsCoordinates: gps || { lat: 22.9567, lng: 85.0844 },
        affectedPopulation: 500,
        frequency: 'Daily',
        urgency: 'High',
        expectedImpact: 'Restoring functional community infrastructure and public well-being.',
        submittedBy: {
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          contactNumber: currentUser.phone,
        },
        evidenceUrls: photos.map((p) => ({
          type: 'image',
          url: p.url,
          caption: p.caption || 'Site photo',
          gpsCoordinates: p.gpsCoordinates,
          geotagLocation: p.geotagLocation,
          accuracy: p.accuracy,
          isGeotagged: p.isGeotagged,
          timestamp: p.timestamp,
          source: p.source,
          fileName: p.fileName,
          fileSize: p.fileSize,
        })),
      });

      // Trigger Celebration Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      await refreshData();
      setSubmittedChallengeId(newChallenge.id);
      setIsSubmitting(false);
      setStep(5); // Show Success Screen
      showToast('success', 'Problem Reported Successfully', `Your report ID is ${newChallenge.id}.`);
    } catch (err) {
      setIsSubmitting(false);
      showToast('error', 'Submission Failed', 'Something went wrong. Please check your internet connection and try again.');
    }
  };

  // =========================================================================
  // SUCCESS SCREEN (SECTION 15)
  // =========================================================================
  if (step === 5 && submittedChallengeId) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center space-y-8 font-sans-body">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center shadow-lg border-2 border-emerald-300 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            Community Report Stored
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Problem Reported Successfully
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Thank you for helping improve your community. Your report has been registered with the Government of Jharkhand portal.
          </p>
        </div>

        {/* Challenge ID Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-md mx-auto space-y-3">
          <span className="text-xs text-slate-500 font-medium">Your Challenge Tracking ID</span>
          <div className="text-2xl font-mono font-bold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-200">
            {submittedChallengeId}
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Current Status: <strong>Under Review</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigateToChallenge(submittedChallengeId)}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Track This Challenge</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('citizen-dashboard')}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans-body">
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button
              onClick={() => setCurrentView('citizen-dashboard')}
              className="hover:text-amber-700 cursor-pointer"
            >
              Dashboard
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 font-medium">Report a Problem</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Report a Community Problem
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setCurrentView('citizen-dashboard')}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* 4-Step Progress Indicator (Section 8) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { num: 1, label: 'Describe' },
            { num: 2, label: 'Location' },
            { num: 3, label: 'Evidence' },
            { num: 4, label: 'Review' },
          ].map((s) => {
            const isDone = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div
                key={s.num}
                onClick={() => {
                  if (s.num < step) setStep(s.num as any);
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-amber-100 text-slate-950 font-bold border border-amber-300'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 font-medium cursor-pointer'
                    : 'text-slate-600 bg-slate-50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3" /> : s.num}
                </div>
                <span className="text-[11px] sm:text-xs">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: DESCRIBE THE PROBLEM (SECTION 9) */}
      {/* ========================================================================= */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              What problem did you notice?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Describe the problem naturally. The platform will handle technical routing.
            </p>
          </div>

          {/* Problem Title */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Problem Title <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={problemTitle}
              onChange={(e) => setProblemTitle(e.target.value)}
              placeholder="e.g., Broken drinking water facility in Torpa village"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              What is happening? <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={4}
              value={whatIsHappening}
              onChange={(e) => setWhatIsHappening(e.target.value)}
              placeholder="Tell us what is happening, where it is happening, and how it is affecting people..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-[11px] text-slate-500">
              Tip: Explain how many families or children are affected and how long this issue has persisted.
            </p>
          </div>

          {/* Category Selector (Section 9) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Category (Optional)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {CITIZEN_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-400/40 text-slate-950 font-bold'
                        : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{cat.icon}</span>
                      <span className="text-xs font-bold">{cat.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 leading-tight">
                      {cat.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 1 CTA */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (!problemTitle.trim() || !whatIsHappening.trim()) {
                  showToast('error', 'Required Fields', 'Please enter a problem title and brief description.');
                  return;
                }
                setStep(2);
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Next: Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: LOCATION (SECTION 10) */}
      {/* ========================================================================= */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Where did you notice this problem?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Capture your GPS location on site or enter your district and village manually.
            </p>
          </div>

          {/* Primary GPS Button */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-amber-50/40 border border-amber-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Crosshair className="w-4 h-4 text-amber-600" />
                  <span>Automatic GPS Geolocation</span>
                </span>
                <p className="text-xs text-slate-600">
                  Recommended if you are currently standing near the problem site.
                </p>
              </div>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLocating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Detecting GPS...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    <span>Use My Current Location</span>
                  </>
                )}
              </button>
            </div>

            {/* GPS Status / Messages */}
            {locationSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{locationSuccessMsg}</span>
              </div>
            )}

            {locationError && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{locationError}</span>
              </div>
            )}

            {/* Interactive Location Preview */}
            {gps && (
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-700 font-mono text-[11px]">
                  <span>Latitude: {gps.lat}° N</span>
                  <span>Longitude: {gps.lng}° E</span>
                </div>
                <span className="text-[10px] text-emerald-800 font-bold block">
                  &bull; High-precision geotagging linked to this report
                </span>
              </div>
            )}
          </div>

          {/* Manual Location Fallback (Section 10) */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Manual Location Entry
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* District */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  District <span className="text-rose-600">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                >
                  {JHARKHAND_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Block */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Block / Tehsil <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  placeholder="e.g. Torpa"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              {/* Village / Town */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Village / Ward / Landmark <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Dormo Panchayat"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Step 2 Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!district || !block || !village) {
                  showToast('error', 'Location Required', 'Please enter your District, Block, and Village/Town.');
                  return;
                }
                setStep(3);
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Next: Add Evidence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: EVIDENCE (SECTIONS 11-13) */}
      {/* ========================================================================= */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Add Evidence
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Photos or videos can help us understand the problem better. Adding evidence speeds up verification.
            </p>
          </div>

          {/* Evidence Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 1. Open Camera */}
            <button
              type="button"
              onClick={handleOpenCamera}
              className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300/80 shadow-2xs transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Open Camera</span>
              <span className="text-[10px] text-amber-900/80">Take photo on site</span>
            </button>

            {/* 2. Upload Photos */}
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Upload Photos</span>
              <span className="text-[10px] text-slate-500">Select multiple images</span>
            </button>

            {/* 3. Upload Video */}
            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = 'video/*';
                  fileInputRef.current.click();
                }
              }}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Video className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Upload Video</span>
              <span className="text-[10px] text-slate-500">Short clip (&lt; 30MB)</span>
            </button>

            {/* 4. Upload Document */}
            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = '.pdf,.doc,.docx,.txt';
                  fileInputRef.current.click();
                }
              }}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">Upload Document</span>
              <span className="text-[10px] text-slate-500">Letter or notice</span>
            </button>
          </div>

          {/* Hidden File Inputs */}
          <input
            ref={photoInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => handleFileUpload(e, 'document')}
          />

          {/* Photo Gallery Thumbnail Experience (Section 12) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Attached Photos ({photos.length})
              </span>
              <span className="text-xs text-slate-500">
                You can add multiple photos from different angles
              </span>
            </div>

            {photos.length === 0 ? (
              <div className="p-8 rounded-2xl border-2 border-dashed border-slate-300 text-center text-xs text-slate-500 space-y-2">
                <Camera className="w-6 h-6 mx-auto text-slate-400" />
                <p>No photos attached yet. Adding photos helps others understand the problem.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Evidence'}
                      className="w-full h-full object-cover"
                    />

                    {/* Geotag Indicator */}
                    {photo.isGeotagged && (
                      <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-bold text-emerald-300 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>Geotagged</span>
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-600 text-white opacity-80 hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Other Attached Files List */}
          {otherFiles.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Other Files ({otherFiles.length})
              </span>
              <div className="space-y-2">
                {otherFiles.map((f) => (
                  <div
                    key={f.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-slate-500" />
                      <span className="font-medium text-slate-800">{f.name}</span>
                      <span className="text-slate-500 text-[10px]">({f.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtherFiles((prev) => prev.filter((item) => item.id !== f.id))}
                      className="text-rose-600 hover:text-rose-800 text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Note (Section 13) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong>Privacy Protection:</strong> Exact personal metadata is safely protected. Public visitors see verified summaries and general village location, without exposing your private contact details.
            </p>
          </div>

          {/* Step 3 Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Next: Review & Submit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: REVIEW & SUBMIT (SECTION 14) */}
      {/* ========================================================================= */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Review Your Report
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Please check your report details before submitting.
            </p>
          </div>

          <div className="space-y-4">
            {/* Section: Problem */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Problem
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{problemTitle}</h3>
              <p className="text-xs text-slate-600">{whatIsHappening}</p>
              <div className="pt-1">
                <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold border border-amber-300">
                  Category: {selectedCategory}
                </span>
              </div>
            </div>

            {/* Section: Location */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Location
                </span>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-800 font-medium">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>{village}, {block}, {district} District, Jharkhand</span>
              </div>
              {gps ? (
                <span className="text-[11px] text-emerald-800 font-semibold block">
                  ✓ GPS coordinates captured ({gps.lat}, {gps.lng})
                </span>
              ) : (
                <span className="text-[11px] text-slate-500 block">
                  Manual location entered
                </span>
              )}
            </div>

            {/* Section: Evidence */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Evidence ({photos.length} photos, {otherFiles.length} files)
                </span>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              {photos.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {photos.map((p) => (
                    <img
                      key={p.id}
                      src={p.url}
                      alt="Thumbnail"
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Accuracy Confirmation Checkbox (Section 14) */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
            <p className="text-xs text-amber-950 font-medium">
              Please confirm that the information you provided is accurate to the best of your knowledge.
            </p>

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={confirmAccuracy}
                onChange={(e) => setConfirmAccuracy(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-slate-900">
                I confirm that this report is based on a real problem I observed in my community.
              </span>
            </label>
          </div>

          {/* Step 4 Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting || !confirmAccuracy}
              onClick={handleSubmitProblem}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm rounded-xl shadow-lg hover:shadow-xl cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Submitting to Portal...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Problem</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LIVE CAMERA MODAL (WHEN USER CLICKS OPEN CAMERA) */}
      {/* ========================================================================= */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 space-y-4 p-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm">Site Photo Capture</span>
              </div>
              <button
                type="button"
                onClick={handleCloseCamera}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Viewfinder */}
            <div className="relative aspect-4/3 bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {cameraError && (
                <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-amber-400" />
                  <p className="text-xs text-slate-300">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseCamera();
                      photoInputRef.current?.click();
                    }}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
                  >
                    Select Photo from Gallery
                  </button>
                </div>
              )}
            </div>

            {/* Shutter Button */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleCloseCamera}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-xl text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCapturePhoto}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                title="Snap Picture"
              >
                <div className="w-10 h-10 rounded-full border-2 border-slate-950" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
