import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Vector3, PlaneGeometry } from 'three';
import { easing } from 'maath';
import { Html, Sparkles } from '@react-three/drei';

const Wand = () => {
  const wandRef = useRef();
  const tipMatRef = useRef();
  const lightRef = useRef();
  const { viewport } = useThree();
  const targetPos = new Vector3();

  useFrame((state, delta) => {
    const hand = window.currentHand;
    const isMobile = window.innerWidth <= 768;
    
    if (hand && window.videoElement) {
        const vWidth = window.videoElement.videoWidth || 640;
        const vHeight = window.videoElement.videoHeight || 480;
        
        if (!hand.keypoints || hand.keypoints.length < 21) return;
        
        const wrist = hand.keypoints[0];
        const indexTip = hand.keypoints[8];
        
        if (wrist && indexTip) {
           const xRatio = indexTip.x / vWidth;
           const yRatio = indexTip.y / vHeight;

           // Amplify bounds by 1.4 so user doesn't have to reach off-camera to hit screen edges
           let targetX = (xRatio - 0.5) * 1.4 * viewport.width;
           let targetY = -(yRatio - 0.5) * 1.4 * viewport.height;
           
           if(isNaN(targetX)) targetX = 0;
           if(isNaN(targetY)) targetY = 0;

           // Keep Z=0 so targetX and targetY perfectly map to viewport boundaries!
           targetPos.set(targetX, targetY, 0);
           
           // Calculate velocity for natural trailing tilt
           const dxVel = targetX - wandRef.current.position.x;
           const dyVel = targetY - wandRef.current.position.y;
           
           easing.damp3(wandRef.current.position, targetPos, 0.15, delta);
           
           // Right-handed wand style: Base rotation points Upper-Left (+Math.PI / 5)
           // Add slight trailing physics based on hand velocity
           let targetRotZ = (Math.PI / 5) - (dxVel * 0.4) + (dyVel * 0.2);
           if(isNaN(targetRotZ)) targetRotZ = Math.PI / 5;
           
           easing.dampE(wandRef.current.rotation, [0, 0, targetRotZ], 0.2, delta);
        }
        
        // Grab Visual Feedback!
        if (tipMatRef.current && lightRef.current) {
            if (window.handGrabbedState) {
                easing.dampC(tipMatRef.current.emissive, "#4ba3e3", 0.1, delta); // magical patronus blue!
                easing.dampC(lightRef.current.color, "#4ba3e3", 0.1, delta);
            } else {
                easing.dampC(tipMatRef.current.emissive, "#FFD700", 0.15, delta); // standard gold
                easing.dampC(lightRef.current.color, "#FFD700", 0.15, delta);
            }
        }
        
    } else {
        // float gracefully in center when hand lost
        targetPos.set(0, Math.sin(state.clock.elapsedTime) * 0.5, 0);
        easing.damp3(wandRef.current.position, targetPos, 0.5, delta);
        easing.dampE(wandRef.current.rotation, [0, 0, Math.sin(state.clock.elapsedTime * 0.5) * 0.2], 0.5, delta);
    }
  });

  return (
    <group ref={wandRef}>
      {/* Wooden handle */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.03, 0.045, 1.6, 16]} />
        <meshStandardMaterial color="#3b2314" roughness={0.9} />
      </mesh>
      {/* Gold Rim */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.1, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Magic Tip */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial ref={tipMatRef} color="#FFF" emissive="#FFD700" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.2, 0]} color="#FFD700" intensity={4} distance={6} />
      {/* Mystical Sparkles */}
      <Sparkles count={150} scale={2.5} size={2.5} speed={0.4} opacity={0.8} color="#FFD700" position={[0, -0.2, 0]} />
      <Sparkles count={50} scale={1.5} size={4} speed={0.6} opacity={1} color="#FFF" position={[0, 0.1, 0]} />
    </group>
  );
};

// Milestone DOM component synced with Leaflet styles
const PhotoCard = ({ milestone, opacity }) => {
    if (!milestone) return null;
    const imageUrl = milestone.image.includes('~') ? milestone.image : `${milestone.image}~rt_auto-rs_768.h`;
    
    return (
        <div className="popup-card" style={{ 
            width: '320px', 
            opacity: opacity,
            transform: 'translate3d(0,0,0)', // enforce hardware accel
            pointerEvents: 'none', 
            background: 'rgba(11, 26, 45, 0.85)', // Dark Night Sky base
            border: '1px solid #FFD700',
            color: '#e6e6e6',
            backdropFilter: 'blur(8px)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(255,215,0,0.15)'
        }}>
            <div className="popup-header" style={{ padding: '10px', borderBottom: '1px solid #FFD700' }}>
                <h2 style={{ fontSize: '1.1rem', margin: '0 0 5px 0', color: '#FFD700' }}>{milestone.title}</h2>
                <div className="date" style={{ fontSize: '0.85rem' }}>{milestone.date}</div>
            </div>
            <div className="popup-image-container" style={{ margin: '0 10px', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={imageUrl} alt={milestone.title} className="popup-image" style={{ width: '100%', height: 'auto' }} />
                <img src={window.headshotJunchi} alt="Junchi" className="headshot headshot-left" />
                <img src={window.headshotEugene} alt="Eugene" className="headshot headshot-right" />
            </div>
            <div className="popup-description" style={{ padding: '10px', maxHeight: '80px', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.85rem' }}>
                {milestone.description}
            </div>
        </div>
    );
};

// Photos stream floating behind wand like ribbons in water
const PhotoStream = () => {
    const arr = new Array(4).fill(0); // reduce to 4 for performance and aesthetics
    const refs = useRef(arr.map(() => React.createRef()));
    const { viewport } = useThree();
    
    // Poll the vanilla JS map state to keep our 3D UI in sync
    const [globalIndex, setGlobalIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            if (window.currentMilestoneIndex !== undefined && window.currentMilestoneIndex !== globalIndex) {
                setGlobalIndex(window.currentMilestoneIndex);
            }
        }, 150);
        return () => clearInterval(interval);
    }, [globalIndex]);
    
    useFrame((state, delta) => {
        if (!window.currentHand) {
            // Photos scatter slowly if hand lost
             refs.current.forEach((ref, index) => {
                if(!ref.current) return;
                ref.current.position.y += Math.sin(state.clock.elapsedTime + index) * 0.01;
             });
            return;
        }
        
        let leaderX = 0, leaderY = 0;
        const vWidth = window.videoElement?.videoWidth || 640;
        const vHeight = window.videoElement?.videoHeight || 480;
        
        if (window.currentHand.keypoints && window.currentHand.keypoints.length >= 21) {
            const indexTip = window.currentHand.keypoints[8];
            if (indexTip) {
                const xRatio = indexTip.x/vWidth;
                const yRatio = indexTip.y/vHeight;
                // If touching, use 1:1 ratio. If webcam, use 1.4x accelerator
                const multiplier = window.touchActive ? 1.0 : 1.4;
                leaderX = (xRatio - 0.5) * multiplier * viewport.width;
                leaderY = -(yRatio - 0.5) * multiplier * viewport.height;
                if(isNaN(leaderX)) leaderX = 0;
                if(isNaN(leaderY)) leaderY = 0;
            }
        }
        
        refs.current.forEach((ref, index) => {
            if (!ref.current) return;
            // Add a small random drift
            const driftX = Math.sin(state.clock.elapsedTime * 2 + index) * 0.2;
            const driftY = Math.cos(state.clock.elapsedTime * 1.5 + index) * 0.2;
            
            const target = new Vector3(leaderX + driftX, leaderY + driftY, 2 - index * 0.8);
            
            // Higher drag for nodes further back (creates the slow ribbon effect)
            const lag = 0.2 + (index * 0.15); 
            easing.damp3(ref.current.position, target, lag, delta);
            
            // gently sway rotation
            const rotLag = 0.3 + (index * 0.1);
            easing.dampE(ref.current.rotation, [0, 0, Math.sin(state.clock.elapsedTime + index) * 0.15], rotLag, delta);
            
            // Current leader for next node is somewhat below this node
            leaderX = ref.current.position.x;
            leaderY = ref.current.position.y - 0.4;
        });
    });

    return (
        <group>
            {refs.current.map((ref, index) => {
                const milestoneData = window.loveStoryData 
                    ? window.loveStoryData[(globalIndex - index + window.loveStoryData.length) % window.loveStoryData.length] 
                    : null;
                const dynamicOpacity = 1 - (index * 0.2); // fade oldest layers
                
                return (
                <mesh key={index} ref={ref} position={[0, -10, 0]}>
                    <sphereGeometry args={[0.15 - (index * 0.03), 16, 16]} />
                    <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={1 + (dynamicOpacity * 2)} transparent opacity={dynamicOpacity * 0.8} />
                </mesh>
                );
            })}
        </group>
    );
};

export default function WandCanvas() {
  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999
      }}
      camera={{ position: [0, 0, 10], fov: 45 }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <Wand />
      <PhotoStream />
    </Canvas>
  );
}
