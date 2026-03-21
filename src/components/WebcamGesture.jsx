import { useEffect, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection'

function WebcamGesture({ onGesture, currentGesture }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isActive, setIsActive] = useState(false)
  const [detector, setDetector] = useState(null)
  const [lastGesture, setLastGesture] = useState(null)
  const gestureTimeout = useRef(null)

  // Initialize hand detector
  useEffect(() => {
    const loadModel = async () => {
      await tf.ready()
      const model = handPoseDetection.SupportedModels.MediaPipeHands
      const detectorConfig = {
        runtime: 'tfjs',
        modelType: 'full'
      }
      const handDetector = await handPoseDetection.createDetector(model, detectorConfig)
      setDetector(handDetector)
      setIsLoading(false)
    }
    loadModel()
  }, [])

  // Start webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsActive(true)
        detectHands()
      }
    } catch (error) {
      console.error('Error accessing webcam:', error)
      alert('Unable to access webcam. Please grant camera permissions.')
    }
  }

  // Stop webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
      setIsActive(false)
    }
  }

  // Detect hand gestures
  const detectHands = async () => {
    if (!detector || !videoRef.current || !isActive) return

    const hands = await detector.estimateHands(videoRef.current)

    if (hands.length > 0) {
      const hand = hands[0]
      const keypoints = hand.keypoints

      // Draw hand on canvas
      drawHand(keypoints)

      // Detect gesture based on hand position
      const gesture = detectGestureFromHand(keypoints)
      if (gesture && gesture !== lastGesture) {
        setLastGesture(gesture)
        onGesture(gesture)

        // Clear previous timeout
        if (gestureTimeout.current) {
          clearTimeout(gestureTimeout.current)
        }

        // Reset gesture detection after 1 second
        gestureTimeout.current = setTimeout(() => {
          setLastGesture(null)
        }, 1000)
      }
    } else {
      // Clear canvas if no hand detected
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    requestAnimationFrame(detectHands)
  }

  // Draw hand keypoints on canvas
  const drawHand = (keypoints) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw keypoints
    keypoints.forEach((point) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
      ctx.fillStyle = '#00ff00'
      ctx.fill()
    })

    // Draw connections
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
    ]

    ctx.strokeStyle = '#00ff00'
    ctx.lineWidth = 2
    connections.forEach(([start, end]) => {
      ctx.beginPath()
      ctx.moveTo(keypoints[start].x, keypoints[start].y)
      ctx.lineTo(keypoints[end].x, keypoints[end].y)
      ctx.stroke()
    })
  }

  // Detect gesture based on hand position
  const detectGestureFromHand = (keypoints) => {
    if (!keypoints || keypoints.length === 0) return null

    // Get wrist position (keypoint 0)
    const wrist = keypoints[0]
    const middleFingerTip = keypoints[12]

    // Calculate center of video
    const centerX = videoRef.current.videoWidth / 2
    const centerY = videoRef.current.videoHeight / 2

    // Detect horizontal movement (left/right)
    if (wrist.x < centerX - 150) {
      return 'left'
    } else if (wrist.x > centerX + 150) {
      return 'right'
    }

    // Detect vertical movement (up/down)
    if (wrist.y < centerY - 100) {
      return 'up'
    } else if (wrist.y > centerY + 100) {
      return 'down'
    }

    return null
  }

  return (
    <div className="webcam-container">
      <h2>Hand Gesture Control</h2>

      <div className="video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          width="640"
          height="480"
          style={{ display: isActive ? 'block' : 'none' }}
        />
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          style={{ display: isActive ? 'block' : 'none' }}
        />

        {!isActive && (
          <div className="webcam-placeholder">
            <p>Camera is off</p>
          </div>
        )}
      </div>

      <div className="webcam-controls">
        {!isActive ? (
          <button
            onClick={startWebcam}
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Loading Model...' : 'Start Camera'}
          </button>
        ) : (
          <button onClick={stopWebcam} className="btn btn-danger">
            Stop Camera
          </button>
        )}
      </div>

      {currentGesture && (
        <div className="gesture-indicator">
          <p>Detected: {currentGesture.toUpperCase()}</p>
        </div>
      )}

      <div className="gesture-guide">
        <h3>Gesture Guide:</h3>
        <ul>
          <li>Move hand LEFT ← Previous location</li>
          <li>Move hand RIGHT → Next location</li>
          <li>Move hand UP ↑ Zoom in</li>
          <li>Move hand DOWN ↓ Zoom out</li>
        </ul>
      </div>
    </div>
  )
}

export default WebcamGesture
