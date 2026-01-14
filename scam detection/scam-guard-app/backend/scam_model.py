
import numpy as np
import re
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.base import BaseEstimator, TransformerMixin

# Helper to load pandas only when training (not on Vercel inference)
def get_pandas():
    import pandas as pd
    return pd

# --- 1. Robust Text Preprocessor (No NLTK) ---
class AdvancedTextPreprocessor(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass
        
    def clean_text(self, text):
        if not isinstance(text, str): return ""
        text = text.lower()
        # Keep only basic chars
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        return ' '.join(text.split())
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        return [self.clean_text(x) for x in X]

# --- 2. Feature Engineering Helper ---
class TextComplexityExtractor(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self
        
    def transform(self, X):
        features = []
        for text in X:
            t = str(text)
            features.append([
                len(t), 
                len(t.split()),
                # Mock sentiment (simple positive/negative word check)
                1 if 'good' in t or 'safe' in t else 0,
                1 if 'bad' in t or 'urgent' in t else 0
            ])
        return np.array(features)

# --- 3. Synthetic Data Helper (Fallback) ---
def generate_synthetic_data(n_samples=200):
    scam_templates = [
        "Urgent! Your bank account has been locked. Click {link} to verify identity.",
        "You have won a lottery of $500,000! Call {phone} immediately to claim.",
        "IRS warning: Unpaid taxes detected. Police will arrest you if not paid by 5 PM.",
        "Kindly provide your OTP to unlock your card.",
        "Give me your money or I will hack you.",
    ]
    safe_templates = [
        "Hey, are we still meeting for lunch tomorrow?",
        "Your package has been delivered to your front porch.",
        "Mom, can you call me when you get this?",
        "Meeting reminder: Project sync at 10 AM.",
        "Happy birthday! Hope you have a great day.",
    ]
    data, labels = [], []
    for _ in range(n_samples // 2):
        data.append(np.random.choice(scam_templates).replace("{link}", "http://fake").replace("{phone}", "555-0199"))
        labels.append(1)
        data.append(np.random.choice(safe_templates))
        labels.append(0)
    
    pd = get_pandas()
    return pd.DataFrame({'message': data, 'label': labels})

# --- 4. Hybrid Data (Real Scams + Synthetic Safe) ---
def load_and_augment_data():
    data = []
    labels = []
    
    # 1. Load Real Scam Data
    try:
        pd = get_pandas()
        print("Loading real scam data from CSV...")
        df_real = pd.read_csv('unified_scam_detection_dataset.csv')
        if 'scammer_message' in df_real.columns:
            scams = df_real['scammer_message'].astype(str).tolist()
            # Filter out short/empty
            scams = [s for s in scams if len(s) > 5]
            data.extend(scams)
            labels.extend([1] * len(scams))
            print(f"Loaded {len(scams)} real scam samples.")
        else:
            print("Column 'scammer_message' not found. Using synthetic scams.")
            df_syn = generate_synthetic_data(n_samples=500)
            return df_syn['message'], df_syn['label']
            
    except FileNotFoundError:
        print("CSV not found. Using fully synthetic data.")
        df_syn = generate_synthetic_data(n_samples=200)
        return df_syn['message'], df_syn['label']

    # 2. Generate Balanced Safe Data
    # We need as many safe examples as scams to avoid bias
    n_safe_needed = len(data)
    print(f"Generating {n_safe_needed} synthetic safe samples for balance...")
    
    safe_templates = [
        "Hey, are we still meeting for lunch tomorrow?",
        "Your package has been delivered to your front porch.",
        "Mom, can you call me when you get this?",
        "Meeting reminder: Project sync at 10 AM.",
        "Can you send me the recipe for that pasta?",
        "Happy birthday! Hope you have a great day.",
        "Your bank statement is ready for view in the secure portal.",
        "Appointment confirmed for Tuesday.",
        "I'll be there in 10 minutes.",
        "Did you see the game last night?",
        "Please review the attached document when you have time.",
        "Thanks for your help today!",
        "Let's catch up this weekend.",
        "The code is working fine now.",
        "Don't forget to buy milk.",
        "I love this song!"
    ]
    
    for _ in range(n_safe_needed):
        base = np.random.choice(safe_templates)
        # Add random noise to avoid duplicates
        if np.random.random() > 0.5:
             base += f" ({np.random.randint(1, 100)})"
        data.append(base)
        labels.append(0)
        
    return pd.DataFrame({'message': data, 'label': labels})

# --- 4. Main Training Pipeline ---
def train_and_save_model():
    df = load_and_augment_data()
    X = df['message']
    y = df['label']
    
    if isinstance(df, tuple): # Handle fallback return
        X, y = df
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    pipeline = Pipeline([
        ('features', FeatureUnion([
            ('tfidf', Pipeline([
                ('preprocessor', AdvancedTextPreprocessor()),
                ('vect', TfidfVectorizer(max_features=1000, stop_words='english'))
            ])),
            ('complexity', TextComplexityExtractor())
        ])),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ])
    
    print("Training Random Forest model...")
    pipeline.fit(X_train, y_train)
    
    score = pipeline.score(X_test, y_test)
    print(f"Model Accuracy on Test Set: {score:.4f}")
    
    with open('scam_model.pkl', 'wb') as f:
        pickle.dump(pipeline, f)
    print("Model saved to scam_model.pkl")

if __name__ == "__main__":
    train_and_save_model()
