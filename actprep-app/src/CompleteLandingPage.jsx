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

  // Lesson demo animation state
  const [lessonDemoStep, setLessonDemoStep] = useState(0);
  const [showLessonDashboard, setShowLessonDashboard] = useState(true);
  const [showLessonContent, setShowLessonContent] = useState(false);
  const [lessonFadeOut, setLessonFadeOut] = useState(false);
  const [highlightContinueBtn, setHighlightContinueBtn] = useState(false);
  const [highlightLesson, setHighlightLesson] = useState(false);
  const [typedLines, setTypedLines] = useState([]);
  const [currentTypingLine, setCurrentTypingLine] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Diagnostic demo state
  const [diagnosticDemoStep, setDiagnosticDemoStep] = useState(0);
  const [showDiagnosticTest, setShowDiagnosticTest] = useState(false);
  const [diagnosticQuestion, setDiagnosticQuestion] = useState(1);
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [diagnosticFadeOut, setDiagnosticFadeOut] = useState(false);

  // Practice test demo state
  const [testDemoStep, setTestDemoStep] = useState(0);
  const [testHighlight, setTestHighlight] = useState(0);

  // Analytics demo state
  const [analyticsDemoStep, setAnalyticsDemoStep] = useState(0);
  const [analyticsHighlight, setAnalyticsHighlight] = useState(0);

  // Refs for intersection observers
  const demoSectionRef = useRef(null);
  const chartContainerRef = useRef(null);
  const blocksRef = useRef(null);
  const animationFrameRef = useRef(null);
  const explanationRef = useRef(null);
  const lessonDemoRef = useRef(null);
  const diagnosticDemoRef = useRef(null);
  const testDemoRef = useRef(null);
  const analyticsDemoRef = useRef(null);

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
    'Real Questions',
    'Deep Personalization'
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

  // Lesson demo sequence
  const startLessonDemo = useCallback(() => {
    if (lessonDemoStep !== 0) return;

    setLessonDemoStep(1);

    // Step 1: Highlight "Continue Learning" button on dashboard
    setTimeout(() => {
      setHighlightContinueBtn(true);
    }, 800);

    // Step 2: Click button and transition to lesson
    setTimeout(() => {
      setHighlightContinueBtn(false);
      setLessonFadeOut(true);
    }, 2200);

    // Step 3: Switch to lesson content
    setTimeout(() => {
      setShowLessonDashboard(false);
      setLessonFadeOut(false);
      setTimeout(() => {
        setShowLessonContent(true);

        // Step 4: Highlight the active lesson in sidebar
        setTimeout(() => {
          setHighlightLesson(true);
        }, 600);

        // Step 5: Start typing animation
        setTimeout(() => {
          setHighlightLesson(false);

          const lessonLines = [
            "Understanding Subject-Verb Agreement",
            "",
            "One of the most tested concepts on the ACT English section is subject-verb agreement.",
            "",
            "The basic rule: A singular subject takes a singular verb, while a plural subject takes a plural verb.",
            "",
            "Common Challenge: Identifying the true subject when phrases come between the subject and verb.",
            "",
            "Example: The stack of books IS on the table.",
            "",
            "(Not 'are' - the subject is 'stack', not 'books')"
          ];

          let lineIndex = 0;
          let charIndex = 0;
          const completedLines = [];

          const typeNextChar = () => {
            if (lineIndex >= lessonLines.length) {
              setIsTypingComplete(true);
              // Step 6: Reset and restart after typing complete
              setTimeout(() => {
                setLessonDemoStep(0);
                setShowLessonDashboard(true);
                setShowLessonContent(false);
                setTypedLines([]);
                setCurrentTypingLine('');
                setIsTypingComplete(false);

                setTimeout(() => startLessonDemo(), 2000);
              }, 2500);
              return;
            }

            const currentLine = lessonLines[lineIndex];

            if (charIndex < currentLine.length) {
              // Continue typing current line
              setCurrentTypingLine(currentLine.substring(0, charIndex + 1));
              charIndex++;
              setTimeout(typeNextChar, 30); // Pokemon-style typing speed
            } else {
              // Line complete, move to next line
              completedLines.push(currentLine);
              setTypedLines([...completedLines]);
              setCurrentTypingLine('');
              lineIndex++;
              charIndex = 0;
              setTimeout(typeNextChar, 400); // Pause between lines
            }
          };

          typeNextChar();
        }, 2000);
      }, 100);
    }, 2700);
  }, [lessonDemoStep]);

  // Intersection observer for lesson demo
  useEffect(() => {
    if (!lessonDemoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && lessonDemoStep === 0) {
            setTimeout(() => startLessonDemo(), 500);
          } else if (!entry.isIntersecting) {
            // Reset when scrolled out of view
            setLessonDemoStep(0);
            setShowLessonDashboard(true);
            setShowLessonContent(false);
            setTypedLines([]);
            setCurrentTypingLine('');
            setIsTypingComplete(false);
            setLessonFadeOut(false);
            setHighlightContinueBtn(false);
            setHighlightLesson(false);
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(lessonDemoRef.current);

    return () => observer.disconnect();
  }, [lessonDemoStep, startLessonDemo]);

  // Diagnostic demo sequence
  const startDiagnosticDemo = useCallback(() => {
    if (diagnosticDemoStep !== 0) return;
    setDiagnosticDemoStep(1);

    // Step 1: Wait on intro screen
    setTimeout(() => {
      setDiagnosticFadeOut(true);
    }, 2000);

    // Step 2: Transition to test
    setTimeout(() => {
      setShowDiagnosticTest(true);
      setDiagnosticFadeOut(false);
      setDiagnosticQuestion(1);
      setDiagnosticProgress(1);

      // Step 3: Simulate answering questions
      setTimeout(() => {
        // Select answer A
        setSelectedAnswer('A');
      }, 1000);

      setTimeout(() => {
        // Move to question 2
        setSelectedAnswer(null);
        setDiagnosticQuestion(2);
        setDiagnosticProgress(2);
      }, 2200);

      setTimeout(() => {
        // Select answer C
        setSelectedAnswer('C');
      }, 3200);

      setTimeout(() => {
        // Move to question 3
        setSelectedAnswer(null);
        setDiagnosticQuestion(3);
        setDiagnosticProgress(3);
      }, 4400);

      setTimeout(() => {
        // Select answer B
        setSelectedAnswer('B');
      }, 5400);

      // Step 4: Reset and loop
      setTimeout(() => {
        setDiagnosticDemoStep(0);
        setShowDiagnosticTest(false);
        setDiagnosticQuestion(1);
        setDiagnosticProgress(0);
        setSelectedAnswer(null);

        setTimeout(() => startDiagnosticDemo(), 2000);
      }, 6600);
    }, 2500);
  }, [diagnosticDemoStep]);

  // Intersection observer for diagnostic demo
  useEffect(() => {
    if (!diagnosticDemoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && diagnosticDemoStep === 0) {
            setTimeout(() => startDiagnosticDemo(), 500);
          } else if (!entry.isIntersecting) {
            setDiagnosticDemoStep(0);
            setShowDiagnosticTest(false);
            setDiagnosticQuestion(1);
            setDiagnosticProgress(0);
            setSelectedAnswer(null);
            setDiagnosticFadeOut(false);
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(diagnosticDemoRef.current);

    return () => observer.disconnect();
  }, [diagnosticDemoStep, startDiagnosticDemo]);

  // Practice test demo sequence
  const startTestDemo = useCallback(() => {
    if (testDemoStep !== 0) return;
    setTestDemoStep(1);

    const tests = [1, 2, 3];
    let index = 0;

    const highlightNext = () => {
      if (index < tests.length) {
        setTestHighlight(tests[index]);
        index++;
        setTimeout(highlightNext, 1500);
      } else {
        setTimeout(() => {
          setTestDemoStep(0);
          setTestHighlight(0);
          setTimeout(() => startTestDemo(), 1500);
        }, 1000);
      }
    };

    setTimeout(highlightNext, 800);
  }, [testDemoStep]);

  // Intersection observer for test demo
  useEffect(() => {
    if (!testDemoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && testDemoStep === 0) {
            setTimeout(() => startTestDemo(), 500);
          } else if (!entry.isIntersecting) {
            setTestDemoStep(0);
            setTestHighlight(0);
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(testDemoRef.current);

    return () => observer.disconnect();
  }, [testDemoStep, startTestDemo]);

  // Analytics demo sequence
  const startAnalyticsDemo = useCallback(() => {
    if (analyticsDemoStep !== 0) return;
    setAnalyticsDemoStep(1);

    const items = [1, 2, 3, 4];
    let index = 0;

    const highlightNext = () => {
      if (index < items.length) {
        setAnalyticsHighlight(items[index]);
        index++;
        setTimeout(highlightNext, 1300);
      } else {
        setTimeout(() => {
          setAnalyticsDemoStep(0);
          setAnalyticsHighlight(0);
          setTimeout(() => startAnalyticsDemo(), 1500);
        }, 1000);
      }
    };

    setTimeout(highlightNext, 800);
  }, [analyticsDemoStep]);

  // Intersection observer for analytics demo
  useEffect(() => {
    if (!analyticsDemoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && analyticsDemoStep === 0) {
            setTimeout(() => startAnalyticsDemo(), 500);
          } else if (!entry.isIntersecting) {
            setAnalyticsDemoStep(0);
            setAnalyticsHighlight(0);
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(analyticsDemoRef.current);

    return () => observer.disconnect();
  }, [analyticsDemoStep, startAnalyticsDemo]);

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
          <div className="particle particle-6"></div>
          <div className="particle particle-7"></div>
          <div className="particle particle-8"></div>
          <div className="particle particle-9"></div>
          <div className="particle particle-10"></div>
          <div className="particle particle-11"></div>
          <div className="particle particle-12"></div>
          <div className="particle particle-13"></div>
          <div className="particle particle-14"></div>
          <div className="particle particle-15"></div>
        </div>
        <div className="hero-gradient-orbs">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">Coming Soon • Early December</div>
          <h1 className="hero-title">
            <span className="hero-title-main">Master the ACT with</span>
            <br />
            <span key={dynamicTextIndex} className="dynamic-text">{dynamicTexts[dynamicTextIndex]}</span>
          </h1>
          <p className="hero-subtitle guarantee-text">
            Science-backed system proven to maximize ACT performance
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

      {/* Features Showcase Section */}
      <section className="features-showcase-section">
        <div className="features-showcase-container">
          <div className="features-showcase-header">
            <h2 className="features-showcase-title">The science-backed way to build complete mastery from the ground up and achieve 35+ scores.</h2>
          </div>

          <div className="features-vertical-layout">
              {/* Feature 1: Expert-Crafted Lessons - LEFT */}
              <div className="feature-row feature-left" ref={lessonDemoRef}>
                  <div className="slide-preview">
                    <div className="preview-header">
                      <div className="preview-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    <div className="preview-content feature-ai-learning" style={{position: 'relative', overflow: 'hidden'}}>
                      <>
                      {/* Dashboard View */}
                      {showLessonDashboard && (
                        <div className={`lesson-dashboard-view ${lessonFadeOut ? 'fade-out' : ''}`}>
                          <div className="feature-nav">
                            <div className="feature-logo">Launch Prep</div>
                            <div className="feature-nav-items">
                              <span className="nav-item active">Dashboard</span>
                              <span className="nav-item">Tests</span>
                              <span className="nav-item">Lessons</span>
                            </div>
                            <div className="feature-user">SC</div>
                          </div>

                          <div className="dashboard-content">
                            <h1 className="dashboard-welcome">Welcome back, Sarah!</h1>

                            <div className="dashboard-stats-row">
                              <div className="stat-card-mini">
                                <div className="stat-label-mini">Current Score</div>
                                <div className="stat-value-mini">28</div>
                              </div>
                              <div className="stat-card-mini">
                                <div className="stat-label-mini">Target Score</div>
                                <div className="stat-value-mini">34</div>
                              </div>
                              <div className="stat-card-mini">
                                <div className="stat-label-mini">Study Streak</div>
                                <div className="stat-value-mini">8 days</div>
                              </div>
                            </div>

                            <div className="dashboard-continue-card">
                              <div className="continue-card-header">
                                <div className="continue-icon">📚</div>
                                <div className="continue-text-group">
                                  <div className="continue-title">Continue Learning</div>
                                  <div className="continue-subtitle">Quadratic Functions • 3 of 8 complete</div>
                                </div>
                              </div>
                              <button className={`continue-btn-dashboard ${highlightContinueBtn ? 'btn-highlight' : ''}`}>
                                Continue →
                              </button>
                            </div>

                            <div className="dashboard-upcoming">
                              <h3 className="section-title-mini">Upcoming Lessons</h3>
                              <div className="upcoming-lesson-item">
                                <span className="upcoming-lesson-title">Polynomial Operations</span>
                                <span className="upcoming-lesson-badge">Locked</span>
                              </div>
                              <div className="upcoming-lesson-item">
                                <span className="upcoming-lesson-title">Rational Expressions</span>
                                <span className="upcoming-lesson-badge">Locked</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Lesson Content View */}
                      {showLessonContent && (
                        <div className="lesson-content-view">
                          <div className="feature-nav">
                            <div className="feature-logo">Launch Prep</div>
                            <div className="feature-nav-items">
                              <span className="nav-item">Dashboard</span>
                              <span className="nav-item">Tests</span>
                              <span className="nav-item active">Lessons</span>
                            </div>
                            <div className="feature-user">SC</div>
                          </div>

                          <div className="feature-main-with-sidebar">
                        <div className="lesson-sidebar">
                          <div className="sidebar-section-title">English - Unit 2</div>
                          <div className="lesson-list-compact">
                            <div className="lesson-item completed">
                              <div className="lesson-check">✓</div>
                              <div className="lesson-item-text">
                                <div className="lesson-item-title">Punctuation Rules</div>
                                <div className="lesson-item-meta">12 topics</div>
                              </div>
                            </div>
                            <div className="lesson-item completed">
                              <div className="lesson-check">✓</div>
                              <div className="lesson-item-text">
                                <div className="lesson-item-title">Sentence Structure</div>
                                <div className="lesson-item-meta">10 topics</div>
                              </div>
                            </div>
                            <div className={`lesson-item active ${highlightLesson ? 'lesson-highlight' : ''}`}>
                              <div className="lesson-active-indicator"></div>
                              <div className="lesson-item-text">
                                <div className="lesson-item-title">Subject-Verb Agreement</div>
                                <div className="lesson-item-meta">4 of 9 complete</div>
                              </div>
                            </div>
                            <div className="lesson-item locked">
                              <div className="lesson-lock">🔒</div>
                              <div className="lesson-item-text">
                                <div className="lesson-item-title">Pronoun Usage</div>
                                <div className="lesson-item-meta">8 topics</div>
                              </div>
                            </div>
                            <div className="lesson-item locked">
                              <div className="lesson-lock">🔒</div>
                              <div className="lesson-item-text">
                                <div className="lesson-item-title">Modifier Placement</div>
                                <div className="lesson-item-meta">7 topics</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="feature-main-content">
                          <div className="lesson-header-detailed">
                            <div className="lesson-breadcrumb">
                              <span className="breadcrumb-item">English</span>
                              <span className="breadcrumb-separator">›</span>
                              <span className="breadcrumb-item">Grammar</span>
                              <span className="breadcrumb-separator">›</span>
                              <span className="breadcrumb-item active">Subject-Verb Agreement</span>
                            </div>
                            <h2 className="feature-heading">Subject-Verb Agreement</h2>
                            <div className="lesson-meta-row">
                              <div className="lesson-badge">Lesson 18 of 82</div>
                              <div className="lesson-progress-bar">
                                <div className="lesson-progress-fill" style={{width: '44%'}}></div>
                              </div>
                              <span className="progress-percentage">44%</span>
                            </div>
                          </div>

                          <div className="lesson-content-card">
                            <div className="pokemon-text-container">
                              {typedLines.map((line, index) => (
                                <div key={index} className={`typed-line ${line === '' ? 'empty-line' : ''}`}>
                                  {line || '\u00A0'}
                                </div>
                              ))}
                              {currentTypingLine && (
                                <div className="typing-line">
                                  {currentTypingLine}
                                  <span className="typing-cursor"></span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="lesson-footer-actions">
                            <button className="action-btn secondary">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                                <path d="M7 12V1M1 7h12" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                              Ask AI Tutor
                            </button>
                            <div className="footer-right-actions">
                              <button className="action-btn tertiary">Previous</button>
                              <button className="action-btn primary">Continue →</button>
                            </div>
                          </div>
                        </div>
                        </div>
                        </div>
                      )}
                      </>
                    </div>
                  </div>
                  <div className="slide-info">
                    <h3 className="slide-title">80+ Comprehensive Science-Backed Lessons</h3>
                    <p className="slide-description">Masterfully crafted by expert perfect score tutors. Every lesson builds complete understanding from foundational concepts to advanced application.</p>
                  </div>
                </div>

              {/* Feature 2: Diagnostic Assessment - RIGHT */}
              <div className="feature-row feature-right" ref={diagnosticDemoRef}>
                  <div className="slide-preview">
                    <div className="preview-header">
                      <div className="preview-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    <div className="preview-content feature-practice">
                      <div className="feature-nav">
                        <div className="feature-logo">Launch Prep</div>
                        <div className="feature-nav-items">
                          <span className="nav-item">Dashboard</span>
                          <span className="nav-item active">Tests</span>
                          <span className="nav-item">Lessons</span>
                        </div>
                        <div className="feature-user">SC</div>
                      </div>

                      <div className="feature-main" style={{position: 'relative', overflow: 'hidden'}}>
                        <>
                        {!showDiagnosticTest && (
                        <div className={`diagnostic-intro ${diagnosticFadeOut ? 'fade-out' : ''}`}>
                          <div className="diagnostic-header-bar">
                            <div className="diagnostic-icon-badge">🎯</div>
                            <div className="diagnostic-title-section">
                              <h1 className="feature-heading">Full Diagnostic Assessment</h1>
                              <p className="diagnostic-subtitle">Complete ACT simulation • Adaptive difficulty • Instant analysis</p>
                            </div>
                          </div>
                          <p className="diagnostic-description">This comprehensive evaluation identifies your exact performance level across all ACT sections and generates your personalized study plan.</p>

                          <div className="diagnostic-stats-grid">
                            <div className="diagnostic-stat">
                              <div className="stat-icon">📝</div>
                              <div className="stat-content">
                                <div className="stat-number">215</div>
                                <div className="stat-text">Questions</div>
                              </div>
                            </div>
                            <div className="diagnostic-stat">
                              <div className="stat-icon">⏱️</div>
                              <div className="stat-content">
                                <div className="stat-number">2h 55m</div>
                                <div className="stat-text">Duration</div>
                              </div>
                            </div>
                            <div className="diagnostic-stat">
                              <div className="stat-icon">📊</div>
                              <div className="stat-content">
                                <div className="stat-number">4</div>
                                <div className="stat-text">Sections</div>
                              </div>
                            </div>
                            <div className="diagnostic-stat">
                              <div className="stat-icon">🎓</div>
                              <div className="stat-content">
                                <div className="stat-number">Real</div>
                                <div className="stat-text">ACT Format</div>
                              </div>
                            </div>
                          </div>

                          <div className="diagnostic-sections-detailed">
                            <div className="section-detail-item">
                              <div className="section-header-row">
                                <span className="section-dot english-dot"></span>
                                <span className="section-name">English</span>
                                <span className="section-duration">45 min</span>
                              </div>
                              <div className="section-description">75 questions • Grammar, usage, punctuation, and rhetoric</div>
                            </div>
                            <div className="section-detail-item">
                              <div className="section-header-row">
                                <span className="section-dot math-dot"></span>
                                <span className="section-name">Mathematics</span>
                                <span className="section-duration">60 min</span>
                              </div>
                              <div className="section-description">60 questions • Algebra, geometry, and trigonometry</div>
                            </div>
                            <div className="section-detail-item">
                              <div className="section-header-row">
                                <span className="section-dot reading-dot"></span>
                                <span className="section-name">Reading</span>
                                <span className="section-duration">35 min</span>
                              </div>
                              <div className="section-description">40 questions • Literary narrative, humanities, and science passages</div>
                            </div>
                            <div className="section-detail-item">
                              <div className="section-header-row">
                                <span className="section-dot science-dot"></span>
                                <span className="section-name">Science</span>
                                <span className="section-duration">35 min</span>
                              </div>
                              <div className="section-description">40 questions • Data interpretation and scientific reasoning</div>
                            </div>
                          </div>

                          <button className="start-test-btn-large">Begin Assessment →</button>
                        </div>
                        )}

                        {showDiagnosticTest && (
                          <div className="test-interface">
                            <div className="test-header">
                              <div className="test-section-badge">English • Section 1</div>
                              <div className="test-progress-info">
                                <span className="question-counter">Question {diagnosticQuestion} of 75</span>
                                <div className="progress-bar-mini">
                                  <div className="progress-fill-mini" style={{width: `${(diagnosticProgress / 75) * 100}%`}}></div>
                                </div>
                              </div>
                              <div className="test-timer">42:18</div>
                            </div>

                            <div className="test-question-area">
                              <div className="passage-text">
                                <p className="passage-line">The history of the American West is filled with stories of pioneers {diagnosticQuestion === 1 && <span className="underlined-text">who's</span>}{diagnosticQuestion === 2 && <span className="underlined-text">courage and determination</span>}{diagnosticQuestion === 3 && <span className="underlined-text">has shaped</span>} legacy continues to inspire us today.</p>
                              </div>

                              <div className="question-prompt">
                                {diagnosticQuestion === 1 && "Which choice best maintains the grammatical pattern of the sentence?"}
                                {diagnosticQuestion === 2 && "Which transition word best connects this idea to the previous sentence?"}
                                {diagnosticQuestion === 3 && "Which verb form agrees with the subject of this sentence?"}
                              </div>

                              <div className="answer-choices">
                                <div className={`answer-choice ${selectedAnswer === 'A' ? 'selected' : ''}`}>
                                  <span className="choice-letter">A</span>
                                  <span className="choice-text">NO CHANGE</span>
                                </div>
                                <div className={`answer-choice ${selectedAnswer === 'B' ? 'selected' : ''}`}>
                                  <span className="choice-letter">B</span>
                                  <span className="choice-text">{diagnosticQuestion === 1 ? "whose" : diagnosticQuestion === 2 ? "However," : "have shaped"}</span>
                                </div>
                                <div className={`answer-choice ${selectedAnswer === 'C' ? 'selected' : ''}`}>
                                  <span className="choice-letter">C</span>
                                  <span className="choice-text">{diagnosticQuestion === 1 ? "whom" : diagnosticQuestion === 2 ? "Therefore," : "had shaped"}</span>
                                </div>
                                <div className={`answer-choice ${selectedAnswer === 'D' ? 'selected' : ''}`}>
                                  <span className="choice-letter">D</span>
                                  <span className="choice-text">{diagnosticQuestion === 1 ? "which" : diagnosticQuestion === 2 ? "Moreover," : "will shape"}</span>
                                </div>
                              </div>

                              <div className="test-nav-buttons">
                                <button className="test-nav-btn secondary">← Previous</button>
                                <button className="test-nav-btn primary">Next →</button>
                              </div>
                            </div>
                          </div>
                        )}
                        </>
                      </div>
                    </div>
                  </div>
                  <div className="slide-info">
                    <h3 className="slide-title">Diagnostic Assessment</h3>
                    <p className="slide-description">Comprehensive evaluation that identifies your exact strengths and knowledge gaps. Our diagnostic creates your personalized learning path from day one.</p>
                  </div>
                </div>

              {/* Feature 3: Full-Length Practice Tests - LEFT */}
              <div className="feature-row feature-left" ref={testDemoRef}>
                  <div className="slide-preview">
                    <div className="preview-header">
                      <div className="preview-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    <div className="preview-content feature-practice">
                      <div className="feature-nav">
                        <div className="feature-logo">Launch Prep</div>
                        <div className="feature-nav-items">
                          <span className="nav-item">Dashboard</span>
                          <span className="nav-item active">Tests</span>
                          <span className="nav-item">Lessons</span>
                        </div>
                        <div className="feature-user">SC</div>
                      </div>

                      <div className="feature-main">
                        <div className="tests-header-section">
                          <h1 className="feature-heading">Practice Tests</h1>
                          <div className="test-progress-summary">
                            <div className="progress-metric">
                              <div className="metric-value-large">3/7</div>
                              <div className="metric-label-small">Tests Completed</div>
                            </div>
                            <div className="progress-metric">
                              <div className="metric-value-large">+6</div>
                              <div className="metric-label-small">Point Improvement</div>
                            </div>
                            <div className="progress-metric">
                              <div className="metric-value-large">86%</div>
                              <div className="metric-label-small">Avg Accuracy</div>
                            </div>
                          </div>
                        </div>

                        <div className="test-history-clean">
                          <div className="test-history-header">
                            <span className="history-title">Test History</span>
                            <button className="start-test-btn">+ New Test</button>
                          </div>

                          <div className="test-list-clean">
                            <div className={`test-item-clean ${testHighlight === 1 ? 'highlighted' : ''}`}>
                              <div className="test-item-left">
                                <div className="test-number">Test #3</div>
                                <div className="test-date-small">Yesterday • 2h 51m</div>
                              </div>
                              <div className="test-item-center">
                                <div className="section-scores-mini">
                                  <span className="mini-score english">34</span>
                                  <span className="mini-score math">31</span>
                                  <span className="mini-score reading">33</span>
                                  <span className="mini-score science">30</span>
                                </div>
                              </div>
                              <div className="test-item-right">
                                <div className="test-score-large">32</div>
                                <div className="score-change positive">+3</div>
                              </div>
                              <button className="review-btn-small">Review</button>
                            </div>

                            <div className={`test-item-clean ${testHighlight === 2 ? 'highlighted' : ''}`}>
                              <div className="test-item-left">
                                <div className="test-number">Test #2</div>
                                <div className="test-date-small">1 week ago • 2h 48m</div>
                              </div>
                              <div className="test-item-center">
                                <div className="section-scores-mini">
                                  <span className="mini-score english">32</span>
                                  <span className="mini-score math">28</span>
                                  <span className="mini-score reading">30</span>
                                  <span className="mini-score science">27</span>
                                </div>
                              </div>
                              <div className="test-item-right">
                                <div className="test-score-large">29</div>
                                <div className="score-change positive">+3</div>
                              </div>
                              <button className="review-btn-small">Review</button>
                            </div>

                            <div className={`test-item-clean ${testHighlight === 3 ? 'highlighted' : ''}`}>
                              <div className="test-item-left">
                                <div className="test-number">Test #1 (Diagnostic)</div>
                                <div className="test-date-small">2 weeks ago • 2h 55m</div>
                              </div>
                              <div className="test-item-center">
                                <div className="section-scores-mini">
                                  <span className="mini-score english">30</span>
                                  <span className="mini-score math">24</span>
                                  <span className="mini-score reading">28</span>
                                  <span className="mini-score science">23</span>
                                </div>
                              </div>
                              <div className="test-item-right">
                                <div className="test-score-large">26</div>
                                <div className="score-change baseline">Baseline</div>
                              </div>
                              <button className="review-btn-small">Review</button>
                            </div>
                          </div>
                        </div>

                        <div className="next-test-info-card">
                          <div className="next-test-header">
                            <span className="next-test-icon">📝</span>
                            <div>
                              <div className="next-test-title">Ready for Test #4?</div>
                              <div className="next-test-subtitle">4 practice tests remaining • Recommended: Complete by Mar 15</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="slide-info">
                    <h3 className="slide-title">7 Full-Length Practice Tests</h3>
                    <p className="slide-description">Complete ACT simulations with real timing and difficulty. Track score progression and practice individual sections to build test-day confidence.</p>
                  </div>
                </div>

              {/* Feature 4: Performance Analytics - RIGHT */}
              <div className="feature-row feature-right" ref={analyticsDemoRef}>
                  <div className="slide-preview">
                    <div className="preview-header">
                      <div className="preview-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    <div className="preview-content feature-analytics">
                      <div className="feature-nav">
                        <div className="feature-logo">Launch Prep</div>
                        <div className="feature-nav-items">
                          <span className="nav-item active">Dashboard</span>
                          <span className="nav-item">Tests</span>
                          <span className="nav-item">Lessons</span>
                        </div>
                        <div className="feature-user">SC</div>
                      </div>

                      <div className="feature-main">
                        <h1 className="feature-heading">Performance Dashboard</h1>

                        <div className="analytics-summary-cards">
                          <div className={`summary-card primary ${analyticsHighlight === 1 ? 'highlighted' : ''}`}>
                            <div className="summary-label">Current Score</div>
                            <div className="summary-value-huge">32</div>
                            <div className="summary-change positive">+6 from baseline</div>
                          </div>
                          <div className={`summary-card ${analyticsHighlight === 2 ? 'highlighted' : ''}`}>
                            <div className="summary-label">Target Score</div>
                            <div className="summary-value-huge">36</div>
                            <div className="summary-change">4 points to go</div>
                          </div>
                          <div className={`summary-card ${analyticsHighlight === 3 ? 'highlighted' : ''}`}>
                            <div className="summary-label">Study Streak</div>
                            <div className="summary-value-huge">12</div>
                            <div className="summary-change">days</div>
                          </div>
                        </div>

                        <div className={`score-progression-card ${analyticsHighlight === 4 ? 'highlighted' : ''}`}>
                          <div className="progression-header">
                            <span className="progression-title">Score Progression</span>
                            <div className="progression-controls">
                              <span className="progression-trend">↑ +6 points</span>
                              <select className="time-range-select">
                                <option>All time</option>
                              </select>
                            </div>
                          </div>
                          <div className="progression-bars-simple">
                            <div className="progression-bar-item">
                              <div className="bar-value">26</div>
                              <div className="bar-visual" style={{height: '50%'}}></div>
                              <div className="bar-label-bottom">Test 1</div>
                              <div className="bar-date">Feb 10</div>
                            </div>
                            <div className="progression-bar-item">
                              <div className="bar-value">29</div>
                              <div className="bar-visual" style={{height: '62%'}}></div>
                              <div className="bar-label-bottom">Test 2</div>
                              <div className="bar-date">Feb 17</div>
                            </div>
                            <div className="progression-bar-item active">
                              <div className="bar-value">32</div>
                              <div className="bar-visual" style={{height: '75%'}}></div>
                              <div className="bar-label-bottom">Test 3</div>
                              <div className="bar-date">Feb 24</div>
                            </div>
                            <div className="progression-bar-item projected">
                              <div className="bar-value">35</div>
                              <div className="bar-visual projected-bar" style={{height: '90%'}}></div>
                              <div className="bar-label-bottom">Projected</div>
                              <div className="bar-date">Mar 10</div>
                            </div>
                          </div>
                        </div>

                        <div className="section-breakdown-card">
                          <div className="breakdown-header">Section Performance</div>
                          <div className="section-breakdown-list">
                            <div className="breakdown-item">
                              <span className="section-indicator english"></span>
                              <span className="section-name-small">English</span>
                              <div className="breakdown-bar">
                                <div className="breakdown-fill" style={{width: '94%'}}></div>
                              </div>
                              <span className="section-score-value">34</span>
                            </div>
                            <div className="breakdown-item">
                              <span className="section-indicator reading"></span>
                              <span className="section-name-small">Reading</span>
                              <div className="breakdown-bar">
                                <div className="breakdown-fill" style={{width: '92%'}}></div>
                              </div>
                              <span className="section-score-value">33</span>
                            </div>
                            <div className="breakdown-item">
                              <span className="section-indicator math"></span>
                              <span className="section-name-small">Math</span>
                              <div className="breakdown-bar">
                                <div className="breakdown-fill" style={{width: '86%'}}></div>
                              </div>
                              <span className="section-score-value">31</span>
                            </div>
                            <div className="breakdown-item">
                              <span className="section-indicator science"></span>
                              <span className="section-name-small">Science</span>
                              <div className="breakdown-bar">
                                <div className="breakdown-fill" style={{width: '83%'}}></div>
                              </div>
                              <span className="section-score-value">30</span>
                            </div>
                          </div>
                        </div>

                        <div className="insights-row">
                          <div className="insight-box strength">
                            <div className="insight-emoji">💪</div>
                            <div className="insight-content-box">
                              <div className="insight-title">Top Strength</div>
                              <div className="insight-value">English Grammar</div>
                              <div className="insight-stat">94% accuracy</div>
                            </div>
                          </div>
                          <div className="insight-box focus">
                            <div className="insight-emoji">🎯</div>
                            <div className="insight-content-box">
                              <div className="insight-title">Focus Area</div>
                              <div className="insight-value">Science Reasoning</div>
                              <div className="insight-stat">12 lessons assigned</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="slide-info">
                    <h3 className="slide-title">Performance Analytics</h3>
                    <p className="slide-description">Deep insights into your strengths and weaknesses. Visual progress tracking helps you understand exactly where to focus your study time.</p>
                  </div>
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
            <p className="modal-subtitle">🎉 <strong>Free for Life</strong> - Join now and never pay. No credit card, no payment, ever.</p>

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
                🎉 You're on the waitlist! You'll get <strong>free lifetime access</strong> when we launch - no payment ever required.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompleteLandingPage;