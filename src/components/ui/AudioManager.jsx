import { useEffect, useRef, useState } from 'react';

export default function AudioManager({ phase }) {
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(40);
  const [showVolume, setShowVolume] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio('/audio/sunflower.mp3');

    audio.loop = true;
    audio.volume = volume / 100;
    audio.preload = 'auto';

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && !muted) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume, muted]);

  const fadeAudio = (targetVolume, duration = 1000) => {
    const audio = audioRef.current;

    if (!audio) return;

    const startVolume = audio.volume;
    const change = targetVolume - startVolume;
    const start = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);

      audio.volume = startVolume + change * progress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        audio.volume = targetVolume;

        if (targetVolume === 0) {
          audio.pause();
        }
      }
    };

    requestAnimationFrame(animate);
  };

  const toggleMute = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (muted) {
      try {
        audio.volume = 0;
        await audio.play();
        fadeAudio(volume / 100, 800);
        setMuted(false);
      } catch (err) {
        console.error(err);
      }
    } else {
      fadeAudio(0, 600);
      setMuted(true);
    }
  };

  return (
    <div
      onMouseEnter={() => setShowVolume(true)}
      onMouseLeave={() => setShowVolume(false)}
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 1000,

        display: 'flex',
        alignItems: 'center',

        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(0,212,255,0.25)',
        borderRadius: '999px',

        padding: '10px 14px',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={toggleMute}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#00d4ff',
          fontSize: '20px',
          cursor: 'pointer',
          width: '32px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',

          width: showVolume ? '170px' : '0px',
          opacity: showVolume ? 1 : 0,

          marginLeft: showVolume ? '12px' : '0px',

          overflow: 'hidden',

          transition:
            'width 0.35s ease, opacity 0.25s ease, margin-left 0.35s ease',
        }}
      >
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => {
            const v = Number(e.target.value);
            setVolume(v);

            if (audioRef.current && !muted) {
              audioRef.current.volume = v / 100;
            }
          }}
          style={{
            width: '120px',
            accentColor: '#00d4ff',
            cursor: 'pointer',
          }}
        />

        <span
          style={{
            marginLeft: '10px',
            color: '#00d4ff',
            fontSize: '12px',
            fontWeight: 500,
            minWidth: '36px',
            userSelect: 'none',
          }}
        >
          {volume}%
        </span>
      </div>
    </div>
  );
}