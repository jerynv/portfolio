import AVFoundation
import AVKit
import Flutter
import MediaPlayer

private func updateNowPlayingInfo(
    title: String, artist: String, album: String, artwork: UIImage?, duration: Double,
    currentTime: Double
) {
    var nowPlayingInfo: [String: Any] = [
        MPMediaItemPropertyTitle: title,
        MPMediaItemPropertyArtist: artist,
        MPMediaItemPropertyAlbumTitle: album,
        MPMediaItemPropertyPlaybackDuration: duration,
        MPNowPlayingInfoPropertyElapsedPlaybackTime: currentTime,
        MPNowPlayingInfoPropertyPlaybackRate: 1.0,  // 1.0 = playing, 0.0 = paused
    ]

    // Update the Now Playing Info Center
    MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
    MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo

}

public class AudioEqPlugin: NSObject, FlutterPlugin {
    private var audioEngine: AVAudioEngine!
    private var currentAudioFile: AVAudioFile?
    private var audioPlayerNode: AVAudioPlayerNode!
    private var eqNode: AVAudioUnitEQ!
    private var timer: Timer?
    private var currentPosition: Double = 0.0
    private var eventSink: FlutterEventSink?

    public static func register(with registrar: FlutterPluginRegistrar) {
        let channel = FlutterMethodChannel(
            name: "audio_eq_plugin", binaryMessenger: registrar.messenger())
        let eventChannel = FlutterEventChannel(
            name: "audio_eq_plugin_stream", binaryMessenger: registrar.messenger())

        let instance = AudioEqPlugin()
        registrar.addMethodCallDelegate(instance, channel: channel)
        eventChannel.setStreamHandler(instance)
    }

    public override init() {
        super.init()
        setupAudioEngine()
    }

