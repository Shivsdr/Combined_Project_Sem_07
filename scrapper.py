import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')
#path to csv file
data = pd.read_csv('/content/Clothing.csv')
import requests
from bs4 import BeautifulSoup
import pandas as pd
from concurrent.futures import ThreadPoolExecutor

reviewlist = []

def get_soup(url):
    try:
        r = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        soup = BeautifulSoup(r.text, 'html.parser')
        return soup
    except Exception as e:
        print(f"Error fetching URL {url}: {e}")
        return None

def get_reviews(soup, product_name):
    reviews = soup.find_all('div', {'data-hook': 'review'})
    try:
        for item in reviews:
            review = {
                'product': product_name,
                'title': item.find('a', {'data-hook': 'review-title'}).text.strip(),
                'rating': float(item.find('i', {'data-hook': 'review-star-rating'}).text.replace('out of 5 stars', '').strip()),
                'body': item.find('span', {'data-hook': 'review-body'}).text.strip(),
            }
            reviewlist.append(review)
    except Exception as e:
        print(f"Error extracting reviews: {e}")
        pass

def scrape_product_reviews(product_info):
    url, product_name = product_info
    for x in range(1, 3):
        soup = get_soup(f'{url}&pageNumber={x}')
        if soup:
            print(f'Getting page {x} for {product_name}')
            get_reviews(soup, product_name)
            if not soup.find('li', {'class': 'a-disabled a-last'}):
                continue
            else:
                break


product_info_list = [(row['link'], row['name']) for index, row in data.iterrows()]

with ThreadPoolExecutor(max_workers=40) as executor:
    executor.map(scrape_product_reviews, product_info_list)

df = pd.DataFrame(reviewlist)
#output file path
df.to_csv('/content/Output/Clothing.csv', index=False)

