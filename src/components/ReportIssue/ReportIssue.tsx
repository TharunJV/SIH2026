import React, { useMemo, useRef, useState, useEffect } from "react";
import "./ReportIssue.css";

type Step = 1 | 2 | 3 | 4;

interface ReportFormData {
  title: string;
  category: string;
  subCategory: string;
  description: string;
  state: string;
  district: string;
  blockCity: string;
  villageWard: string;
  exactLocation: string;
  latitude: number | null;
  longitude: number | null;
  noticedDate: string;
  frequency: string;
  affected: string;
  immediateAction: string;
  photos: File[];
  documents: File[];
}

const initialData: ReportFormData = {
  title: "",
  category: "",
  subCategory: "",
  description: "",
  state: "Jharkhand",
  district: "",
  blockCity: "",
  villageWard: "",
  exactLocation: "",
  latitude: null,
  longitude: null,
  noticedDate: "",
  frequency: "",
  affected: "",
  immediateAction: "",
  photos: [],
  documents: [],
};

const steps = [
  { id: 1, label: "Issue Details" },
  { id: 2, label: "Location Details" },
  { id: 3, label: "Add Evidence" },
  { id: 4, label: "Additional Information" },
] as const;

const categories = [
  "Education",
  "Agriculture",
  "Healthcare",
  "Water Resources",
  "Sanitation",
  "Environment",
  "Energy",
  "Urban Development",
  "Accessibility",
  "Public Administration",
  "Rural Livelihoods",
];

const districts = [
  "Ranchi", "Bokaro", "Dhanbad", "East Singhbhum", "West Singhbhum",
  "Hazaribagh", "Deoghar", "Dumka", "Giridih", "Gumla", "Khunti",
  "Ramgarh", "Simdega", "Latehar", "Lohardaga", "Palamu", "Garhwa",
];

const subCategories: Record<string, string[]> = {
  Education: ["School Infrastructure", "Teaching", "Digital Learning", "Accessibility"],
  Agriculture: ["Irrigation", "Crop Damage", "Storage", "Market Access"],
  Healthcare: ["Primary Health", "Medicine", "Ambulance", "Facilities"],
  "Water Resources": ["Water Shortage", "Water Quality", "Drainage", "Groundwater"],
  Sanitation: ["Waste Management", "Toilets", "Sewage", "Cleanliness"],
  Environment: ["Pollution", "Deforestation", "Waste", "Biodiversity"],
  Energy: ["Street Lighting", "Electricity", "Solar", "Energy Access"],
  "Urban Development": ["Roads", "Footpaths", "Traffic", "Public Spaces"],
  Accessibility: ["Mobility", "Public Buildings", "Transport", "Digital Access"],
  "Public Administration": ["Public Services", "Documentation", "Transparency", "Civic Facilities"],
  "Rural Livelihoods": ["Employment", "Skills", "Self Help Groups", "Local Enterprise"],
};

const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="ri-icon" aria-hidden="true">{children}</span>
);