    private func setupAudioEngine() {
        audioEngine = AVAudioEngine()
        audioPlayerNode = AVAudioPlayerNode()
        eqNode = AVAudioUnitEQ(numberOfBands: 10)

        eqNode.globalGain = 0

        let frequencies: [Float] = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]
        let gains: [Float] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        for (index, band) in eqNode.bands.enumerated() {
            band.filterType = .parametric  // Use a parametric filter for better control
            band.frequency = frequencies[index]  // Set the center frequency
            band.gain = gains[index]  // Set the gain (from -6 to +6, can be adjusted later)
            band.bandwidth = 1.0  // Bandwidth in octaves, can be tweaked as needed
            band.bypass = false  // Ensure the band is active
        }
        // EQ configuration omitted for brevity
        audioEngine.attach(audioPlayerNode)
        audioEngine.attach(eqNode)
        audioEngine.connect(audioPlayerNode, to: eqNode, format: nil)
        audioEngine.connect(eqNode, to: audioEngine.mainMixerNode, format: nil)
    }

    public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
        switch call.method {
        case "playAudio":
            guard let args = call.arguments as? [String: Any],
                let filePath = args["filePath"] as? String
            else {
                result(
                    FlutterError(
                        code: "INVALID_ARGUMENTS", message: "Missing filePath", details: nil))
                return
            }
            playAudio(filePath: filePath)
            result(nil)
        case "getLength":
            if let audioFile = currentAudioFile {
                let duration = Double(audioFile.length) / audioFile.fileFormat.sampleRate
                result(duration)
            } else {
                result(0)
            }
        case "seek":
            guard let args = call.arguments as? [String: Any],
                let position = args["position"] as? Double,
                let isPlaying = args["isPlaying"] as? Bool
            else {
                result(
                    FlutterError(
                        code: "INVALID_ARGUMENTS",
                        message: "Missing position",
                        details: nil))
                return
            }

            guard let audioFile = currentAudioFile else {
                result(
                    FlutterError(
                        code: "NO_AUDIO_FILE",
                        message: "No audio file loaded",
                        details: nil))
                return
            }

            let sampleRate = audioFile.fileFormat.sampleRate
            let frameCount = audioFile.length
            let sampleTime = AVAudioFramePosition(position * sampleRate)

            // Ensure the seek position is valid
            guard sampleTime >= 0 && sampleTime < frameCount else {
                result(
                    FlutterError(
                        code: "OUT_OF_BOUNDS",
                        message: "Seek position is out of bounds",
                        details: nil))
                return
            }

            // Stop playback and schedule the segment from the seek position
            audioPlayerNode.stop()
            audioPlayerNode.scheduleSegment(
                audioFile,
                startingFrame: sampleTime,
                frameCount: AVAudioFrameCount(frameCount - sampleTime),
                at: nil
            )

            do {
                try audioEngine.start()  // Ensure the engine is running
                if isPlaying {
                    audioPlayerNode.play()
                }
                currentPosition = position  // Update the current position
                result(nil)
            } catch {
                result(
                    FlutterError(
                        code: "ENGINE_ERROR",
                        message: "Failed to start audio engine",
                        details: error.localizedDescription))
            }
        case "showAirPlayPicker":
            showAirPlay()
            result(nil)
        case "hideAirPlayPicker":
            hideAirPlay()
            result(nil)
        case "setNowPlayingInfo":
            guard let args = call.arguments as? [String: Any],
                let title = args["title"] as? String,
                let artist = args["artist"] as? String,
                let album = args["album"] as? String,
                let duration = args["duration"] as? Double,
                let currentTime = args["currentTime"] as? Double
            else {
                result(
                    FlutterError(
                        code: "INVALID_ARGUMENTS",
                        message: "Missing or invalid arguments",
                        details: nil))
                return
            }

            let artworkData = args["artwork"] as? FlutterStandardTypedData
            let artwork = artworkData != nil ? UIImage(data: artworkData!.data) : nil
            print(
                "Setting now playing info with title: \(title), artist: \(artist), album: \(album) duration: \(duration), currentTime: \(currentTime)"
            )
            updateNowPlayingInfo(
                title: title, artist: artist, album: album, artwork: artwork,
                duration: duration, currentTime: currentTime)
            result(nil)
        case "togglePlay":
            //make sure the aidio is still set up properly as somtimes other audio apps can interfere
            do {
                try audioEngine.start()
            } catch {
                result(
                    FlutterError(
                        code: "ENGINE_ERROR",
                        message: "Failed to start audio engine",
                        details: error.localizedDescription))
            }
            if audioPlayerNode.isPlaying {
                audioPlayerNode.pause()
                stopPositionTimer()
            } else {
                audioPlayerNode.play()
                startPositionTimer()
            }
            result(audioPlayerNode.isPlaying)

        case "setEQBand":
            // Extract arguments and validate
            guard let args = call.arguments as? [String: Any],
                let bandIndex = args["bandIndex"] as? Int,
                let gain = args["gain"] as? Double

            else {
                print("Invalid arguments: \(call.arguments ?? "nil")")
                result(
                    FlutterError(
                        code: "INVALID_ARGUMENTS",
                        message: "Missing or invalid bandIndex or gain",
                        details: "Expected bandIndex (Int) and gain (Float).")
                )
                return
            }

            // Set the EQ band
            let success = setEQBand(bandIndex: bandIndex, gain: Float(gain))
            if success {
                result(nil)  // Indicate success
            } else {
                result(
                    FlutterError(
                        code: "INVALID_BAND_INDEX",
                        message: "Band index out of range",
                        details: "Band index must be between 0 and \(eqNode.bands.count - 1).")
                )
            }

        default:
            result(FlutterMethodNotImplemented)
        }
    }

    private func playAudio(filePath: String) {
        guard let fileURL = URL(string: filePath) else { return }
        let audioSession = AVAudioSession.sharedInstance()
        do {
            try audioSession.setCategory(
                .playback, mode: .default,
                options: [
                    .duckOthers
                ])
            try audioSession.setActive(true)
        } catch {
            print("Audio session configuration failed: \(error)")
        }
        do {
            let audioFile = try AVAudioFile(forReading: fileURL)
            currentAudioFile = audioFile  // Store the audio file
            currentPosition = 0.0  // Reset the current position
            audioPlayerNode.stop()
            audioPlayerNode.scheduleFile(audioFile, at: nil, completionHandler: nil)
            try audioEngine.start()
            audioPlayerNode.play()
            startPositionTimer()
        } catch {
            sendErrorToFlutter(error.localizedDescription)
        }
    }

    private func setupRemoteCommandCenter() {
        let commandCenter = MPRemoteCommandCenter.shared()

        // Handle Play command
        commandCenter.playCommand.addTarget { [weak self] event in
            self?.audioPlayerNode.play()  // Start playback
            self?.updateNowPlayingPlaybackRate(isPlaying: true)
            return .success
        }

        // Handle Pause command
        commandCenter.pauseCommand.addTarget { [weak self] event in
            self?.audioPlayerNode.pause()  // Pause playback
            self?.updateNowPlayingPlaybackRate(isPlaying: false)
            return .success
        }

        // Optional: Handle Stop or other commands
        commandCenter.stopCommand.addTarget { [weak self] event in
            self?.audioPlayerNode.stop()  // Stop playback
            self?.updateNowPlayingPlaybackRate(isPlaying: false)
            return .success
        }
    }

    private func updateNowPlayingPlaybackRate(isPlaying: Bool) {
        MPNowPlayingInfoCenter.default().nowPlayingInfo?[MPNowPlayingInfoPropertyPlaybackRate] =
            isPlaying ? 1.0 : 0.0
    }

    private func setEQBand(bandIndex: Int, gain: Float) -> Bool {
        // Validate band index range
        guard bandIndex >= 0 && bandIndex < eqNode.bands.count else {
            return false  // Invalid band index
        }

        // Apply gain to the specified band
        eqNode.bands[bandIndex].gain = gain
        return true
    }

    private func startPositionTimer() {
        stopPositionTimer()
        timer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { _ in
            self.sendPositionToFlutter()
        }
    }

    private func stopPositionTimer() {
        timer?.invalidate()
        timer = nil
    }

    private func sendPositionToFlutter() {
        guard let eventSink = eventSink,
            let nodeTime = audioPlayerNode.lastRenderTime,
            let playerTime = audioPlayerNode.playerTime(forNodeTime: nodeTime)
        else { return }

        // Calculate the current playback position
        let elapsed = Double(playerTime.sampleTime) / playerTime.sampleRate
        let position = currentPosition + elapsed

        eventSink(["event": "position", "value": position])
    }

    private func sendErrorToFlutter(_ errorMessage: String) {
        eventSink?(["event": "error", "value": errorMessage])
    }
}

