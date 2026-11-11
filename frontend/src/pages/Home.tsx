import { Link } from 'react-router-dom';
import { Scan, Brain, Upload, Cpu, BarChart2, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScanCard from '../components/ScanCard';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

const HOW_IT_WORKS = [
  {
    step: 1,
    Icon: Upload,
    title: 'Select a scan type',
    description:
      'Choose between Chest X-ray or Brain MRI analysis to begin the workflow.',
  },
  {
    step: 2,
    Icon: Scan,
    title: 'Upload your image',
    description:
      'Upload a single PNG or JPEG image. Drag and drop or use the file browser.',
  },
  {
    step: 3,
    Icon: Cpu,
    title: 'Model analyses the image',
    description:
      'The image is sent to the backend, which routes it to the appropriate deep-learning model.',
  },
  {
    step: 4,
    Icon: BarChart2,
    title: 'Review the results',
    description:
      'View the predicted class, confidence scores, and Grad-CAM explanation when available.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="bg-surface border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand bg-brand/subtle border border-brand/30 px-3.5 py-1 rounded-full mb-6">
              <Shield className="w-3.5 h-3.5" />
              Academic Research Project
            </span>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#EEF2F4] leading-tight mb-4 tracking-tight">
              Medical Image{' '}
              <span className="text-brand font-medium">Diagnosis Assistant</span>
            </h1>

            <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl mx-auto mb-3">
              A deep-learning tool for analysing chest X-ray and brain MRI
              images. Upload a scan, and the model returns a predicted
              classification with confidence scores.
            </p>

            <p className="text-sm text-muted/80 max-w-xl mx-auto mb-10">
              Built as part of an academic project exploring convolutional neural
              networks for medical image classification.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/upload/xray"
                className="px-6 py-3 bg-brand text-[#EEF2F4] text-sm font-semibold rounded-xl
                  hover:bg-brand-hover transition-colors shadow-sm"
              >
                Analyse X-ray
              </Link>
              <Link
                to="/upload/mri"
                className="px-6 py-3 bg-surface-card text-[#EEF2F4] text-sm font-semibold rounded-xl border
                  border-border hover:border-brand hover:bg-surface-elevated transition-colors shadow-sm"
              >
                Analyse Brain MRI
              </Link>
            </div>
          </div>
        </section>

        {/* ── Scan cards ────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-xl font-semibold text-[#EEF2F4] text-center mb-2">
            Select Scan Type
          </h2>
          <p className="text-sm text-muted text-center mb-8">
            Choose the type of medical image you want to analyse.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
            <ScanCard
              title="Chest X-ray Analysis"
              description="Classify a chest X-ray image as Normal or Pneumonia."
              detail="Accepts a single 2D frontal chest X-ray in PNG or JPEG format. The model returns a binary classification with confidence scores."
              Icon={Scan}
              href="/upload/xray"
            />
            <ScanCard
              title="Brain MRI Analysis"
              description="Classify a brain MRI image for tumour types."
              detail="Accepts a single 2D axial MRI slice in PNG or JPEG format. The model classifies the scan across four tumour categories."
              Icon={Brain}
              href="/upload/mri"
            />
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────────────────── */}
        <section className="bg-surface-card border-y border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <h2 className="text-xl font-semibold text-[#EEF2F4] text-center mb-2">
              How It Works
            </h2>
            <p className="text-sm text-muted text-center mb-10">
              Four steps from image to result.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {HOW_IT_WORKS.map(({ step, Icon, title, description }) => (
                <div key={step} className="text-center sm:text-left">
                  <div className="flex sm:flex-col items-center sm:items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-inner border border-border flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4.5 h-4.5 text-brand" strokeWidth={1.75} />
                    </div>
                    <span className="text-xs font-semibold text-brand uppercase tracking-widest">
                      Step {step}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#EEF2F4] mb-1">{title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Disclaimer ────────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <MedicalDisclaimer />
        </section>
      </main>

      <Footer />
    </div>
  );
}