export default function ReportIssue() {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<ReportFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const photoInput = useRef<HTMLInputElement>(null);
  const documentInput = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const update = <K extends keyof ReportFormData>(key: K, value: ReportFormData[K]) => {
    setData((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const validateStep = (currentStep: Step) => {
    const nextErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!data.title.trim()) nextErrors.title = "Issue title is required";
      if (!data.category) nextErrors.category = "Select a category";
      if (!data.description.trim()) nextErrors.description = "Description is required";
    }

    if (currentStep === 2) {
      if (!data.district) nextErrors.district = "Select a district";
      if (!data.blockCity) nextErrors.blockCity = "Enter the block or city";
      if (!data.villageWard) nextErrors.villageWard = "Enter the village or ward";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goToStep = (nextStep: Step) => {
    if (nextStep > step && !validateStep(step)) return;
    setStep(nextStep);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        left: (nextStep - 1) * scrollRef.current.clientWidth,
        behavior: "smooth",
      });
    });
  };

  const handleFiles = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "photos" | "documents"
  ) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if (type === "photos") {
      update("photos", [...data.photos, ...files].slice(0, 5));
    } else {
      update("documents", [...data.documents, ...files].slice(0, 5));
    }
    event.target.value = "";
  };

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    let finalTranscript = data.description;
    if (finalTranscript && !finalTranscript.endsWith(" ")) {
      finalTranscript += " ";
    }

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
          update("description", finalTranscript);
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setErrors({ location: "Geolocation is not supported by this browser." });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        update("latitude", position.coords.latitude);
        update("longitude", position.coords.longitude);
        update(
          "exactLocation",
          `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
        );
        setErrors((current) => ({ ...current, location: "" }));
      },
      () => setErrors({ location: "Location permission was not granted." }),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const submit = async () => {
    if (!validateStep(4)) return;
    setIsSubmitting(true);

    // Replace this with your existing API call.
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log("Report payload:", data);
    setIsSubmitting(false);
    alert("Report ready to submit. Connect this action to your existing API.");
  };

  const progressWidth = useMemo(() => `${((step - 1) / 3) * 100}%`, [step]);

  return (
    <div className="report-issue-page">
      <main className="ri-shell">
        <section className="ri-heading">
          <div className="ri-heading-icon">▣</div>
          <h1>Report a New Issue</h1>
          <p>Help us identify and solve challenges in your area.</p>
        </section>

        <section className="ri-stepper" aria-label="Report progress">
          <div className="ri-step-line">
            <span style={{ width: progressWidth }} />
          </div>
          {steps.map((item) => {
            const completed = item.id < step;
            const current = item.id === step;
            return (
              <button
                key={item.id}
                type="button"
                className={`ri-step ${current ? "current" : ""} ${completed ? "completed" : ""}`}
                onClick={() => item.id <= step && goToStep(item.id as Step)}
              >
                <span>{completed ? "✓" : item.id}</span>
                <strong>{item.label}</strong>
              </button>
            );
          })}
        </section>

        <div className="ri-slider" ref={scrollRef}>
          <section className="ri-panel">
            <div className="ri-card">
              <div className="ri-card-title">
                <Icon>▣</Icon>
                <div><b>1. Issue Details</b><small>Tell us what is happening.</small></div>
              </div>

              <label>
                Issue Title <em>*</em>
                <input
                  value={data.title}
                  maxLength={100}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="Enter a short and clear title for the issue"
                />
                <small className="ri-count">{data.title.length}/100</small>
                {errors.title && <span className="ri-error">{errors.title}</span>}
              </label>

              <div className="ri-grid-2">
                <label>
                  Issue Category <em>*</em>
                  <select value={data.category} onChange={(e) => update("category", e.target.value)}>
                    <option value="">Select category</option>
                    {categories.map((item) => <option key={item}>{item}</option>)}
                  </select>
                  {errors.category && <span className="ri-error">{errors.category}</span>}
                </label>

                <label>
                  Sub Category <span>(Optional)</span>
                  <select value={data.subCategory} onChange={(e) => update("subCategory", e.target.value)}>
                    <option value="">Select sub category</option>
                    {(subCategories[data.category] || []).map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
              </div>

              <label>
                Description <em>*</em>
                <div className="ri-textarea-wrapper">
                  <textarea
                    value={data.description}
                    maxLength={1000}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Describe the issue in detail. Include how it affects people and any other important information."
                  />
                  <small className="ri-count">{data.description.length}/1000</small>
                  
                  <div className={`ri-mic-container ${isListening ? "active" : ""}`}>
                    {isListening && <span className="ri-listening-text">Listening...</span>}
                    {!isListening && <span className="ri-mic-tooltip">Click to speak<br/>(Voice input)</span>}
                    <button 
                      type="button" 
                      className="ri-mic-button" 
                      onClick={toggleListening}
                      title="Voice Input"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                    </button>
                  </div>
                </div>
                {errors.description && <span className="ri-error">{errors.description}</span>}
              </label>

              <div className="ri-actions">
                <button className="ri-btn secondary" type="button">Cancel</button>
                <button className="ri-btn primary" type="button" onClick={() => goToStep(2)}>Next <span>→</span></button>
              </div>
            </div>
          </section>

          <section className="ri-panel">
            <div className="ri-card">
              <div className="ri-card-title">
                <Icon>⌖</Icon>
                <div><b>2. Location Details</b><small>Pinpoint where the issue exists.</small></div>
              </div>

              <div className="ri-grid-3">
                <label>
                  State <em>*</em>
                  <select value={data.state} onChange={(e) => update("state", e.target.value)}>
                    <option>Jharkhand</option>
                  </select>
                </label>
                <label>
                  District <em>*</em>
                  <select value={data.district} onChange={(e) => update("district", e.target.value)}>
                    <option value="">Select District</option>
                    {districts.map((item) => <option key={item}>{item}</option>)}
                  </select>
                  {errors.district && <span className="ri-error">{errors.district}</span>}
                </label>
                <label>
                  Block / City <em>*</em>
                  <input value={data.blockCity} onChange={(e) => update("blockCity", e.target.value)} placeholder="Enter block / city" />
                  {errors.blockCity && <span className="ri-error">{errors.blockCity}</span>}
                </label>
              </div>

              <div className="ri-grid-2">
                <label>
                  Village / Ward <em>*</em>
                  <input value={data.villageWard} onChange={(e) => update("villageWard", e.target.value)} placeholder="Enter village / ward" />
                  {errors.villageWard && <span className="ri-error">{errors.villageWard}</span>}
                </label>
                <label>
                  Exact Location <span>(Optional)</span>
                  <input value={data.exactLocation} onChange={(e) => update("exactLocation", e.target.value)} placeholder="Landmark or exact location" />
                </label>
              </div>

              <div className="ri-map">
                <div className="ri-map-grid" />
                <div className="ri-map-pin">⌖</div>
                <div className="ri-map-overlay">
                  <button type="button" className="ri-map-button" onClick={() => alert("Map picker not implemented in demo")}>📍 Pick location on map</button>
                  <button type="button" className="ri-map-button" onClick={captureLocation}>📍 Use My Current Location</button>
                </div>
                {data.latitude !== null && (
                  <div className="ri-coordinates">✓ {data.latitude.toFixed(6)}, {data.longitude?.toFixed(6)}</div>
                )}
              </div>
              {errors.location && <span className="ri-error">{errors.location}</span>}

              <div className="ri-actions">
                <button className="ri-btn secondary" type="button" onClick={() => goToStep(1)}>← Back</button>
                <button className="ri-btn primary" type="button" onClick={() => goToStep(3)}>Next <span>→</span></button>
              </div>
            </div>
          </section>

          <section className="ri-panel">
            <div className="ri-card">
              <div className="ri-card-title">
                <Icon>▧</Icon>
                <div><b>3. Add Evidence</b><small>Photos and documents make the report easier to verify.</small></div>
              </div>

              <div className="ri-evidence-grid">
                <div className="ri-photo-section">
                  <label>Photos / Videos</label>
                  <div className="ri-photo-buttons">
                    <button className="ri-upload live" type="button" onClick={() => photoInput.current?.click()}>
                      <span className="ri-upload-icon">📷</span>
                      <strong>Take Live Photo</strong>
                      <small>Capture photo with location</small>
                    </button>
                    <input
                      ref={photoInput}
                      hidden
                      type="file"
                      accept="image/*,video/*"
                      capture="environment"
                      multiple
                      onChange={(e) => handleFiles(e, "photos")}
                    />
                    <div className="ri-or-divider">OR</div>
                    <button className="ri-upload secondary-upload" type="button" onClick={() => photoInput.current?.click()}>
                      <span className="ri-upload-icon">📤</span>
                      <strong>Upload from Device</strong>
                      <small>JPG, PNG, MP4 up to 20MB</small>
                    </button>
                  </div>
                </div>

                <div className="ri-doc-section">
                  <label>Documents <span>(Optional)</span></label>
                  <button className="ri-upload doc-upload" type="button" onClick={() => documentInput.current?.click()}>
                    <span className="ri-upload-icon">📄</span>
                    <strong>Upload Documents</strong>
                    <small>PDF, DOC, DOCX up to 20MB</small>
                  </button>
                  <input
                    ref={documentInput}
                    hidden
                    type="file"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={(e) => handleFiles(e, "documents")}
                  />
                </div>
              </div>

              {data.photos.length > 0 && (
                <div className="ri-file-list">
                  <b>Uploaded Preview</b>
                  <div className="ri-files">
                    {data.photos.map((file, index) => (
                      <div className="ri-file" key={`${file.name}-${index}`}>
                        <span>📷</span>
                        <small>{file.name}</small>
                        <button type="button" onClick={() => update("photos", data.photos.filter((_, i) => i !== index))}>×</button>
                      </div>
                    ))}
                    {data.photos.length < 5 && (
                      <button className="ri-add-more" type="button" onClick={() => photoInput.current?.click()}>
                        <span>+</span>
                        <small>Add More</small>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {data.documents.length > 0 && (
                <div className="ri-file-list">
                  <b>Uploaded Documents</b>
                  <div className="ri-files">
                    {data.documents.map((file, index) => (
                      <div className="ri-file" key={`${file.name}-${index}`}>
                        <span>📄</span>
                        <small>{file.name}</small>
                        <button type="button" onClick={() => update("documents", data.documents.filter((_, i) => i !== index))}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="ri-actions">
                <button className="ri-btn secondary" type="button" onClick={() => goToStep(2)}>← Back</button>
                <button className="ri-btn primary" type="button" onClick={() => goToStep(4)}>Next <span>→</span></button>
              </div>
            </div>
          </section>

          <section className="ri-panel">
            <div className="ri-card">
              <div className="ri-card-title">
                <Icon>ⓘ</Icon>
                <div><b>4. Additional Information</b><small>Help us understand the situation better.</small></div>
              </div>

              <div className="ri-grid-2">
                <label>
                  When did you first notice this issue?
                  <input type="date" value={data.noticedDate} onChange={(e) => update("noticedDate", e.target.value)} />
                </label>
                <label>
                  How frequently does this issue occur?
                  <select value={data.frequency} onChange={(e) => update("frequency", e.target.value)}>
                    <option value="">Select frequency</option>
                    <option>Once</option>
                    <option>Occasionally</option>
                    <option>Frequently</option>
                    <option>Daily</option>
                    <option>Continuously</option>
                  </select>
                </label>
              </div>

              <div className="ri-grid-2">
                <label>
                  Who is mostly affected by this issue?
                  <select value={data.affected} onChange={(e) => update("affected", e.target.value)}>
                    <option value="">Select</option>
                    <option>Children / Students</option>
                    <option>Farmers</option>
                    <option>Women</option>
                    <option>Senior Citizens</option>
                    <option>Persons with Disabilities</option>
                    <option>Entire Community</option>
                    <option>Other</option>
                  </select>
                </label>
                <label>
                  Any immediate action taken? <span>(Optional)</span>
                  <textarea
                    value={data.immediateAction}
                    maxLength={500}
                    onChange={(e) => update("immediateAction", e.target.value)}
                    placeholder="Describe any action taken so far..."
                  />
                  <small className="ri-count">{data.immediateAction.length}/500</small>
                </label>
              </div>

              <div className="ri-review-note">
                <span>✓</span>
                Your report will be reviewed before it is assigned to the appropriate institution.
              </div>

              <div className="ri-actions">
                <button className="ri-btn secondary" type="button" onClick={() => goToStep(3)}>← Back</button>
                <button className="ri-btn primary" type="button" onClick={submit} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Preview & Submit"} <span>→</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        <footer className="ri-footer">
          <span>✦</span>
          Your report will help us build a better and innovative Jharkhand.
        </footer>
      </main>
    </div>
  );
}
