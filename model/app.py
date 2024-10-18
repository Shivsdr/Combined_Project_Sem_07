# -- coding: utf-8 --
"""
Created on Tue Nov 17 21:40:41 2020

@author: win10
"""

# 1. Library imports
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import nltk
import re
from nltk.stem import WordNetLemmatizer
nltk.download('wordnet')
nltk.download("stopwords")
from nltk.corpus import stopwords
stop_words = set(stopwords.words('english')) - {'not','no'}
lemmatizer = WordNetLemmatizer()

# 2. Create the app object
app = FastAPI()

# Load the pre-trained model
try:
    classifier = joblib.load('rf_model_new.pkl')
    count_vectorizer = joblib.load('countVectorizer_new.pkl')
except Exception as e:
    print(f"Error loading model: {e}")

# Class to define the input structure
class ProductList(BaseModel):
    product: list

# Global variable to store the list of reviews
user_reviews = []

def preprocess_new(review):
  review = re.sub('[^a-zA-Z]', ' ', review)
  review = review.lower().split()
  review = [lemmatizer.lemmatize(word) for word in review if not word in stop_words]
  review = ' '.join(review)
  # corpus.append(review)
  return review

# 3. Index route, opens automatically on http://127.0.0.1:8000
@app.get('/')
def index():
    return {'message': 'Hello, World'}

# 4. Route to take input from the user
@app.post('/getInp')
def get_product_details(products: ProductList):
    # Clear user reviews for each new input
    user_reviews.clear()  # Make sure to clear previous reviews
    
    # Access the product list from the ProductList instance
    for product in products.product:  # Use products.product instead of len(products)
        # print(product)  # Print the entire product object
        for rev in product.get("reviews", []):  # Safely get reviews
            preprocess_review=preprocess_new(rev["review"])
            user_reviews.append(preprocess_review)
        
        # print(user_reviews)
        result = predict_review(user_reviews)
        # print(result)
        product["result"] = result;
        user_reviews.clear()

    return products


# 5. Prediction functionality
# @app.get('/predict')
def predict_review(user_reviews):
    # global user_reviews
    
    if not user_reviews:
        return {'error': 'No reviews received. Please provide input via /getInp'}
    
    test_vect = count_vectorizer.transform(user_reviews).toarray()
    predictions = classifier.predict(test_vect)
    
    positive_reviews = sum(1 for pred in predictions if pred > 3)
    total_reviews = len(user_reviews)
    positive_rate = (positive_reviews / total_reviews) * 100 if total_reviews > 0 else 0
    
    return {
        'total_reviews': total_reviews,
        'positive_reviews': positive_reviews,
        'positive_rate': f'{positive_rate:.2f}%'
    }

# 6. Run the API with uvicorn
if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)

# You can run the app using: uvicorn app:app --reload
