import React, { useEffect, useState } from 'react';
import SubGuardIcon from './SubGuardIcon';

const STEPS = [
  { id: 1, label: 'Verifying Ed25519 principal cryptographic key...', delay: 250 },
  { id: 2, label: 'Establishing FastMCP proxy gateway (Port 8000)...', delay: 350 },
  { id: 3, label: 'Syncing AP2 autonomous spend guardrails ($50.00 ceiling)...', delay: 400 },
  { id: 4, label: 'Arming 48-hour Cancellation Shield autopilot...', delay: 300 }
];

export default function LoadingScreen({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(15);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Step-by-step cryptographic handshake animation
    const t1 = setTimeout(() => {
      setCurrentStep(1);
      setProgress(40);
    }, 280);

    const t2 = setTimeout(() => {
      setCurrentStep(2);
      setProgress(70);
    }, 620);

    const t3 = setTimeout(() => {
      setCurrentStep(3);
      setProgress(90);
    }, 980);

    const t4 = setTimeout(() => {
      setCurrentStep(4);
      setProgress(100);
    }, 1300);

    const t5 = setTimeout(() => {
      setIsFadingOut(true);
    }, 1550);

    const t6 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1950);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 300);
  };

  return (
    <div
      className={`loading-screen ${isFadingOut ? 'fade-out' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--cream, #f6f2ea)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s ease',
        opacity: isFadingOut ? 0 : 1,
        pointerEvents: isFadingOut ? 'none' : 'auto',
        transform: isFadingOut ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      {/* Background Radial Glow */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(63, 100, 255, 0.14) 0%, rgba(43, 191, 136, 0.06) 50%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
          animation: 'pulse-glow 4s ease-in-out infinite'
        }}
      />

      {/* Main Container Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '440px',
          width: '100%'
        }}
      >
        {/* Brand Mark with Shield Badge */}
        <div
          style={{
            position: 'relative',
            marginBottom: '18px'
          }}
        >
          <div
            className="brand-mark"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              boxShadow: '0 16px 36px rgba(19, 35, 62, 0.22)',
              fontSize: '28px'
            }}
          >
            <SubGuardIcon name="bag" size={32} />
            <span
              className="brand-shield"
              style={{
                width: '24px',
                height: '24px',
                right: '-6px',
                bottom: '-4px',
                boxShadow: '0 0 10px rgba(43, 191, 136, 0.6)'
              }}
            >
              <SubGuardIcon name="shield" size={14} stroke={2.4} />
            </span>
          </div>
        </div>

        {/* Brand Name Lockup */}
        <div style={{ marginBottom: '28px' }}>
          <h1
            className="brand-name"
            style={{
              fontSize: '28px',
              margin: '0 0 4px',
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 800,
              letterSpacing: '-1px'
            }}
          >
            Sub<span style={{ color: 'var(--blue, #3f64ff)' }}>Guard</span>
          </h1>
          <span
            style={{
              fontSize: '9px',
              fontWeight: 800,
              letterSpacing: '0.18em',
              color: 'var(--muted, #687387)',
              textTransform: 'uppercase'
            }}
          >
            Shop Smart. Stay Guarded.
          </span>
        </div>

        {/* Neon Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '6px',
            background: 'rgba(19, 35, 62, 0.08)',
            borderRadius: '100px',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: '20px'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #3f64ff 0%, #2bbf88 100%)',
              borderRadius: '100px',
              transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 0 12px rgba(63, 100, 255, 0.5)'
            }}
          />
        </div>

        {/* Step-by-Step Security Protocol Verification List */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            textAlign: 'left',
            background: 'var(--surface, #ffffff)',
            padding: '14px 16px',
            borderRadius: '14px',
            border: '1px solid var(--line, #dedbd3)',
            boxShadow: '0 8px 24px rgba(19, 35, 62, 0.05)'
          }}
        >
          {STEPS.map((step, idx) => {
            const isDone = currentStep > idx;
            const isCurrent = currentStep === idx;
            return (
              <div
                key={step.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '11px',
                  color: isDone ? 'var(--navy, #13233e)' : (isCurrent ? 'var(--blue, #3f64ff)' : 'var(--muted, #8992a0)'),
                  fontWeight: isCurrent || isDone ? 600 : 500,
                  transition: 'all 0.2s ease',
                  opacity: currentStep >= idx ? 1 : 0.5
                }}
              >
                <span
                  className={isDone ? 'loading-step-done' : (isCurrent ? 'loading-step-current' : 'loading-step-pending')}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '9px',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isDone ? (
                    <SubGuardIcon name="check" size={11} stroke={2.4} />
                  ) : isCurrent ? (
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--blue)',
                        animation: 'pulse-dot 1.2s infinite ease-in-out'
                      }}
                    />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </span>
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Skip button for rapid navigation */}
        <button
          type="button"
          onClick={handleSkip}
          className="text-button"
          style={{
            marginTop: '18px',
            fontSize: '11px',
            color: 'var(--muted, #687387)'
          }}
        >
          Skip initialization →
        </button>
      </div>
    </div>
  );
}

