
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import re
import os
import time
from functools import wraps
from scam_model import AdvancedTextPreprocessor, TextComplexityExtractor

app = Flask(__name__)
# Load config from Environment
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
CORS(app)

# Resolve absolute path to model file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'scam_model.pkl')
model = None

# --- Rate Limiter (In-Memory) ---
class RateLimiter:
    def __init__(self, limit=100, window=3600):
        self.limit = limit # requests
        self.window = window # seconds (1 hour)
        self.clients = {} # {ip: [timestamps]}

    def check(self, ip):
        now = time.time()
        if ip not in self.clients:
            self.clients[ip] = []
        
        # Filter out old requests
        self.clients[ip] = [t for t in self.clients[ip] if now - t < self.window]
        
        if len(self.clients[ip]) >= self.limit:
            return False
        
        self.clients[ip].append(now)
        return True

limiter = RateLimiter(limit=100, window=3600)

def rate_limit(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        ip = request.remote_addr
        if not limiter.check(ip):
            return jsonify({
                'error': 'Rate limit exceeded',
                'message': 'You have exceeded the 100 requests per hour limit. Please try again later.'
            }), 429
        return f(*args, **kwargs)
    return decorated_function

# --- Model Loading with Error Handling ---
try:
    from scam_model import AdvancedTextPreprocessor, TextComplexityExtractor
except ImportError as e:
    print(f"CRITICAL ERROR: Could not import helper classes: {e}")
    AdvancedTextPreprocessor = None
    TextComplexityExtractor = None

# --- Debug Endpoint ---
@app.route('/api/debug', methods=['GET'])
def debug_info():
    info = {
        "status": "alive",
        "cwd": os.getcwd(),
        "files_in_backend": [],
        "model_loaded": model is not None,
        "model_path": MODEL_PATH,
        "env_path": os.environ.get('PATH'),
    }
    try:
        # Check files in the directory
        info["files_in_backend"] = os.listdir(BASE_DIR)
        
        # Check if scam_model.pkl exists
        info["pickle_exists"] = os.path.exists(MODEL_PATH)
        info["pickle_size"] = os.path.getsize(MODEL_PATH) if info["pickle_exists"] else 0
        
    except Exception as e:
        info["error"] = str(e)
        
    return jsonify(info)
def load_model():
    global model
    try:
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None

def get_intent(text, is_scam):
    if not is_scam:
        return "Safe conversation"
    
    text = text.lower()
    if "otp" in text or "code" in text:
        return "Financial Theft (OTP)"
    if "bank" in text or "locked" in text or "verify" in text:
        return "Phishing (Bank Account)"
    if "police" in text or "arrest" in text or "irs" in text:
        return "Intimidation / Authority Impersonation"
    if "money" in text or "dollar" in text or "win" in text:
        return "Advance Fee Fraud"
    return "Suspicious Activity"


def hybrid_check(message, prediction, confidence):
    """
    Overrides ML model if high-risk patterns are detected.
    Returns (prediction, intent, confidence, explanation)
    """
    msg_lower = message.lower()
    
    # Heuristic Rules
    has_urgent = bool(re.search(r'\b(urgent|immediately|act now|suspended|blocked)\b', msg_lower))
    has_link = bool(re.search(r'(http|https|bit\.ly|tinyurl)', msg_lower))
    has_finance = bool(re.search(r'\b(bank|account|verify|update|kyt|pan|aadhar)\b', msg_lower))
    has_threat = bool(re.search(r'\b(harvest|organs|kill|death|police|arrest|jail|warrant)\b', msg_lower))
    has_money_demand = len(re.findall(r'\b(money|pay|transfer|cash|dollar|rupee)\b', msg_lower)) >= 2
    
    # Rule 0: Severe Threats (Organs, Kill, Arrest) = High Confidence Scam
    if has_threat:
         return 1, "Extortion / Threat", 0.98, "Detected severe threat language or authority impersonation."

    # Rule 1: Urgent + Link + Finance = High Confidence Scam
    if has_urgent and has_link and has_finance:
        return 1, "Phishing (Bank/Account)", 0.95, "Detected high-risk pattern: Urgent action required on financial account with a link."
        
    # Rule 2: Just Bank + Link (Common Phishing)
    if has_finance and has_link:
        # If model missed it, we flag it with slightly lower confidence but still scam
        if prediction == 0:
            return 1, "Phishing (Suspicious Link)", 0.85, "Detected financial keyword with a link. Proceed with caution."

    # Rule 3: Repeated Money Demands
    if has_money_demand:
        if prediction == 0:
             return 1, "Suspicious Money Demand", 0.80, "Detected repeated requests for money."
            
    return prediction, None, confidence, None

@app.route('/api/predict', methods=['POST'])
@rate_limit
def predict():
    if not model:
        load_model()
        if not model:
            return jsonify({'error': 'Model not available'}), 500
    
    data = request.json
    message = data.get('message', '')
    
    if not message:
        return jsonify({'error': 'No message provided'}), 400
        
    try:
        # Predict
        prediction = int(model.predict([message])[0])
        model_intent = get_intent(message, prediction == 1)
        
        # Get probability if supported
        try:
            proba = model.predict_proba([message])[0]
            confidence = float(max(proba))
        except:
            confidence = 1.0
            
        # Hybrid Check (Rule-Based Override)
        h_pred, h_intent, h_conf, h_expl = hybrid_check(message, prediction, confidence)
        
        final_prediction = h_pred
        final_intent = h_intent if h_intent else model_intent
        final_confidence = h_conf if h_pred != prediction else confidence
        
        if h_expl:
            explanation = h_expl
        else:
             explanation = f"Flagged as {final_intent}." if final_prediction == 1 else "Message appears safe."
             if final_prediction == 1 and final_confidence > 0.8:
                 explanation += f" High confidence ({final_confidence:.2f})."
            
        return jsonify({
            'classification': final_prediction,
            'intent': final_intent,
            'confidence': final_confidence,
            'explanation': explanation
        })
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    load_model()
    app.run(debug=True, port=5000)
