const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class AudioService {
  constructor() {
    this.uploadDir = path.join(__dirname, '../uploads');
    this.processedDir = path.join(__dirname, '../processed');

    // Ensure directories exist
    [this.uploadDir, this.processedDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async processAudio(filePath) {
    try {
      // Convert audio to required format
      const processedPath = await this.convertAudio(filePath);
      
      // Transcribe audio
      const transcription = await this.transcribeAudio(processedPath);
      
      // Clean up files
      this.cleanup(filePath, processedPath);
      
      return transcription;
    } catch (error) {
      console.error('Audio processing error:', error);
      throw error;
    }
  }

  async convertAudio(inputPath) {
    return new Promise((resolve, reject) => {
      const outputPath = path.join(
        this.processedDir,
        `${path.basename(inputPath)}.mp3`
      );

      ffmpeg(inputPath)
        .toFormat('mp3')
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .save(outputPath);
    });
  }

  async transcribeAudio(audioPath) {
    try {
      const audioStream = fs.createReadStream(audioPath);
      
      const response = await openai.audio.transcriptions.create({
        file: audioStream,
        model: "whisper-1",
        language: "en"
      });

      return response.text;
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }

  async analyzeAudio(audioPath) {
    try {
      // Additional audio analysis features can be added here
      const analysis = {
        duration: await this.getAudioDuration(audioPath),
        waveform: await this.generateWaveform(audioPath),
        metrics: await this.calculateAudioMetrics(audioPath)
      };
      
      return analysis;
    } catch (error) {
      console.error('Audio analysis error:', error);
      throw error;
    }
  }

  async getAudioDuration(audioPath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(audioPath, (err, metadata) => {
        if (err) reject(err);
        resolve(metadata.format.duration);
      });
    });
  }

  async generateWaveform(audioPath) {
    // Implement waveform generation logic
    return [];
  }

  async calculateAudioMetrics(audioPath) {
    // Implement audio metrics calculation
    return {
      amplitude: 0,
      frequency: 0,
      noise: 0
    };
  }

  cleanup(...files) {
    files.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
  }
}

module.exports = new AudioService(); 