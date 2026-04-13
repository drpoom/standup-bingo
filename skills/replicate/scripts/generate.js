#!/usr/bin/env node
/**
 * Replicate Image Generator
 * Usage: node generate.js "prompt" [--model schnell|pro] [--output path.png]
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Read API key from TOOLS.md
function getApiKey() {
  const toolsPath = path.join(process.env.HOME, '.openclaw/workspace/TOOLS.md');
  const content = fs.readFileSync(toolsPath, 'utf8');
  const match = content.match(/API Key:\*?\*?:?\*?\*?\s*`?(r8_[a-zA-Z0-9]+)`?/);
  if (!match) {
    console.error('ERROR: Could not find Replicate API key in TOOLS.md');
    process.exit(1);
  }
  return match[1];
}

// Parse args
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node generate.js "prompt" [--model schnell|pro] [--output path.png]');
  process.exit(1);
}

const prompt = args[0];
let model = 'schnell';
let outputPath = null;

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--model' && args[i + 1]) { model = args[i + 1]; i++; }
  if (args[i] === '--output' && args[i + 1]) { outputPath = args[i + 1]; i++; }
}

const modelId = model === 'pro'
  ? 'black-forest-labs/flux-pro'
  : 'black-forest-labs/flux-schnell';

const apiKey = getApiKey();

// Default output path
if (!outputPath) {
  const dir = path.join(process.env.HOME, '.openclaw/workspace/generated-assets');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const safeName = prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
  outputPath = path.join(dir, `${safeName}_${ts}.png`);
}

// Create prediction
// Version hashes for Replicate API
const VERSIONS = {
  'black-forest-labs/flux-schnell': 'c846a69991daf4c0e5d016514849d14ee5b2e6846ce6b9d6f21369e564cfe51e',
  'black-forest-labs/flux-pro': '' // Flux Pro uses model-based API
};

let createBody;
if (model === 'schnell') {
  createBody = JSON.stringify({
    version: VERSIONS[modelId],
    input: {
      prompt: prompt,
      num_outputs: 1,
      aspect_ratio: '1:1',
      output_format: 'png',
      output_quality: 90,
      go_fast: true
    }
  });
} else {
  createBody = JSON.stringify({
    model: modelId,
    input: {
      prompt: prompt,
      num_outputs: 1,
      aspect_ratio: '1:1',
      output_format: 'png',
      output_quality: 90
    }
  });
}

function makeRequest(url, options, body) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function downloadBinary(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, buffer: Buffer.concat(chunks) }));
    }).on('error', reject);
  });
}

async function main() {
  console.log(`Generating with ${modelId}...`);
  console.log(`Prompt: "${prompt}"`);

  // Create prediction
  const createRes = await makeRequest('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'wait'
    }
  }, createBody);

  if (createRes.status >= 400) {
    console.error(`API error ${createRes.status}: ${createRes.data}`);
    process.exit(1);
  }

  let prediction;
  try {
    prediction = JSON.parse(createRes.data);
  } catch (e) {
    console.error('Failed to parse response:', createRes.data);
    process.exit(1);
  }

  // Poll if not complete (Prefer: wait usually completes, but poll just in case)
  let attempts = 0;
  while (prediction.status !== 'succeeded' && prediction.status !== 'failed' && attempts < 60) {
    await new Promise(r => setTimeout(r, 2000));
    const pollRes = await makeRequest(prediction.urls.get, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    prediction = JSON.parse(pollRes.data);
    process.stderr.write('.');
    attempts++;
  }
  process.stderr.write('\n');

  if (prediction.status === 'failed') {
    console.error('Generation failed:', prediction.error);
    process.exit(1);
  }

  const imageUrl = prediction.output?.[0];
  if (!imageUrl) {
    console.error('No output URL in response:', JSON.stringify(prediction));
    process.exit(1);
  }

  // Download image (binary)
  console.log('Downloading image...');
  const imgRes = await downloadBinary(imageUrl);
  if (imgRes.status !== 200) {
    console.error(`Download failed: ${imgRes.status}`);
    process.exit(1);
  }

  fs.writeFileSync(outputPath, imgRes.buffer);
  console.log(`✅ Saved: ${outputPath}`);
  console.log(`URL: ${imageUrl}`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});