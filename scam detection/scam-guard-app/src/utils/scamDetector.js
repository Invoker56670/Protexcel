export const analyzeContent = async (text) => {
  try {
    // Use 127.0.0.1 to avoid localhost IPv6 resolution issues with Flask
    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: text }),
    });

    if (!response.ok) {
      throw new Error('Server error');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("Backend unavailable, using local heuristic fallback:", error);

    // Fallback Mock Logic
    const lowerText = text.toLowerCase();
    // Expanded keyword list for better local detection
    const isScam = /otp|bank|block|urgent|win|lottery|police|arrest|click|scam|money|fraud|dollar|rupee|lock|verify/.test(lowerText);

    return {
      classification: isScam ? 1 : 0,
      intent: isScam ? "Suspicious Keyword Detected (Local Fallback)" : "Safe Conversation",
      confidence: 0.75, // Lower confidence for fallback
      explanation: isScam
        ? "Contains suspicious keywords like money, scam, or urgent actions (detected locally)."
        : "No obvious threats detected (detected locally)."
    };
  }
};
