import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import './CompleteLandingPage.css';

const CompleteLandingPage = () => {
  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    grade: '',
    score: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [signupCount, setSignupCount] = useState(7567);
  const [currentSignupIndex, setCurrentSignupIndex] = useState(0);
  const [dynamicTextIndex, setDynamicTextIndex] = useState(0);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isDemoStarted, setIsDemoStarted] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [showLesson, setShowLesson] = useState(false);
  const [highlightMathTab, setHighlightMathTab] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [dashboardFadeOut, setDashboardFadeOut] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState(''); // 'correct', 'incorrect', or ''
  const [blocksAnimating, setBlocksAnimating] = useState(false);
  const [messyBlocks, setMessyBlocks] = useState([]);
  const [neatBlocks, setNeatBlocks] = useState([]);
  const [messyFillers, setMessyFillers] = useState([]);

  // Refs for intersection observers
  const demoSectionRef = useRef(null);
  const chartContainerRef = useRef(null);
  const blocksRef = useRef(null);
  const animationFrameRef = useRef(null);
  const explanationRef = useRef(null);

  // Handle answer input
  const handleAnswerChange = useCallback((e) => {
    const value = e.target.value;
    setUserAnswer(value);

    // Check if answer is correct (accepts various formats)
    const normalized = value.toLowerCase().replace(/\s/g, '');
    if (normalized.includes('2') && normalized.includes('4') ||
        normalized.includes('x=2') && normalized.includes('x=4') ||
        normalized === '2,4' || normalized === '4,2') {
      setAnswerStatus('correct');
    } else if (value.length > 0) {
      setAnswerStatus('incorrect');
    } else {
      setAnswerStatus('');
    }
  }, []);

  // Memoized data
  const recentSignups = useMemo(() => [
    'Sarah from California just joined',
    'Michael from New York just joined',
    'Emma from Texas just joined',
    'David from Florida just joined',
    'Ashley from Illinois just joined',
    'Jordan from Pennsylvania just joined',
    'Madison from Ohio just joined',
    'Tyler from Georgia just joined'
  ], []);

  const dynamicTexts = useMemo(() => [
    'Elite Preparation',
    'Expert Personal Tutors',
    'Science-Based Methods',
    'Full-Tailored Courses',
    'Precision Analytics',
    'Diagnostic Test',
    'AI-Powered Learning'
  ], []);

  const chartData = useMemo(() => [
    { week: 1, traditional: 45, launchPrep: 35 },
    { week: 2, traditional: 60, launchPrep: 40 },
    { week: 3, traditional: 70, launchPrep: 45 },
    { week: 4, traditional: 75, launchPrep: 50 },
    { week: 5, traditional: 78, launchPrep: 65 },
    { week: 6, traditional: 80, launchPrep: 78 },
    { week: 7, traditional: 81, launchPrep: 88 },
    { week: 8, traditional: 82, launchPrep: 95 },
    { week: 9, traditional: 82, launchPrep: 100 }
  ], []);

  // Modal handlers
  const openModal = useCallback(() => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setShowSuccess(false);
    setFormData({ name: '', email: '', phone: '', school: '', grade: '', score: '' });
    document.body.style.overflow = 'unset';
  }, []);

  const handleInputChange = useCallback((e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.school || !formData.grade) {
      alert('Please fill in all required fields');
      return;
    }

    const submissionData = {
      ...formData,
      timestamp: new Date().toISOString()
    };

    const existingData = JSON.parse(localStorage.getItem('launchPrepApplications') || '[]');
    existingData.push(submissionData);
    localStorage.setItem('launchPrepApplications', JSON.stringify(existingData));

    setShowSuccess(true);

    setTimeout(() => {
      closeModal();
    }, 3000);
  }, [formData, closeModal]);

  // Smooth scroll handler
  const handleSmoothScroll = useCallback((e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Social proof animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSignupIndex(prev => (prev + 1) % recentSignups.length);
      setSignupCount(prev => prev + 1);
    }, 12000);

    return () => clearInterval(interval);
  }, [recentSignups.length]);

  // Dynamic text animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicTextIndex(prev => (prev + 1) % dynamicTexts.length);
    }, 3750);

    return () => clearInterval(interval);
  }, [dynamicTexts.length]);

  // Teaching sequence
  const startTeachingSequence = useCallback(() => {
    const steps = [0, 1200, 2400, 3600, 4800, 6000, 7200];
    steps.forEach((delay, index) => {
      setTimeout(() => setAnimationStep(index), delay);
    });
  }, []);

  // Demo sequence
  const startDashboardDemo = useCallback(() => {
    if (isDemoStarted) return;
    setIsDemoStarted(true);

    // Reset messages
    setVisibleMessages(0);

    // Highlight and click the Continue Learning button
    setTimeout(() => {
      setButtonClicked(true);
      setTimeout(() => setButtonClicked(false), 300);
    }, 1500);

    // Start fade out animation
    setTimeout(() => {
      setDashboardFadeOut(true);
    }, 2000);

    // Transition to lesson after fade completes
    setTimeout(() => {
      setShowDashboard(false);
      setDashboardFadeOut(false);
      setTimeout(() => {
        setShowLesson(true);
        setTimeout(() => {
          setIsChatExpanded(true);
          // Start showing messages one by one with slower timing
          setTimeout(() => {
            setVisibleMessages(1);
            setTimeout(() => {
              setVisibleMessages(2);
              setTimeout(() => {
                setVisibleMessages(3);
                setTimeout(() => {
                  setVisibleMessages(4);
                  setTimeout(() => startTeachingSequence(), 1500);
                }, 1400);
              }, 1400);
            }, 1400);
          }, 1000);
        }, 800);
      }, 100);
    }, 2500);
  }, [isDemoStarted, startTeachingSequence]);

  // Intersection observer for demo
  useEffect(() => {
    if (!demoSectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !isDemoStarted) {
            setTimeout(() => startDashboardDemo(), 500);
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(demoSectionRef.current);

    return () => observer.disconnect();
  }, [isDemoStarted, startDashboardDemo]);

  // Intersection observer for chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-in-view');
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(chartContainerRef.current);

    return () => observer.disconnect();
  }, []);

  // Intersection observer for explanation points
  useEffect(() => {
    if (!explanationRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-in-view');
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(explanationRef.current);

    return () => observer.disconnect();
  }, []);

  // Intersection observer for sections fade-in
  useEffect(() => {
    const sections = document.querySelectorAll('section:not(.hero)');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -100px 0px' }
    );

    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Preset animation for blocks with drop effect
  useEffect(() => {
    const timer = setTimeout(() => {
      // Preset messy blocks - realistic stacking from bottom up (bucket: 123px wide, height: 200px)
      const messyFinalPositions = [
        // Bottom row - resting on floor (y: 170)
        { x: 8, y: 170, rotation: 5 },
        { x: 45, y: 170, rotation: -3 },
        { x: 85, y: 170, rotation: 8 },

        // Second row - resting on/near bottom blocks (y: 138-142)
        { x: 12, y: 138, rotation: -6 },
        { x: 48, y: 140, rotation: 4 },
        { x: 82, y: 142, rotation: -8 },

        // Third row - resting on second row (y: 106-112)
        { x: 10, y: 106, rotation: 7 },
        { x: 50, y: 108, rotation: -5 },
        { x: 83, y: 112, rotation: 6 },

        // Fourth row - resting on third row (y: 74-80)
        { x: 15, y: 74, rotation: -7 },
        { x: 48, y: 78, rotation: 8 },
        { x: 80, y: 80, rotation: -4 },

        // Fifth row - resting on fourth row (y: 42-48)
        { x: 12, y: 42, rotation: 6 },
        { x: 50, y: 45, rotation: -5 },
        { x: 82, y: 48, rotation: 7 },

        // Sixth row - resting on fifth row (y: 10-16)
        { x: 10, y: 10, rotation: -8 },
        { x: 48, y: 13, rotation: 6 },
        { x: 85, y: 16, rotation: -6 }
      ];

      // Initialize blocks at top with opacity 0
      const initMessyBlocks = messyFinalPositions.map((pos, i) => ({
        id: i,
        x: pos.x,
        y: -50, // Start above bucket
        finalY: pos.y,
        width: 30,
        height: 30,
        rotation: pos.rotation,
        opacity: 0,
        dropping: false
      }));

      // Preset neat blocks - perfect stack (4 rows to fill ~75%)
      const positions = [1, 41, 81];
      const initNeatBlocks = [];
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 3; col++) {
          const idx = row * 3 + col;
          initNeatBlocks.push({
            id: idx,
            x: positions[col],
            y: -50, // Start above bucket
            finalY: 160 - (row * 40),
            width: 40,
            height: 40,
            rotation: 0,
            opacity: 0,
            dropping: false
          });
        }
      }

      setMessyBlocks(initMessyBlocks);
      setNeatBlocks(initNeatBlocks);

      // Animate messy blocks dropping one by one
      messyFinalPositions.forEach((_, i) => {
        setTimeout(() => {
          setMessyBlocks(prev => prev.map((b, idx) =>
            idx === i ? { ...b, opacity: 1, dropping: true, y: b.finalY } : b
          ));
        }, i * 150);
      });

      // Animate neat blocks dropping one by one (very slow and deliberate)
      initNeatBlocks.forEach((_, i) => {
        setTimeout(() => {
          setNeatBlocks(prev => prev.map((b, idx) =>
            idx === i ? { ...b, opacity: 1, dropping: true, y: b.finalY } : b
          ));
        }, i * 700);
      });

      // Add smaller filler shapes after main messy blocks finish (18 blocks now)
      // Main blocks occupy (30x30px, bucket: 123px):
      // Row 7 (y: 170-200): x: 8-38, 45-75, 85-115
      // Row 6 (y: 138-168): x: 12-42, 48-78, 82-112
      // Row 5 (y: 106-136): x: 10-40, 50-80, 83-113
      // Row 4 (y: 74-104):  x: 15-45, 48-78, 80-110
      // Row 3 (y: 42-72):   x: 12-42, 50-80, 82-112
      // Row 2 (y: 10-40):   x: 10-40, 48-78, 85-115
      setTimeout(() => {
        const fillerShapes = [
          // Bottom row gaps (y: 170-200)
          { x: 2, y: 182, size: 5, shape: 'circle', rotation: 0 },
          { x: 40, y: 185, size: 4, shape: 'square', rotation: 0 },
          { x: 77, y: 183, size: 5, shape: 'triangle', rotation: 0 },
          { x: 116, y: 184, size: 6, shape: 'circle', rotation: 0 },

          // Row 6 gaps (y: 138-168)
          { x: 2, y: 150, size: 8, shape: 'square', rotation: 0 },
          { x: 43, y: 152, size: 4, shape: 'circle', rotation: 0 },
          { x: 79, y: 155, size: 5, shape: 'triangle', rotation: 0 },
          { x: 113, y: 154, size: 9, shape: 'square', rotation: 0 },

          // Row 5 gaps (y: 106-136)
          { x: 2, y: 118, size: 6, shape: 'triangle', rotation: 0 },
          { x: 42, y: 120, size: 6, shape: 'circle', rotation: 0 },
          { x: 81, y: 122, size: 4, shape: 'square', rotation: 0 },
          { x: 114, y: 121, size: 7, shape: 'triangle', rotation: 0 },

          // Row 4 gaps (y: 74-104)
          { x: 2, y: 86, size: 10, shape: 'circle', rotation: 0 },
          { x: 46, y: 88, size: 4, shape: 'square', rotation: 0 },
          { x: 111, y: 90, size: 8, shape: 'triangle', rotation: 0 },

          // Row 3 gaps (y: 42-72)
          { x: 2, y: 54, size: 8, shape: 'square', rotation: 0 },
          { x: 43, y: 57, size: 5, shape: 'circle', rotation: 0 },
          { x: 81, y: 60, size: 4, shape: 'triangle', rotation: 0 },
          { x: 113, y: 58, size: 9, shape: 'square', rotation: 0 },

          // Row 2 gaps (y: 10-40)
          { x: 2, y: 22, size: 6, shape: 'triangle', rotation: 0 },
          { x: 42, y: 25, size: 5, shape: 'circle', rotation: 0 },
          { x: 79, y: 27, size: 4, shape: 'square', rotation: 0 },
          { x: 116, y: 24, size: 6, shape: 'circle', rotation: 0 }
        ];

        const initFillers = fillerShapes.map((shape, i) => ({
          id: i,
          x: shape.x,
          y: -30,
          finalY: shape.y,
          size: shape.size,
          shape: shape.shape,
          rotation: shape.rotation,
          opacity: 0,
          dropping: false
        }));

        setMessyFillers(initFillers);

        // Drop filler shapes one by one
        fillerShapes.forEach((_, i) => {
          setTimeout(() => {
            setMessyFillers(prev => prev.map((f, idx) =>
              idx === i ? { ...f, opacity: 1, dropping: true, y: f.finalY } : f
            ));
          }, i * 120);
        });
      }, 2000);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <nav className="nav">
          <div className="logo">Launch Prep</div>
          <ul className="nav-links">
            <li><a href="#features" onClick={(e) => handleSmoothScroll(e, '#features')}>Features</a></li>
            <li><a href="#demo" onClick={(e) => handleSmoothScroll(e, '#demo')}>Demo</a></li>
            <li><a href="#stats" onClick={(e) => handleSmoothScroll(e, '#stats')}>Results</a></li>
            <li><a href="#universities" onClick={(e) => handleSmoothScroll(e, '#universities')}>Team</a></li>
          </ul>
          <button className="cta-nav" onClick={openModal}>Join Waitlist</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-ambient-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">Coming Soon • Early December</div>
          <h1 className="hero-title">
            <span className="hero-title-main">Master the ACT with</span>
            <br />
            <span key={dynamicTextIndex} className="dynamic-text">{dynamicTexts[dynamicTextIndex]}</span>
          </h1>
          <p className="hero-subtitle guarantee-text">
            Guaranteed 35+ ACT score or your money back.*
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={openModal}>Join Waitlist</button>
            <a href="#demo" className="btn btn-secondary" onClick={(e) => handleSmoothScroll(e, '#demo')}>Watch Demo</a>
          </div>
          <div className="waitlist-offer">
            <p className="offer-text">
              Waitlist gets full access for <strong className="free-highlight">FREE</strong> • Normally <span className="strikethrough">$999</span>
            </p>
          </div>
          <div className="social-proof hero-social-proof">
            <div className="recent-signup">
              <span className="signup-dot"></span>
              <span className="signup-text">{recentSignups[currentSignupIndex]}</span>
            </div>
            <div className="total-signups">
              <span>{signupCount.toLocaleString()}</span> students on waitlist
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="timeline-container">
          <div className="timeline-header">
            <h2 className="timeline-title">Your Learning Journey</h2>
            <p className="timeline-description">Four progressive steps designed to take you from baseline to perfect score</p>
          </div>

          <div className="journey-layout">
            <div className="journey-explanation">
              <div className="explanation-item">
                <svg className="explanation-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div className="explanation-number">Week 1</div>
                <div className="explanation-content">
                  <h3>Comprehensive Diagnostic</h3>
                  <p>Full-length practice test to identify your specific strengths and knowledge gaps across all ACT sections.</p>
                </div>
              </div>

              <div className="explanation-item">
                <svg className="explanation-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6.042C10.3516 4.56336 8.2144 3.74694 6 4.00002C4.85883 4.10942 3.75608 4.45813 2.753 5.02002C2.28112 5.28278 2.00005 5.76741 2 6.29002V17.29C2.00005 17.6417 2.12601 17.9816 2.35519 18.2467C2.58436 18.5118 2.90226 18.6847 3.249 18.733C5.39342 19.0238 7.58258 18.6436 9.529 17.64C9.82787 17.4869 10.1611 17.4061 10.5 17.4061C10.8389 17.4061 11.1721 17.4869 11.471 17.64C13.4174 18.6436 15.6066 19.0238 17.751 18.733C18.0977 18.6847 18.4156 18.5118 18.6448 18.2467C18.874 17.9816 19 17.6417 19 17.29V6.29002C18.9999 5.76741 18.7189 5.28278 18.247 5.02002C17.2439 4.45813 16.1412 4.10942 15 4.00002C12.7856 3.74694 10.6484 4.56336 9 6.04202" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6V17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="explanation-number">Weeks 2-4</div>
                <div className="explanation-content">
                  <h3>Foundation Building</h3>
                  <p>Targeted lessons addressing your weak areas while reinforcing core concepts and test-taking strategies.</p>
                </div>
              </div>

              <div className="explanation-item">
                <svg className="explanation-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="explanation-number">Weeks 5-7</div>
                <div className="explanation-content">
                  <h3>Advanced Application</h3>
                  <p>Practice with increasingly difficult problems, timing strategies, and section-specific optimization techniques.</p>
                </div>
              </div>

              <div className="explanation-item">
                <svg className="explanation-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="explanation-number">Week 8</div>
                <div className="explanation-content">
                  <h3>Score Mastery</h3>
                  <p>Final preparation with full practice tests, review sessions, and confidence-building exercises.</p>
                </div>
              </div>
            </div>

            <div className="staircase-visual">
              <div className="staircase-timeline">
                <div className="step step-0">
                  <div className="step-block">
                    <div className="step-label">Start</div>
                    <div className="step-subtitle">Baseline</div>
                  </div>
                </div>

                <div className="step step-1">
                  <div className="step-block">
                    <div className="step-label">Build</div>
                    <div className="step-subtitle">Foundation</div>
                  </div>
                </div>

                <div className="step step-2">
                  <div className="step-block">
                    <div className="step-label">Apply</div>
                    <div className="step-subtitle">Skills</div>
                  </div>
                </div>

                <div className="step step-3">
                  <div className="step-block">
                    <div className="step-label">Master</div>
                    <div className="step-subtitle">Perfect Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">Innovative Learning Architecture</h2>
          <p className="section-subtitle">Revolutionary methodology that builds complete mastery while competitors focus on isolated problem-solving.</p>
        </div>

        <div className="science-container" ref={blocksRef}>
          <div className="comparison-grid">
            <div className="method-card method-traditional">
              <div className="method-header">
                <h3 className="method-title">Most Courses</h3>
              </div>
              <div className="method-indicator">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18C1.64537 18.3024 1.55299 18.6453 1.55201 18.9945C1.55103 19.3437 1.64149 19.6871 1.81442 19.9905C1.98735 20.2939 2.23672 20.5467 2.53771 20.7239C2.8387 20.901 3.18082 20.9962 3.53 21H20.47C20.8192 20.9962 21.1613 20.901 21.4623 20.7239C21.7633 20.5467 22.0127 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="blocks-container">
                <div className="block-bucket">
                  {messyBlocks.map(block => (
                    <div
                      key={block.id}
                      className="block physics-block"
                      style={{
                        position: 'absolute',
                        left: `${block.x}px`,
                        top: `${block.y}px`,
                        width: `${block.width}px`,
                        height: `${block.height}px`,
                        transform: `rotate(${block.rotation}deg)`,
                        opacity: block.opacity,
                        transition: block.dropping
                          ? 'top 0.5s ease-out, opacity 0.2s ease'
                          : 'opacity 0.2s ease'
                      }}
                    />
                  ))}
                  {messyFillers.map(filler => (
                    <div
                      key={`filler-${filler.id}`}
                      className={`filler-shape filler-${filler.shape}`}
                      style={{
                        position: 'absolute',
                        left: `${filler.x}px`,
                        top: `${filler.y}px`,
                        width: `${filler.size}px`,
                        height: `${filler.size}px`,
                        transform: `rotate(${filler.rotation}deg)`,
                        opacity: filler.opacity,
                        transition: filler.dropping
                          ? 'top 0.4s ease-out, opacity 0.2s ease'
                          : 'opacity 0.2s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
              <p className="method-result">Gaps remain, can't reach perfection</p>
            </div>

            <div className="method-card method-launch">
              <div className="method-header">
                <h3 className="method-title">
                  Launch Prep
                  <svg className="verified-badge" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" fill="#007AFF" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </h3>
              </div>
              <div className="method-indicator">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="blocks-container">
                <div className="block-bucket">
                  {neatBlocks.map(block => (
                    <div
                      key={block.id}
                      className="block physics-block neat-block"
                      style={{
                        position: 'absolute',
                        left: `${block.x}px`,
                        top: `${block.y}px`,
                        width: `${block.width}px`,
                        height: `${block.height}px`,
                        transform: `rotate(${block.rotation}deg)`,
                        opacity: block.opacity,
                        transition: block.dropping
                          ? 'top 0.5s ease-out, opacity 0.2s ease'
                          : 'opacity 0.2s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
              <p className="method-result">Complete mastery through foundations</p>
            </div>
          </div>

          <div className="science-insight">
            <p className="insight-text">
              <strong>Bottom-up learning beats top-down 23% of the time.</strong>
              We build foundations first instead of rushing to practice tests.
            </p>
          </div>
        </div>
      </section>

      {/* Learning Progress Section */}
      <section className="learning-progress-section">
        <div className="progress-container">
          <div className="progress-chart-container" ref={chartContainerRef}>
            <h3 className="chart-title">Score Progress: Foundation vs. Quick Fixes</h3>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color traditional"></div>
                <span>Traditional Method</span>
              </div>
              <div className="legend-item">
                <div className="legend-color launch-prep"></div>
                <span>Launch Prep</span>
              </div>
            </div>
            <div className="chart-wrapper">
              <div className="chart-graph">
                <div className="y-axis">
                  <div className="y-label">100%</div>
                  <div className="y-label">75%</div>
                  <div className="y-label">50%</div>
                  <div className="y-label">25%</div>
                  <div className="y-label">0%</div>
                </div>
                <div className="chart-container">
                  {chartData.map((data, index) => (
                    <div key={index} className="week-column" data-tooltip={`Traditional: ${data.traditional}% vs Launch Prep: ${data.launchPrep}%`}>
                      <div className="week-bars">
                        <div
                          className="bar traditional-bar"
                          data-height={data.traditional}
                          data-value={`${data.traditional}%`}
                          style={{
                            '--target-height': `${data.traditional * 2}px`,
                            animationDelay: `${index * 0.1}s`
                          }}
                        ></div>
                        <div
                          className="bar launch-prep-bar"
                          data-height={data.launchPrep}
                          data-value={`${data.launchPrep}%`}
                          style={{
                            '--target-height': `${data.launchPrep * 2}px`,
                            animationDelay: `${index * 0.1}s`
                          }}
                        ></div>
                      </div>
                      <div className="week-label">Week {data.week}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="progress-summary">
            <h2 className="summary-title">Start Slower. Finish Stronger.</h2>
            <p className="summary-text">We build foundations for perfect scores while others rush to quick fixes.</p>
          </div>

          <div className="progress-explanation" ref={explanationRef}>
            <div className="explanation-point">
              <div className="point-number">1</div>
              <div className="point-content">
                <h4>Weeks 1-3: Foundation Building</h4>
                <p>We build solid foundations while others rush to practice tests. This creates exponential growth later.</p>
              </div>
            </div>
            <div className="explanation-point">
              <div className="point-number">2</div>
              <div className="point-content">
                <h4>Weeks 4-6: Acceleration Phase</h4>
                <p>Everything connects and learning accelerates dramatically while others hit walls from gaps.</p>
              </div>
            </div>
            <div className="explanation-point">
              <div className="point-number">3</div>
              <div className="point-content">
                <h4>Weeks 7-9: Perfect Mastery</h4>
                <p>Reach 100% mastery while others plateau at 80%. Complete foundations unlock perfect scores.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="demo-section" ref={demoSectionRef}>
        <div className="demo-container">
          <div className="demo-showcase">
            <div className="demo-header">
              <div>
                <div className="demo-title-wrapper">
                  <span className="new-badge">New</span>
                  <h2 className="section-title demo-title">See Launch Prep in Action</h2>
                </div>
                <p className="section-subtitle">Live demo of our AI-powered ACT prep platform</p>
              </div>
            </div>
            <div className="demo-screen">
              <div className="demo-content">
                <div className="demo-interface">
                  {/* Dashboard Interface */}
                  {showDashboard && (
                    <div className={`dashboard-interface ${dashboardFadeOut ? 'fade-out' : ''}`}>
                      <div className="app-header">
                        <div className="app-logo">Launch Prep</div>
                        <div className="user-info">
                          <span>Sarah Chen</span>
                          <div className="user-avatar">SC</div>
                        </div>
                      </div>

                      <div className="nav-tabs">
                        <div className="nav-tab active">Dashboard</div>
                        <div className={`nav-tab ${highlightMathTab ? 'highlight' : ''}`}>Math Practice</div>
                        <div className="nav-tab">Tests</div>
                        <div className="nav-tab">Progress</div>
                      </div>

                      <div className="dashboard-content">
                        <div className="dashboard-welcome">
                          <h2 className="welcome-title">Welcome back, Sarah! 👋</h2>
                          <p className="welcome-subtitle">You're making great progress</p>
                        </div>

                        <div className="dashboard-stats">
                          <div className="stat-card">
                            <div className="stat-icon">📊</div>
                            <div className="stat-value">28</div>
                            <div className="stat-label">Current Score</div>
                            <div className="stat-change positive">+3 from last week</div>
                          </div>

                          <div className="stat-card">
                            <div className="stat-icon">🎯</div>
                            <div className="stat-value">36</div>
                            <div className="stat-label">Target Score</div>
                            <div className="stat-progress">8 points to goal</div>
                          </div>

                          <div className="stat-card">
                            <div className="stat-icon">📚</div>
                            <div className="stat-value">47</div>
                            <div className="stat-label">Lessons Completed</div>
                            <div className="stat-change positive">12 this week</div>
                          </div>
                        </div>

                        <div className="focus-area">
                          <div className="focus-header">
                            <span className="focus-badge">Focus Area</span>
                            <h3 className="focus-title">Quadratic Equations</h3>
                          </div>
                          <div className="focus-progress-bar">
                            <div className="focus-progress-fill" style={{width: '65%'}}></div>
                          </div>
                          <p className="focus-description">65% mastery • 5 more problems to complete</p>
                        </div>

                        <div className="quick-actions">
                          <button className={`quick-action-btn primary-action ${buttonClicked ? 'clicked' : ''}`}>
                            <span className="action-icon">▶️</span>
                            <div className="action-text">
                              <div className="action-title">Continue Learning</div>
                              <div className="action-subtitle">Math • Quadratics</div>
                            </div>
                          </button>

                          <button className="quick-action-btn secondary-action">
                            <span className="action-icon">📝</span>
                            <div className="action-text">
                              <div className="action-title">Practice Test</div>
                              <div className="action-subtitle">Full-length ACT</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lesson Panel */}
                  {showLesson && (
                    <div className="lesson-panel lesson-panel-visible">
                      <div className="lesson-header">
                        📚 ACT Math • Quadratic Equations
                      </div>
                      <div className="lesson-content">
                        <div className="problem-title">Practice Problem #12</div>
                        <div className="math-problem">
                          <div className="problem-instruction">Solve for x:</div>
                          <div className="math-equation">
                            <div className="equation-terms">
                              <span id="term1" className={animationStep >= 1 ? 'highlighted-term' : ''}>
                                x²
                                {animationStep >= 1 && (
                                  <span className="term-tooltip">Quadratic term</span>
                                )}
                              </span>
                              <span> - </span>
                              <span id="term2" className={animationStep >= 2 ? 'highlighted-term green' : ''}>
                                6x
                                {animationStep >= 2 && (
                                  <span className="term-tooltip">Linear coefficient</span>
                                )}
                              </span>
                              <span> + </span>
                              <span id="term3" className={animationStep >= 3 ? 'highlighted-term blue' : ''}>
                                8
                                {animationStep >= 3 && (
                                  <span className="term-tooltip">Constant term</span>
                                )}
                              </span>
                              <span> = 0</span>
                            </div>
                          </div>

                          <div className="answer-section">
                            <div className="answer-wrapper">
                              <input
                                type="text"
                                placeholder="Your answer..."
                                className={`answer-input ${answerStatus}`}
                                value={userAnswer}
                                onChange={handleAnswerChange}
                              />
                              {answerStatus === 'correct' && (
                                <div className="answer-feedback correct">✓ Correct!</div>
                              )}
                            </div>
                          </div>

                          {animationStep >= 4 && (
                            <div className="solution-steps show">
                              <div className={`step ${animationStep >= 4 ? 'show' : ''}`}>
                                <span className="step-number">Hint 1:</span> Look for two numbers that multiply to 8 and add to -6
                              </div>
                              <div className={`step ${animationStep >= 5 ? 'show' : ''}`}>
                                <span className="step-number">Hint 2:</span> Factor the equation into two binomials: (x - ?)(x - ?)
                              </div>
                              <div className={`step ${animationStep >= 6 ? 'show' : ''}`}>
                                <span className="step-number">Hint 3:</span> Set each factor equal to zero and solve for x
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Tutor Chat */}
                  {showLesson && (
                    <div className={`chat-panel ${isChatExpanded ? 'expanded' : ''}`}>
                      <div className="chat-toggle">🤖</div>
                      <div className="chat-header">🤖 AI Tutor</div>
                      <div className="chat-messages">
                        {visibleMessages >= 1 && <div className="message user-message">Can you teach me this step by step?</div>}
                        {visibleMessages >= 2 && <div className="message ai-message">Absolutely! I'll guide you through each step with visual hints.</div>}
                        {visibleMessages >= 3 && <div className="message user-message">That's so helpful! 🎯</div>}
                        {visibleMessages >= 4 && <div className="message ai-message">Watch as I highlight and explain each part above!</div>}
                      </div>
                    </div>
                  )}
                </div>

                <div className="demo-status">
                  ✨ AI adapts to your learning pace and style
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="stats-section">
        <div className="goals-container">
          <h2 className="goals-title">Our Goals for You</h2>
          <div className="goals-grid">
            <div className="goal-item">
              <span className="goal-number">36</span>
              <span className="goal-label">Score Target</span>
            </div>
            <div className="goal-item">
              <span className="goal-number">8</span>
              <span className="goal-label">Point Goal</span>
            </div>
            <div className="goal-item">
              <span className="goal-number">24</span>
              <span className="goal-label">Hour Course</span>
            </div>
            <div className="goal-item">
              <span className="goal-number">100%</span>
              <span className="goal-label">AI Powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Universities Section */}
      <section id="universities" className="universities-section">
        <div className="section-header">
          <h2 className="section-title">Built by Top Minds</h2>
        </div>

        <div className="universities-showcase">
          <div className="university-carousel">
            <div className="university-visual-card">
              <img src="https://identity.stanford.edu/wp-content/uploads/sites/3/2020/07/block-s-right.png" alt="Stanford" className="university-logo" />
              <div className="university-visual-name">Stanford</div>
              <div className="university-visual-badge">Perfect Scorer</div>
            </div>
            <div className="university-visual-card">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Seal_of_University_of_California%2C_Berkeley.svg/400px-Seal_of_University_of_California%2C_Berkeley.svg.png" alt="Berkeley" className="university-logo" />
              <div className="university-visual-name">Berkeley</div>
              <div className="university-visual-badge">Perfect Scorer</div>
            </div>
            <div className="university-visual-card">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/440px-MIT_logo.svg.png" alt="MIT" className="university-logo" />
              <div className="university-visual-name">MIT</div>
              <div className="university-visual-badge">Perfect Scorer</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Future?</h2>
          <p className="cta-subtitle">Join the waitlist • Get free access when we launch</p>
          <button className="btn btn-primary cta-special" onClick={openModal}>Join Waitlist</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Launch Prep. The future of test preparation.</p>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <div className={`modal ${isModalOpen ? 'show' : ''}`} onClick={(e) => e.target.className.includes('modal') && closeModal()}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2 className="modal-title">Join the Waitlist</h2>
            <p className="modal-subtitle">Get free access when we launch - no payment required</p>

            {!showSuccess ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input type="text" className="form-input" id="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <input type="email" className="form-input" id="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <input type="tel" className="form-input" id="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <input type="text" className="form-input" id="school" placeholder="High School" value={formData.school} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <input type="text" className="form-input" id="grade" placeholder="Current Grade (e.g., 11th grade)" value={formData.grade} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <input type="text" className="form-input" id="score" placeholder="Current ACT Score (or 'Not taken')" value={formData.score} onChange={handleInputChange} />
                </div>
                <button type="submit" className="btn btn-primary form-submit">Join Waitlist</button>
              </form>
            ) : (
              <div className="success-message">
                🎉 You're on the waitlist! You'll get free access when we launch - no payment required.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompleteLandingPage;