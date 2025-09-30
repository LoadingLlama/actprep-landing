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

  // Refs for intersection observers
  const demoSectionRef = useRef(null);
  const chartContainerRef = useRef(null);

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
    const steps = [0, 2800, 5000, 6500, 8000, 9500, 11000];
    steps.forEach((delay, index) => {
      setTimeout(() => setAnimationStep(index), delay);
    });
  }, []);

  // Demo sequence
  const startDashboardDemo = useCallback(() => {
    if (isDemoStarted) return;
    setIsDemoStarted(true);

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
          setTimeout(() => startTeachingSequence(), 3500);
        }, 500);
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
                <div className="explanation-number">Week 1</div>
                <div className="explanation-content">
                  <h3>Comprehensive Diagnostic</h3>
                  <p>Full-length practice test to identify your specific strengths and knowledge gaps across all ACT sections.</p>
                </div>
              </div>

              <div className="explanation-item">
                <div className="explanation-number">Weeks 2-4</div>
                <div className="explanation-content">
                  <h3>Foundation Building</h3>
                  <p>Targeted lessons addressing your weak areas while reinforcing core concepts and test-taking strategies.</p>
                </div>
              </div>

              <div className="explanation-item">
                <div className="explanation-number">Weeks 5-7</div>
                <div className="explanation-content">
                  <h3>Advanced Application</h3>
                  <p>Practice with increasingly difficult problems, timing strategies, and section-specific optimization techniques.</p>
                </div>
              </div>

              <div className="explanation-item">
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

        <div className="science-container">
          <div className="comparison-grid">
            <div className="method-card method-traditional">
              <div className="method-header">
                <h3 className="method-title">Most Courses</h3>
              </div>
              <div className="method-process">
                <div className="process-step">Test</div>
                <div className="process-arrow">→</div>
                <div className="process-step">Fix mistakes</div>
                <div className="process-arrow">→</div>
                <div className="process-step">Plateau at 80%</div>
              </div>
              <p className="method-result">Gaps remain, can't reach perfection</p>
            </div>

            <div className="method-card method-launch">
              <div className="method-header">
                <h3 className="method-title">Launch Prep</h3>
              </div>
              <div className="method-process">
                <div className="process-step">Build foundation</div>
                <div className="process-arrow">→</div>
                <div className="process-step">Fill gaps</div>
                <div className="process-arrow">→</div>
                <div className="process-step">Reach 100%</div>
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
                          style={{ height: `${data.traditional * 2}px` }}
                        ></div>
                        <div
                          className="bar launch-prep-bar"
                          data-height={data.launchPrep}
                          data-value={`${data.launchPrep}%`}
                          style={{ height: `${data.launchPrep * 2}px` }}
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

          <div className="progress-explanation">
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
                              <span id="term1" className={animationStep >= 1 ? 'highlighted-term' : ''}>x²</span>
                              <span> - </span>
                              <span id="term2" className={animationStep >= 2 ? 'highlighted-term green' : ''}>6x</span>
                              <span> + </span>
                              <span id="term3" className={animationStep >= 3 ? 'highlighted-term blue' : ''}>8</span>
                              <span> = 0</span>
                            </div>
                          </div>

                          <div className="answer-section">
                            <div className="answer-wrapper">
                              <label className="answer-label">Your Answer:</label>
                              <input
                                type="text"
                                placeholder="Enter x values (e.g., x = 2, 4)"
                                className="answer-input"
                              />
                              <div className="help-button-wrapper">
                                <button className="help-button">? need help</button>
                              </div>
                            </div>
                          </div>

                          {animationStep >= 4 && (
                            <div className="solution-steps show">
                              <div className={`step ${animationStep >= 4 ? 'show' : ''}`}>
                                <span className="step-number">Step 1:</span> Factor: <span className="step-highlight">(x - 4)(x - 2) = 0</span>
                              </div>
                              <div className={`step ${animationStep >= 5 ? 'show' : ''}`}>
                                <span className="step-number">Step 2:</span> Solve each factor: x - 4 = 0 → x = 4, x - 2 = 0 → x = 2
                              </div>
                              <div className={`step ${animationStep >= 6 ? 'show' : ''}`}>
                                <span className="step-number">Answer:</span> <strong>x = 4 or x = 2</strong> ✅
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
                        <div className="message user-message">Can you teach me this step by step?</div>
                        <div className="message ai-message">Absolutely! I'll guide you through each step with visual hints.</div>
                        <div className="message user-message">That's so helpful! 🎯</div>
                        <div className="message ai-message">Watch as I highlight and explain each part above!</div>
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
              <div className="university-visual-name">Harvard</div>
              <div className="university-visual-badge">Perfect SAT</div>
            </div>
            <div className="university-visual-card">
              <div className="university-visual-name">Stanford</div>
              <div className="university-visual-badge">Valedictorian</div>
            </div>
            <div className="university-visual-card">
              <div className="university-visual-name">Princeton</div>
              <div className="university-visual-badge">Summa Cum Laude</div>
            </div>
            <div className="university-visual-card">
              <div className="university-visual-name">Berkeley</div>
              <div className="university-visual-badge">Phi Beta Kappa</div>
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