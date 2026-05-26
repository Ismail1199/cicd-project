import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Droplets, 
  Scale, 
  Timer, 
  Zap, 
  Plus, 
  RotateCcw, 
  Check, 
  Play, 
  Pause,
  Award,
  Sparkles,
  Link,
  LogOut
} from 'lucide-react';
import { sounds } from './utils/SoundManager';
import Confetti from './components/Confetti';
import './App.css';

const XP_PER_LEVEL = 100;

export default function App() {
  // --- Authentication & Routing State ---
  const [view, setView] = useState(() => localStorage.getItem('fitsync_current_user') ? 'dashboard' : 'landing');
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('fitsync_current_user') || null);
  const [authTab, setAuthTab] = useState('signin'); // 'signin', 'signup'
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authAlert, setAuthAlert] = useState({ type: '', message: '' });
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  // --- Active Tab State ---
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'workouts', 'diet', 'tracker'

  // --- Workouts Sub-Tab States ---
  const [workoutSubTab, setWorkoutSubTab] = useState('gym'); // 'gym', 'regular', 'yoga', 'calisthenics'
  const [expandedInstruction, setExpandedInstruction] = useState(null);

  // --- Diet Meal Logger States ---
  const [meals, setMeals] = useState({ breakfast: [], lunch: [], dinner: [], snacks: [] });
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');
  const [selectedMealSection, setSelectedMealSection] = useState('breakfast');
  const [activeDietPlan, setActiveDietPlan] = useState('protein');

  // --- Weight History States ---
  const [weightHistory, setWeightHistory] = useState([]);
  const [weightInput, setWeightInput] = useState('');

  // --- XP & Leveling State ---
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  // --- Metrics States ---
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [water, setWater] = useState(0);
  const [calories, setCalories] = useState(0);
  
  // --- Workout Timer States ---
  const [workoutType, setWorkoutType] = useState('gym');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // --- Checklist State ---
  const [completedTasks, setCompletedTasks] = useState({});

  // --- Backend Connection State ---
  const [apiStatus, setApiStatus] = useState('offline');
  const [apiVisits, setApiVisits] = useState(0);

  // --- Temporary Calorie Input ---
  const [calorieInput, setCalorieInput] = useState('');

  // ----------------------------------------------------------------
  // Persistence & Synced Level System
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!currentUser) {
      setIsProfileLoaded(false);
      return;
    }
    
    const prefix = currentUser === 'guest' ? 'fitsync_guest_' : `fitsync_user_${currentUser}_`;
    
    setXp(parseInt(localStorage.getItem(`${prefix}xp`) || '0', 10));
    setLevel(parseInt(localStorage.getItem(`${prefix}level`) || '1', 10));
    setHeight(parseInt(localStorage.getItem(`${prefix}height`) || '175', 10));
    setWeight(parseInt(localStorage.getItem(`${prefix}weight`) || '70', 10));
    setWater(parseInt(localStorage.getItem(`${prefix}water`) || '0', 10));
    setCalories(parseInt(localStorage.getItem(`${prefix}calories`) || '0', 10));
    
    const savedTasks = localStorage.getItem(`${prefix}tasks`);
    setCompletedTasks(savedTasks ? JSON.parse(savedTasks) : {});

    const savedMeals = localStorage.getItem(`${prefix}meals`);
    setMeals(savedMeals ? JSON.parse(savedMeals) : { breakfast: [], lunch: [], dinner: [], snacks: [] });

    const savedDietPlan = localStorage.getItem(`${prefix}diet_plan`);
    setActiveDietPlan(savedDietPlan || 'protein');

    const savedWeightHistory = localStorage.getItem(`${prefix}weight_history`);
    setWeightHistory(savedWeightHistory ? JSON.parse(savedWeightHistory) : []);
    
    setIsProfileLoaded(true);
  }, [currentUser]);

  // Save changes to localStorage only after profile is loaded
  useEffect(() => {
    if (!isProfileLoaded || !currentUser) return;
    const prefix = currentUser === 'guest' ? 'fitsync_guest_' : `fitsync_user_${currentUser}_`;
    localStorage.setItem(`${prefix}xp`, xp);
    localStorage.setItem(`${prefix}level`, level);
  }, [xp, level, currentUser, isProfileLoaded]);

  useEffect(() => {
    if (!isProfileLoaded || !currentUser) return;
    const prefix = currentUser === 'guest' ? 'fitsync_guest_' : `fitsync_user_${currentUser}_`;
    localStorage.setItem(`${prefix}height`, height);
    localStorage.setItem(`${prefix}weight`, weight);
  }, [height, weight, currentUser, isProfileLoaded]);

  useEffect(() => {
    if (!isProfileLoaded || !currentUser) return;
    const prefix = currentUser === 'guest' ? 'fitsync_guest_' : `fitsync_user_${currentUser}_`;
    localStorage.setItem(`${prefix}water`, water);
  }, [water, currentUser, isProfileLoaded]);

  useEffect(() => {
    if (!isProfileLoaded || !currentUser) return;
    const prefix = currentUser === 'guest' ? 'fitsync_guest_' : `fitsync_user_${currentUser}_`;
    localStorage.setItem(`${prefix}calories`, calories);
  }, [calories, currentUser, isProfileLoaded]);

  useEffect(() => {
    if (!isProfileLoaded || !currentUser) return;
    const prefix = currentUser === 'guest' ? 'fitsync_guest_' : `fitsync_user_${currentUser}_`;
    localStorage.setItem(`${prefix}tasks`, JSON.stringify(completedTasks));
  }, [completedTasks, currentUser, isProfileLoaded]);

  useEffect(() => {
    if (!isProfileLoaded || !currentUser) return;
    const prefix = currentUser === 'guest' ? 'fitsync_guest_' : `fitsync_user_${currentUser}_`;
    localStorage.setItem(`${prefix}meals`, JSON.stringify(meals));
  }, [meals, currentUser, isProfileLoaded]);

  useEffect(() => {
    if (!isProfileLoaded || !currentUser) return;
    const prefix = currentUser === 'guest' ? 'fitsync_guest_' : `fitsync_user_${currentUser}_`;
    localStorage.setItem(`${prefix}diet_plan`, activeDietPlan);
  }, [activeDietPlan, currentUser, isProfileLoaded]);

  useEffect(() => {
    if (!isProfileLoaded || !currentUser) return;
    const prefix = currentUser === 'guest' ? 'fitsync_guest_' : `fitsync_user_${currentUser}_`;
    localStorage.setItem(`${prefix}weight_history`, JSON.stringify(weightHistory));
  }, [weightHistory, currentUser, isProfileLoaded]);

  // Function to grant XP and handle level up
  const gainXP = (amount) => {
    setXp((prevXp) => {
      let newXp = prevXp + amount;
      let newLevel = level;
      let leveledUp = false;

      while (newXp >= XP_PER_LEVEL) {
        newXp -= XP_PER_LEVEL;
        newLevel += 1;
        leveledUp = true;
      }

      if (leveledUp) {
        setLevel(newLevel);
        sounds.playLevelUp();
        setShowLevelUp(true);
        setConfettiTrigger(Date.now());
      }
      return newXp;
    });
  };

  // ----------------------------------------------------------------
  // Metric Calculators & Actions
  // ----------------------------------------------------------------
  const bmiValue = (weight / ((height / 100) ** 2)).toFixed(1);
  
  let bmiCategory = 'Normal Weight';
  let bmiColor = 'var(--accent-emerald)';
  if (bmiValue < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'var(--accent-violet)';
  } else if (bmiValue >= 25 && bmiValue < 30) {
    bmiCategory = 'Overweight';
    bmiColor = 'var(--accent-orange)';
  } else if (bmiValue >= 30) {
    bmiCategory = 'Obese';
    bmiColor = 'var(--accent-rose)';
  }

  const addWater = (amount) => {
    sounds.playBubble();
    setWater((prev) => Math.min(6000, prev + amount));
    gainXP(Math.round(amount / 25)); // e.g., 250ml = 10XP
  };

  const resetWater = () => {
    sounds.playReset();
    setWater(0);
  };

  const addCalories = (e) => {
    e.preventDefault();
    const kcal = parseInt(calorieInput, 10);
    if (!isNaN(kcal) && kcal > 0) {
      sounds.playChime();
      setCalories((prev) => prev + kcal);
      gainXP(15);
      setCalorieInput('');
      setConfettiTrigger(Date.now());
    }
  };

  const resetCalories = () => {
    if (window.confirm('Reset logged calories?')) {
      sounds.playReset();
      setCalories(0);
    }
  };

  // ----------------------------------------------------------------
  // Workout Timer Control
  // ----------------------------------------------------------------
  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const startTimer = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
      sounds.playChime();
    }
  };

  const pauseTimer = () => {
    if (isTimerRunning) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsTimerRunning(false);
      sounds.playChime();
    }
  };

  const resetTimer = () => {
    pauseTimer();
    setSecondsElapsed(0);
    sounds.playReset();
  };

  // Give active workout XP when user hits milestones
  useEffect(() => {
    if (secondsElapsed > 0 && secondsElapsed % 60 === 0) {
      gainXP(20); // 20 XP per minute of working out
      setConfettiTrigger(Date.now());
    }
  }, [secondsElapsed]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ----------------------------------------------------------------
  // Checklist Toggle
  // ----------------------------------------------------------------
  const toggleTask = (taskId, xpAmount = 30) => {
    const isCompleted = !completedTasks[taskId];
    setCompletedTasks((prev) => ({ ...prev, [taskId]: isCompleted }));

    if (isCompleted) {
      sounds.playChime();
      gainXP(xpAmount);
      setConfettiTrigger(Date.now());
    } else {
      sounds.playReset();
      setXp((prev) => Math.max(0, prev - xpAmount));
    }
  };

  // ----------------------------------------------------------------
  // Live Backend status polling
  // ----------------------------------------------------------------
  const checkBackend = async () => {
    const urls = [
      'http://localhost:8080/api/status',
      '/api/status'
    ];

    for (const url of urls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(url, { 
          method: 'GET',
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          setApiStatus('online');
          setApiVisits(data.visits || 0);
          return;
        }
      } catch (err) {
        // Try next
      }
    }
    setApiStatus('offline');
  };

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  // ----------------------------------------------------------------
  // Authentication Actions
  // ----------------------------------------------------------------
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const username = usernameInput.trim();
    const password = passwordInput.trim();

    if (!username || !password) {
      setAuthAlert({ type: 'error', message: 'All fields are required.' });
      sounds.playReset();
      return;
    }

    const savedUsersRaw = localStorage.getItem('fitsync_users');
    const users = savedUsersRaw ? JSON.parse(savedUsersRaw) : {};

    if (authTab === 'signin') {
      if (users[username] && users[username] === password) {
        sounds.playChime();
        setCurrentUser(username);
        localStorage.setItem('fitsync_current_user', username);
        setAuthAlert({ type: 'success', message: 'Logged in successfully! Redirecting...' });
        setTimeout(() => {
          setView('dashboard');
          setAuthAlert({ type: '', message: '' });
          setUsernameInput('');
          setPasswordInput('');
        }, 1000);
      } else {
        sounds.playReset();
        setAuthAlert({ type: 'error', message: 'Invalid username or password.' });
      }
    } else {
      if (users[username]) {
        sounds.playReset();
        setAuthAlert({ type: 'error', message: 'Username is already taken.' });
      } else {
        users[username] = password;
        localStorage.setItem('fitsync_users', JSON.stringify(users));
        sounds.playLevelUp();
        setAuthAlert({ type: 'success', message: 'Account created! Please sign in.' });
        setTimeout(() => {
          setAuthTab('signin');
          setAuthAlert({ type: '', message: '' });
          setPasswordInput('');
        }, 1500);
      }
    }
  };

  const handleContinueAsGuest = () => {
    sounds.playChime();
    setCurrentUser('guest');
    localStorage.setItem('fitsync_current_user', 'guest');
    setView('dashboard');
    setUsernameInput('');
    setPasswordInput('');
    setAuthAlert({ type: '', message: '' });
  };

  const handleSignOut = () => {
    sounds.playReset();
    localStorage.removeItem('fitsync_current_user');
    setCurrentUser(null);
    setView('landing');
    setActiveTab('home');
  };

  // ----------------------------------------------------------------
  // Diet Meal Logger Handlers
  // ----------------------------------------------------------------
  const addMealItem = (e) => {
    e.preventDefault();
    const name = foodName.trim();
    const kcal = parseInt(foodCalories, 10);

    if (!name || isNaN(kcal) || kcal <= 0) {
      sounds.playReset();
      return;
    }

    sounds.playChime();
    const newItem = { id: Date.now(), name, calories: kcal };
    setMeals((prev) => ({
      ...prev,
      [selectedMealSection]: [...prev[selectedMealSection], newItem]
    }));
    
    // Automatically add calories to total calories tracker and gain 10 XP
    setCalories((prev) => prev + kcal);
    gainXP(10);

    setFoodName('');
    setFoodCalories('');
  };

  const removeMealItem = (section, itemId, itemCalories) => {
    sounds.playReset();
    setMeals((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== itemId)
    }));

    // Automatically subtract calories from total calories tracker
    setCalories((prev) => Math.max(0, prev - itemCalories));
  };

  // ----------------------------------------------------------------
  // Tracker Weight Logger Handlers
  // ----------------------------------------------------------------
  const addWeightEntry = (e) => {
    e.preventDefault();
    const val = parseFloat(weightInput);
    if (isNaN(val) || val <= 0) {
      sounds.playReset();
      return;
    }

    sounds.playChime();
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      value: val
    };

    setWeightHistory((prev) => [newEntry, ...prev]);
    setWeight(val);
    setWeightInput('');
    gainXP(15);
  };

  const removeWeightEntry = (id) => {
    sounds.playReset();
    setWeightHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // ----------------------------------------------------------------
  // Exercises Checklists
  // ----------------------------------------------------------------
  const checklists = {
    gym: [
      { id: 'gym1', label: 'Bench Press (4 sets x 8 reps)' },
      { id: 'gym2', label: 'Weighted Squats (4 sets x 10 reps)' },
      { id: 'gym3', label: 'Barbell Deadlifts (3 sets x 5 reps)' }
    ],
    regular: [
      { id: 'reg1', label: 'Outdoor Running (30 mins)' },
      { id: 'reg2', label: 'Cycling HIIT (3 sets)' },
      { id: 'reg3', label: 'Jump Rope (3 mins)' }
    ],
    yoga: [
      { id: 'yoga1', label: 'Sun Salutation A (5 Flows)' },
      { id: 'yoga2', label: 'Warrior II Hold (60s each)' },
      { id: 'yoga3', label: 'Child\'s Pose Breathing (3 mins)' }
    ],
    calisthenics: [
      { id: 'cal1', label: 'Pull-ups (4 sets x 8 reps)' },
      { id: 'cal2', label: 'Chest Dips (3 sets x 10 reps)' },
      { id: 'cal3', label: 'Push-ups (4 sets x 15 reps)' }
    ]
  };

  // ----------------------------------------------------------------
  // Workouts Catalog
  // ----------------------------------------------------------------
  const workoutCatalog = {
    gym: [
      { id: 'gym1', title: 'Bench Press', target: 'Chest & Triceps', xp: 15, reps: '4 sets x 8 reps', desc: 'A classic barbell exercise targeting upper body pressing strength.', instructions: 'Lay flat on bench, grip bar slightly wider than shoulder-width, lower barbell to chest, and press up extension.' },
      { id: 'gym2', title: 'Weighted Squats', target: 'Quads & Glutes', xp: 20, reps: '4 sets x 10 reps', desc: 'The king of lower body movements, building power and leg drive.', instructions: 'Place bar on upper back, feet shoulder-width, squat down until hip crease is below knees, drive up.' },
      { id: 'gym3', title: 'Barbell Deadlifts', target: 'Posterior Chain', xp: 20, reps: '3 sets x 5 reps', desc: 'Full-body compound movement emphasizing lower back and hamstrings.', instructions: 'Feet hip-width, grip bar outside legs, hinge at hips, pull bar to lockout keeping back straight.' },
      { id: 'gym4', title: 'Overhead Press', target: 'Deltoids & Core', xp: 15, reps: '4 sets x 8 reps', desc: 'Strict press building solid shoulders and core stability.', instructions: 'Stand tall, hold bar at collarbone, press barbell straight overhead, lock out elbows.' },
      { id: 'gym5', title: 'Bicep Curls', target: 'Biceps & Forearms', xp: 10, reps: '3 sets x 12 reps', desc: 'Isolation movements to build biceps size and arm pulling.', instructions: 'Keep elbows at sides, curl barbell towards shoulders, contract bicep, lower slowly.' }
    ],
    regular: [
      { id: 'reg1', title: 'Outdoor Running', target: 'Cardio Endurance', xp: 25, reps: '30 mins continuous', desc: 'Moderate pace road or trail run to burn calories and boost lungs.', instructions: 'Maintain an even rhythm, strike with mid-foot, stand tall, and accelerate last 5 minutes.' },
      { id: 'reg2', title: 'Cycling HIIT', target: 'VO2 Max & Quads', xp: 15, reps: '5 mins intervals', desc: 'High-intensity cycling intervals that maximize fat-burn metabolism.', instructions: 'Pedal at maximum sprint resistance for 30s, recover at light pace for 90s. Repeat 5 times.' },
      { id: 'reg3', title: 'Jump Rope', target: 'Speed & Agility', xp: 15, reps: '3 mins rounds', desc: 'Quick footwork building cardiovascular conditioning and calves.', instructions: 'Keep bounces low, rotate rope with wrists, bend knees slightly, and jump on balls of feet.' },
      { id: 'reg4', title: 'Swimming Laps', target: 'Full Body Endurance', xp: 30, reps: '20 mins laps', desc: 'Zero-impact water cardiovascular training targeting all major muscles.', instructions: 'Perform alternating freestyle and breaststroke laps with steady and deep breathing.' }
    ],
    yoga: [
      { id: 'yoga1', title: 'Sun Salutation A', target: 'Spinal Mobility', xp: 15, reps: '5 full flows', desc: 'Vinyasa flow routine to warm up joints and sync breath with movement.', instructions: 'Flow from Mountain Pose to Forward Fold, Plank, Chatarunga, Cobra, Downward Dog, and rise.' },
      { id: 'yoga2', title: 'Warrior II Hold', target: 'Balance & Hip Opener', xp: 10, reps: '60s each side', desc: 'Standing posture building lower body stamina and focus.', instructions: 'Step feet wide, lunge front knee to 90 degrees, stretch arms horizontally, look past front hand.' },
      { id: 'yoga3', title: 'Downward Dog Active', target: 'Hamstrings & Back', xp: 10, reps: '60s hold', desc: 'Rejuvenating inversion pose stretching the back and shoulders.', instructions: 'Press palms down, lift tailbone high, press chest towards knees, keep heels reaching down.' },
      { id: 'yoga4', title: 'Child\'s Pose Breathing', target: 'Stress Relief', xp: 10, reps: '3 mins active', desc: 'Restorative recovery pose to calm the central nervous system.', instructions: 'Kneel, sit back on heels, stretch arms forward, rest forehead on mat, and breathe deeply.' }
    ],
    calisthenics: [
      { id: 'cal1', title: 'Pull-ups', target: 'Lats & Grip Strength', xp: 20, reps: '4 sets x 8 reps', desc: 'Core bodyweight pulling movement targeting the back.', instructions: 'Hang fully extended, pull body upward until chest meets bar, chin over bar, lower with control.' },
      { id: 'cal2', title: 'Chest Dips', target: 'Triceps & Chest', xp: 15, reps: '3 sets x 10 reps', desc: 'Parallel bars pressing movement building pectoral definition.', instructions: 'Grip bars, lock elbows, lower body until shoulders are below elbows, push back up.' },
      { id: 'cal3', title: 'Push-ups', target: 'Pectorals & Core', xp: 10, reps: '4 sets x 15 reps', desc: 'Bodyweight plank press building chest and shoulder endurance.', instructions: 'Hands shoulder-width, lower chest to floor keeping body aligned, push back to lock.' },
      { id: 'cal4', title: 'Pistol Squats', target: 'Leg Balance & Power', xp: 25, reps: '3 sets x 5 each', desc: 'Advanced single-leg squat demanding strong balance and flexibility.', instructions: 'Lift one leg straight forward, squat deep on single standing leg, press up from heel.' }
    ]
  };

  // ----------------------------------------------------------------
  // Diet Templates List
  // ----------------------------------------------------------------
  const dietPlansList = [
    { id: 'protein', title: 'High Protein / Lean Muscle', desc: 'Designed for weightlifters and active trainers aiming for muscle hypertrophy and fast recovery.', macros: { protein: '40%', carbs: '30%', fats: '30%' } },
    { id: 'keto', title: 'Ketogenic / Fat Burn', desc: 'Very low carb, high fat diet designed to shift the body into ketosis for accelerated fat loss.', macros: { protein: '25%', carbs: '5%', fats: '70%' } },
    { id: 'balanced', title: 'Balanced / Mediterranean', desc: 'Moderate levels of clean carbs, proteins, and healthy fats for sustainable, long-term health.', macros: { protein: '25%', carbs: '45%', fats: '30%' } },
    { id: 'vegan', title: 'Plant-Based / Vegan', desc: '100% plant sources rich in complex carbohydrates and plant proteins for clean energy and recovery.', macros: { protein: '20%', carbs: '60%', fats: '20%' } }
  ];

  if (view === 'landing') {
    return (
      <div className="landing-viewport">
        {/* Landing Header */}
        <header className="landing-header">
          <span className="landing-logo" onClick={() => { sounds.playChime(); setView('landing'); }}>FitSync</span>
          <ul className="landing-nav-links">
            <li><span className="landing-nav-link" onClick={() => { sounds.playChime(); setView('auth'); }}>Home</span></li>
            <li><span className="landing-nav-link" onClick={() => { sounds.playChime(); setView('auth'); }}>Workouts</span></li>
            <li><span className="landing-nav-link" onClick={() => { sounds.playChime(); setView('auth'); }}>Diet</span></li>
            <li><span className="landing-nav-link" onClick={() => { sounds.playChime(); setView('auth'); }}>Tracker</span></li>
          </ul>
        </header>

        {/* Landing Hero */}
        <section className="landing-hero" id="home">
          <div className="landing-hero-bg"></div>
          <div className="landing-hero-overlay"></div>
          
          <div className="hero-content">
            <h1 className="hero-title">Track Fitness.<br />Build Discipline.</h1>
            <p className="hero-subtitle">
              Monitor workouts, calories, hydration and health progress through one modern dashboard.
            </p>
            <button 
              className="hero-btn"
              onClick={() => {
                sounds.playChime();
                setView('auth');
              }}
            >
              Get Started
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (view === 'auth') {
    return (
      <div className="auth-viewport">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome to FitSync</h2>
            <p>{authTab === 'signin' ? 'Sign in to access your stats' : 'Create an account to track your progress'}</p>
          </div>

          {authAlert.message && (
            <div className={`auth-alert ${authAlert.type}`}>
              {authAlert.message}
            </div>
          )}

          <div className="auth-tabs">
            <button 
              type="button"
              className={`auth-tab ${authTab === 'signin' ? 'active' : ''}`}
              onClick={() => { 
                sounds.playChime(); 
                setAuthTab('signin'); 
                setAuthAlert({ type: '', message: '' }); 
              }}
            >
              Sign In
            </button>
            <button 
              type="button"
              className={`auth-tab ${authTab === 'signup' ? 'active' : ''}`}
              onClick={() => { 
                sounds.playChime(); 
                setAuthTab('signup'); 
                setAuthAlert({ type: '', message: '' }); 
              }}
            >
              Sign Up
            </button>
          </div>

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            <div className="auth-input-group">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                required 
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>
            
            <div className="auth-input-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                required 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="auth-submit-btn">
              {authTab === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <button type="button" className="auth-guest-btn" onClick={handleContinueAsGuest}>
            Continue without logging in
          </button>

          <div className="auth-back-link" onClick={() => { sounds.playReset(); setView('landing'); }}>
            ← Back to home
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-viewport">
      {/* Dynamic Confetti */}
      <Confetti trigger={confettiTrigger} />

      {/* Navigation Header */}
      <nav className="nav-header">
        <div className="nav-brand">
          <h1 style={{ cursor: 'pointer' }} onClick={() => { sounds.playReset(); handleSignOut(); }}>FitSync</h1>
        </div>

        {/* Dashboard Nav Links */}
        <ul className="dashboard-nav-links">
          <li>
            <span 
              className={`dashboard-nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => { sounds.playChime(); setActiveTab('home'); }}
            >
              Home
            </span>
          </li>
          <li>
            <span 
              className={`dashboard-nav-link ${activeTab === 'workouts' ? 'active' : ''}`}
              onClick={() => { sounds.playChime(); setActiveTab('workouts'); }}
            >
              Workouts
            </span>
          </li>
          <li>
            <span 
              className={`dashboard-nav-link ${activeTab === 'diet' ? 'active' : ''}`}
              onClick={() => { sounds.playChime(); setActiveTab('diet'); }}
            >
              Diet
            </span>
          </li>
          <li>
            <span 
              className={`dashboard-nav-link ${activeTab === 'tracker' ? 'active' : ''}`}
              onClick={() => { sounds.playChime(); setActiveTab('tracker'); }}
            >
              Tracker
            </span>
          </li>
        </ul>

        {/* Gamified Level UI */}
        <div className="xp-level-badge" onClick={() => sounds.playChime()}>
          <Zap className="xp-icon" />
          <div className="xp-info">
            <div className="xp-numbers">
              <span className="level-lbl">LEVEL {level}</span>
              <span className="xp-lbl">{xp} / {XP_PER_LEVEL} XP</span>
            </div>
            <div className="xp-track-bg">
              <div 
                className="xp-track-fill" 
                style={{ width: `${(xp / XP_PER_LEVEL) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="nav-right-actions">
          {/* Dynamic API Status */}
          <div className={`api-pill ${apiStatus}`}>
            <span className="pill-dot"></span>
            <span className="pill-text">
              {apiStatus === 'online' ? `API Online (${apiVisits})` : 'API Offline'}
            </span>
          </div>

          {/* User Profile Info */}
          <div className="profile-container">
            <div className="profile-avatar">
              {currentUser ? currentUser.substring(0, 2).toUpperCase() : 'G'}
            </div>
            <span>{currentUser === 'guest' ? 'Guest' : currentUser}</span>
          </div>

          {/* Sign Out Button */}
          <button className="btn btn-outline btn-signout" onClick={handleSignOut}>
            <LogOut className="btn-icon" /> Sign Out
          </button>
        </div>
      </nav>

      <main className="dashboard-container">
        {activeTab === 'home' && (
          <>
            {/* Alive Header Welcome */}
            <header className="dashboard-welcome">
              <h2>Level Up Your Health</h2>
              <p>Tackle daily challenges, earn XP, and unlock fitness tiers.</p>
            </header>

        {/* Widgets Grid */}
        <section className="dashboard-grid">
          
          {/* Widget 1: BMI calculator */}
          <div className="card bmi-card">
            <div className="card-header">
              <h3>BMI Calculator</h3>
              <Scale className="icon-violet" />
            </div>
            <div className="bmi-content">
              <div className="slider-group">
                <label>Height: <span>{height}</span> cm</label>
                <input 
                  type="range" 
                  min="100" 
                  max="220" 
                  value={height} 
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  className="slider violet-slider"
                />
              </div>
              <div className="slider-group">
                <label>Weight: <span>{weight}</span> kg</label>
                <input 
                  type="range" 
                  min="30" 
                  max="150" 
                  value={weight} 
                  onChange={(e) => setWeight(parseInt(e.target.value))}
                  className="slider violet-slider"
                />
              </div>
              <div className="bmi-result-panel">
                <span className="bmi-val" style={{ color: bmiColor }}>{bmiValue}</span>
                <span className="bmi-lbl">{bmiCategory}</span>
              </div>
            </div>
          </div>

          {/* Widget 2: Hydration Wave Tracker */}
          <div className="card hydration-card">
            <div className="card-header">
              <h3>Hydration Tracker</h3>
              <Droplets className="icon-blue" />
            </div>
            <div className="hydration-content">
              <div className="liquid-tank">
                <div 
                  className="liquid-wave" 
                  style={{ height: `${Math.min(100, (water / 3000) * 100)}%` }}
                />
                <span className="liquid-level">{(water / 1000).toFixed(2)} / 3.0 L</span>
              </div>
              <div className="tank-controls">
                <button className="btn btn-secondary btn-sm" onClick={() => addWater(250)}>
                  <Plus className="btn-icon" /> 250ml
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => addWater(500)}>
                  <Plus className="btn-icon" /> 500ml
                </button>
                <button className="btn btn-outline btn-sm" onClick={resetWater}>
                  <RotateCcw className="btn-icon" /> Reset
                </button>
              </div>
            </div>
          </div>

          {/* Widget 3: Calorie Logger */}
          <div className="card calorie-card" onDoubleClick={resetCalories}>
            <div className="card-header">
              <h3>Calorie Tracker</h3>
              <Flame className="icon-emerald" />
            </div>
            <div className="calorie-content">
              <div className="calorie-ring-display">
                <span className="kcal-number">{calories} / 2200</span>
                <span className="kcal-lbl">logged kcal</span>
                <span className="kcal-hint">(double click to reset)</span>
              </div>
              <form className="calorie-log-form" onSubmit={addCalories}>
                <input 
                  type="number" 
                  placeholder="Kcal amount..." 
                  value={calorieInput}
                  onChange={(e) => setCalorieInput(e.target.value)}
                  min="1"
                  required
                />
                <button type="submit" className="btn btn-primary btn-sm">Log</button>
              </form>
              <div className="macro-breakdown">
                <div className="macro-item">
                  <div className="macro-info">
                    <span>Protein Achievement</span>
                    <span>{Math.round(Math.min(100, (calories / 2200) * 100))}%</span>
                  </div>
                  <div className="macro-bar-track">
                    <div 
                      className="macro-bar-fill protein" 
                      style={{ width: `${Math.min(100, (calories / 2200) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Widget 4: Workout Stopwatch */}
          <div className="card timer-card">
            <div className="card-header">
              <h3>Workout Timer</h3>
              <Timer className="icon-rose" />
            </div>
            <div className="timer-content">
              <div className="timer-routine-select">
                <label>Active Routine</label>
                <select 
                  value={workoutType}
                  onChange={(e) => {
                    sounds.playChime();
                    setWorkoutType(e.target.value);
                  }}
                >
                  <option value="strength">Strength Training</option>
                  <option value="cardio">Cardio HIIT</option>
                  <option value="flexibility">Flexibility & Yoga</option>
                </select>
              </div>
              <div className="timer-clock">{formatTime(secondsElapsed)}</div>
              <div className="timer-buttons">
                {isTimerRunning ? (
                  <button className="btn btn-secondary btn-sm" onClick={pauseTimer}>
                    <Pause className="btn-icon" /> Pause
                  </button>
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={startTimer}>
                    <Play className="btn-icon" /> Start
                  </button>
                )}
                <button className="btn btn-outline btn-sm" onClick={resetTimer}>
                  <RotateCcw className="btn-icon" /> Reset
                </button>
              </div>
            </div>
          </div>
        </section>

            {/* Dynamic Checklist Sections */}
            <section className="challenges-section">
              <h2>Daily Exercises</h2>
              <div className="plans-grid">
                {Object.keys(checklists).map((key) => {
                  const isActive = workoutType === key;
                  return (
                    <div 
                      key={key} 
                      className={`plan-card ${isActive ? 'active-challenge' : ''}`}
                      onClick={() => {
                        if (!isActive) {
                          sounds.playChime();
                          setWorkoutType(key);
                        }
                      }}
                    >
                      <div className="plan-card-header">
                        <h4>{key.toUpperCase()} ROUTINE</h4>
                        {isActive && <Sparkles className="spark-active" />}
                      </div>
                      <ul className="checklist">
                        {checklists[key].map((item) => {
                          const checked = !!completedTasks[item.id];
                          return (
                            <li key={item.id} className={checked ? 'checked-item' : ''}>
                              <div 
                                className={`custom-checkbox ${checked ? 'checked' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleTask(item.id);
                                }}
                              >
                                {checked && <Check className="check-icon" />}
                              </div>
                              <span onClick={(e) => {
                                e.stopPropagation();
                                toggleTask(item.id);
                              }}>
                                {item.label}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {activeTab === 'workouts' && (
          <div className="workouts-container">
            <header className="dashboard-welcome">
              <h2>Workout Programs</h2>
              <p>Explore specialized routines, view instructions, track reps, and earn high XP rewards.</p>
            </header>

            <div className="workout-sub-tabs">
              <button 
                type="button"
                className={`sub-tab ${workoutSubTab === 'gym' ? 'active' : ''}`}
                onClick={() => { sounds.playChime(); setWorkoutSubTab('gym'); }}
              >
                Gym Workouts
              </button>
              <button 
                type="button"
                className={`sub-tab ${workoutSubTab === 'regular' ? 'active' : ''}`}
                onClick={() => { sounds.playChime(); setWorkoutSubTab('regular'); }}
              >
                Regular Exercise
              </button>
              <button 
                type="button"
                className={`sub-tab ${workoutSubTab === 'yoga' ? 'active' : ''}`}
                onClick={() => { sounds.playChime(); setWorkoutSubTab('yoga'); }}
              >
                Yoga & Flexibility
              </button>
              <button 
                type="button"
                className={`sub-tab ${workoutSubTab === 'calisthenics' ? 'active' : ''}`}
                onClick={() => { sounds.playChime(); setWorkoutSubTab('calisthenics'); }}
              >
                Calisthenics
              </button>
            </div>

            <div className="workout-cards-grid">
              {workoutCatalog[workoutSubTab].map((ex) => {
                const checked = !!completedTasks[ex.id];
                const expanded = expandedInstruction === ex.id;
                return (
                  <div key={ex.id} className="workout-exercise-card">
                    <div className="exercise-header">
                      <span className="exercise-title">{ex.title}</span>
                      <span className="exercise-xp-badge">+{ex.xp} XP</span>
                    </div>

                    <p className="exercise-description">{ex.desc}</p>

                    <div className="exercise-details">
                      <div className="exercise-detail-item">
                        <span className="exercise-detail-label">Routine</span>
                        <span className="exercise-detail-value">{workoutSubTab.toUpperCase()}</span>
                      </div>
                      <div className="exercise-detail-item">
                        <span className="exercise-detail-label">Targets</span>
                        <span className="exercise-detail-value">{ex.target}</span>
                      </div>
                      <div className="exercise-detail-item">
                        <span className="exercise-detail-label">Goal</span>
                        <span className="exercise-detail-value">{ex.reps}</span>
                      </div>
                    </div>

                    {expanded && (
                      <div className="instructions-panel">
                        <strong>How to execute:</strong><br />
                        {ex.instructions}
                      </div>
                    )}

                    <div className="exercise-action-bar">
                      <button 
                        type="button"
                        className="exercise-instructions-btn"
                        onClick={() => {
                          sounds.playChime();
                          setExpandedInstruction(expanded ? null : ex.id);
                        }}
                      >
                        {expanded ? 'Hide Guide' : 'View Guide'}
                      </button>

                      <button 
                        type="button"
                        className={`btn btn-sm ${checked ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => toggleTask(ex.id, ex.xp)}
                      >
                        {checked ? 'Completed' : 'Check Off'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'diet' && (
          <div className="diet-container">
            <header className="dashboard-welcome">
              <h2>Diet & Nutrition</h2>
              <p>Log your meals to calculate net calorie consumption and customize your target diet plans.</p>
            </header>

            <div className="diet-layout-grid">
              <div className="meal-logger-card">
                <h3>Daily Meal Journal</h3>
                
                <div className="meal-sections-list">
                  {Object.keys(meals).map((section) => {
                    const sectionCalories = meals[section].reduce((sum, item) => sum + item.calories, 0);
                    return (
                      <div key={section} className="meal-section-box">
                        <div className="meal-section-header">
                          <span className="meal-section-title">{section.toUpperCase()}</span>
                          <span className="meal-section-calories">{sectionCalories} kcal</span>
                        </div>

                        {meals[section].length > 0 && (
                          <ul className="meal-items-list">
                            {meals[section].map((item) => (
                              <li key={item.id} className="meal-item-row">
                                <span>{item.name}</span>
                                <div>
                                  <span style={{ marginRight: '0.75rem', fontWeight: 700 }}>{item.calories} kcal</span>
                                  <button 
                                    type="button"
                                    className="meal-item-remove"
                                    onClick={() => removeMealItem(section, item.id, item.calories)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}

                        <form className="meal-add-form" onSubmit={(e) => {
                          setSelectedMealSection(section);
                          addMealItem(e);
                        }}>
                          <input 
                            type="text" 
                            placeholder="Add food..." 
                            required 
                            value={selectedMealSection === section ? foodName : ''}
                            onChange={(e) => {
                              setSelectedMealSection(section);
                              setFoodName(e.target.value);
                            }}
                          />
                          <input 
                            type="number" 
                            placeholder="kcal" 
                            required 
                            min="1"
                            value={selectedMealSection === section ? foodCalories : ''}
                            onChange={(e) => {
                              setSelectedMealSection(section);
                              setFoodCalories(e.target.value);
                            }}
                          />
                          <button type="submit" className="btn btn-sm btn-primary">Add</button>
                        </form>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="diet-plans-card">
                <h3>Recommended Diet Plans</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {dietPlansList.map((plan) => {
                    const isActive = activeDietPlan === plan.id;
                    return (
                      <div 
                        key={plan.id}
                        className={`diet-plan-item ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          sounds.playChime();
                          setActiveDietPlan(plan.id);
                        }}
                      >
                        <div className="diet-plan-title">{plan.title}</div>
                        <div className="diet-plan-desc">{plan.desc}</div>
                        <div className="diet-plan-macros">
                          <span className="macro-chart-pill protein">P: {plan.macros.protein}</span>
                          <span className="macro-chart-pill carbs">C: {plan.macros.carbs}</span>
                          <span className="macro-chart-pill fats">F: {plan.macros.fats}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tracker' && (
          <div className="tracker-container">
            <header className="dashboard-welcome">
              <h2>Progress Loggers</h2>
              <p>Track your weight changes over time and view unlocked fitness achievements.</p>
            </header>

            <div className="tracker-layout-grid">
              <div className="weight-logger-card">
                <h3>Weight Log Timeline</h3>
                
                <form className="weight-form" onSubmit={addWeightEntry}>
                  <input 
                    type="number" 
                    placeholder="Enter weight in kg (e.g. 72.5)" 
                    step="0.1" 
                    required 
                    min="10"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">Log Weight</button>
                </form>

                {weightHistory.length > 0 ? (
                  <div className="weight-timeline">
                    {weightHistory.map((entry) => (
                      <div key={entry.id} className="weight-log-item">
                        <span className="weight-log-date">{entry.date}</span>
                        <div>
                          <span className="weight-log-value">{entry.value} kg</span>
                          <button 
                            type="button"
                            className="weight-log-remove"
                            onClick={() => removeWeightEntry(entry.id)}
                            style={{ marginLeft: '1rem' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', margin: '1rem 0' }}>
                    No weight records logged yet. Enter your current weight above!
                  </p>
                )}
              </div>

              <div className="achievements-card">
                <h3>Fitness Badges & Achievements</h3>
                
                <div className="achievements-grid">
                  <div className={`badge-item ${level >= 3 ? 'unlocked' : ''}`}>
                    <Award className="badge-icon" />
                    <div className="badge-name">Bronze Medal</div>
                    <div className="badge-desc">Unlocked at Level 3</div>
                  </div>

                  <div className={`badge-item ${level >= 5 ? 'unlocked' : ''}`}>
                    <Award className="badge-icon" />
                    <div className="badge-name">Gold Medal</div>
                    <div className="badge-desc">Unlocked at Level 5</div>
                  </div>

                  <div className={`badge-item ${water >= 3000 ? 'unlocked' : ''}`}>
                    <Award className="badge-icon" />
                    <div className="badge-name">Water Champ</div>
                    <div className="badge-desc">Drink 3.0L Water</div>
                  </div>

                  <div className={`badge-item ${calories >= 2000 ? 'unlocked' : ''}`}>
                    <Award className="badge-icon" />
                    <div className="badge-name">Calorie King</div>
                    <div className="badge-desc">Log 2000+ kcal</div>
                  </div>

                  <div className={`badge-item ${Object.keys(completedTasks).length >= 5 ? 'unlocked' : ''}`}>
                    <Award className="badge-icon" />
                    <div className="badge-name">Routines Master</div>
                    <div className="badge-desc">Complete 5 Tasks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Level Up Achievement Modal */}
      {showLevelUp && (
        <div className="modal-overlay">
          <div className="level-up-modal">
            <Award className="level-badge" />
            <h2>LEVEL UP!</h2>
            <p className="sub">You reached Level {level}!</p>
            <p className="description">
              Your dedication is yielding outcomes. Keep logging goals and exercises to scale higher!
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => {
                sounds.playChime();
                setShowLevelUp(false);
              }}
            >
              Keep Crushing It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
