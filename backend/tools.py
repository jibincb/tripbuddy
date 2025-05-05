from langchain_community.tools import WikipediaQueryRun, DuckDuckGoSearchRun
from langchain_community.utilities import WikipediaAPIWrapper
from langchain.tools import Tool
from datetime import datetime
import requests
import json
import re
from tavily import TavilyClient
import os
from dotenv import load_dotenv

load_dotenv() 

tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))


search = DuckDuckGoSearchRun()
search_tool = Tool(
    name="search",
    func=search.run,
    description="Search the web for general information about a destination.",
)

api_wrapper = WikipediaAPIWrapper(top_k_results=4, doc_content_chars_max=500)
wiki_tool = Tool(
    name="wikipedia",
    func=WikipediaQueryRun(api_wrapper=api_wrapper).run,
    description="Search Wikipedia for detailed information about a destination or attraction.",
)

def get_attractions(destination: str) -> str:
    """Search for top attractions at a destination."""
    query = f"top tourist attractions in {destination}"
    results = tavily_client.search(query)
    return f"Top attractions in {destination}: {results}"

attractions_tool = Tool(
    name="get_attractions",
    func=get_attractions,
    description="Find top tourist attractions for a specific destination.",
)

def find_hotels(destination: str, budget: str = "affordable") -> str:
    """Search for hotels based on destination and budget."""
    query = f"{budget} Hotels in {destination} with prices and links of their page to book."
    results = tavily_client.search(query)
    return f"{budget} Hotel options in {destination}: {results}"

hotels_tool = Tool(
    name="find_hotels",
    func=find_hotels,
    description="Find hotel options based on destination and budget with the price in rupees per day with links to book if available.",
)


def find_restaurants(destination: str, budget: str = "affordable") -> str:
    """Search for restaurants based on destination and budget."""
    query = f"Some {budget} restaurants in {destination} with prices"
    results = tavily_client.search(query)
    return f"{budget} Restaurant options in {destination}: {results}"

restaurants_tool = Tool(
    name="find_restaurants",
    func=find_restaurants,
    description="Find restaurant options based on destination and budget and give the average prices of the foods.",
)


def get_weather(destination: str) -> str:
    def fetch_weather(api_key, location):
        base_url = "http://api.weatherapi.com/v1/current.json"
        
        try:
            response = requests.get(
                base_url,
                params={
                    'key': api_key,
                    'q': location,
                    'aqi': 'no'  
                }
            )
            response.raise_for_status()  
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching weather data: {e}")
            return None
    """Get weather information for a destination."""
    # query = f"current weather and best time to visit {destination}"
    # results = search.run(query)

    weather = fetch_weather(os.getenv("WEATHER_API_KEY"), destination)
    print(weather)
    return f"Weather information for {destination}: {weather}"

weather_tool = Tool(
    name="get_weather",
    func=get_weather,
    description="Get current weather information and tell whether this is good time to visit or not. Also give the temperature",
)

def get_transportation(destination: str) -> str:
    """Get transportation options for a destination."""
    query = f"how to get around in {destination} local transportation options and nearest stations. Also provide nearest city."
    results = tavily_client.search(query)
    return f"Transportation options in {destination}: {results}"

transportation_tool = Tool(
    name="get_transportation",
    func=get_transportation,
    description="Get information about local transportation options at a destination with the budget breakdown. Also provide the stations",
)

def estimate_budget(destination: str, days: int = 3, budget: str = "cheap") -> str:
    """Estimate budget for a trip."""
    query = f"average daily cost for tourists in {destination} including accommodation, food, and activities with {budget} budget option"
    results = tavily_client.search(query)
    return f"Budget estimation for {destination} ({days} days): {results}"

budget_tool = Tool(
    name="estimate_budget",
    func=estimate_budget,
    description="Estimate the budget needed for a trip to the destination.",
)

def create_itinerary(destination: str, days: int = 3) -> str:
    """Create a sample itinerary for the destination. Also get the budget breakdown for each if possible"""
    query = f"{days}-day itinerary for {destination} with day by day activities. Do not provide hotel name."
    results = tavily_client.search(query)
    return f"{days}-day itinerary for {destination}: {results}"

itinerary_tool = Tool(
    name="create_itinerary",
    func=create_itinerary,
    description="Create a day-by-day itinerary for a trip to a destination. Also provide the budget for each if possible",
)
