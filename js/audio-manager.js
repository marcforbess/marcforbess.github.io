/**
 * Global Audio Manager
 * Provides shared generated sound effects using the Web Audio API without needing external assets.
 */

let sharedAudioCtx = null;

function getSharedAudioContext() {
    if (!sharedAudioCtx) {
        sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (sharedAudioCtx.state === 'suspended') {
        sharedAudioCtx.resume();
    }
    return sharedAudioCtx;
}

window.playSharedAudio = function (type) {
    try {
        const ctx = getSharedAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;

        if (type === 'tap') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'craft') {
            // Shimmering craft sound
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'success' || type === 'phase-complete') {
            // Happy chord chime
            [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g);
                g.connect(ctx.destination);
                o.type = 'sine';
                o.frequency.setValueAtTime(f, now + i * 0.05);
                g.gain.setValueAtTime(0.1, now + i * 0.05);
                g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.3);
                o.start(now + i * 0.05);
                o.stop(now + i * 0.05 + 0.3);
            });
        } else if (type === 'drop') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'mash') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150 + Math.random() * 50, now);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'click') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'grand-success') {
            // Modern Orchestra Sweep "Ahhh" - Shortened to 2s
            const freqs = [261.63, 329.63, 392.00, 523.25, 659.25]; // Lush C Major 9th chord
            const masterGain = ctx.createGain();
            masterGain.connect(ctx.destination);

            // Grand swell and fade out (Total 2s)
            masterGain.gain.setValueAtTime(0, now);
            masterGain.gain.linearRampToValueAtTime(0.4, now + 0.5);
            masterGain.gain.setValueAtTime(0.4, now + 1.2);
            masterGain.gain.linearRampToValueAtTime(0, now + 2.0);

            freqs.forEach((f, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.type = i % 2 === 0 ? 'sine' : 'triangle';
                o.frequency.setValueAtTime(f * 0.98, now);
                o.frequency.setTargetAtTime(f, now + 0.3, 0.1);

                g.gain.value = i === 0 ? 0.35 : 0.15;
                o.connect(g);
                g.connect(masterGain);
                o.start(now);
                o.stop(now + 2.0);
            });
        } else if (type === 'shimmer') {
            const masterGain = ctx.createGain();
            masterGain.connect(ctx.destination);
            const duration = 2.5;
            const freqs = [220, 329.63, 440, 554.37, 659.25, 880];

            freqs.forEach((f, i) => {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, now);
                osc.frequency.exponentialRampToValueAtTime(f * 1.01, now + duration);
                g.gain.setValueAtTime(0, now);
                g.gain.linearRampToValueAtTime(0.08, now + 0.4 + (i * 0.1));
                g.gain.exponentialRampToValueAtTime(0.001, now + duration);
                osc.connect(g);
                g.connect(masterGain);
                osc.start(now);
                osc.stop(now + duration);
            });
        } else if (type === 'error') {
            // Low buzz for wrong code
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(110, now);
            osc.frequency.linearRampToValueAtTime(80, now + 0.3);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    } catch (e) {
        console.warn("Audio Context failed or unsupported", e);
    }
};
