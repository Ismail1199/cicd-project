class SoundManager {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 1. Water Bubble Pop sound
  playBubble() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      // Fast rising frequency for bubble effect
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.warn("Web Audio failed to play sound:", e);
    }
  }

  // 2. Crisp Digital Chime sound
  playChime() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now); // A5 note
      osc.frequency.setValueAtTime(1200, now + 0.05); // High harmonic
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn("Web Audio failed to play sound:", e);
    }
  }

  // 3. Falling Reset sweep
  playReset() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.25);
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn("Web Audio failed to play sound:", e);
    }
  }

  // 4. Retro Level Up Fanfare arpeggio
  playLevelUp() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
      const duration = 0.08;
      
      notes.forEach((freq, index) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.07);
        
        gain.gain.setValueAtTime(0.08, now + index * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.07 + 0.2);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now + index * 0.07);
        osc.stop(now + index * 0.07 + 0.2);
      });
    } catch (e) {
      console.warn("Web Audio failed to play sound:", e);
    }
  }
}

export const sounds = new SoundManager();