extension AudioEqPlugin: FlutterStreamHandler {
    public func onListen(
        withArguments arguments: Any?, eventSink events: @escaping FlutterEventSink
    ) -> FlutterError? {
        self.eventSink = events
        return nil
    }

    public func onCancel(withArguments arguments: Any?) -> FlutterError? {
        self.eventSink = nil
        return nil
    }
}

private func showAirPlay() {
    let airPlayPicker = AVRoutePickerView(frame: .zero)
    airPlayPicker.tintColor = .systemBlue
    airPlayPicker.activeTintColor = .systemRed
    airPlayPicker.backgroundColor = .clear

    let window = UIApplication.shared.windows.first { $0.isKeyWindow }
    let bottomPadding = window?.safeAreaInsets.bottom ?? 0
    let bottomOffset = bottomPadding > 0 ? -bottomPadding : 0

    airPlayPicker.translatesAutoresizingMaskIntoConstraints = false
    window?.addSubview(airPlayPicker)
    NSLayoutConstraint.activate([
        airPlayPicker.trailingAnchor.constraint(equalTo: window!.trailingAnchor, constant: -16),
        airPlayPicker.bottomAnchor.constraint(
            equalTo: window!.bottomAnchor, constant: bottomOffset),
    ])
}

private func hideAirPlay() {
    let airPlayPicker = AVRoutePickerView(frame: .zero)
    airPlayPicker.removeFromSuperview()
}
