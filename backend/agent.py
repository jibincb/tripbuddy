from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from langchain.agents import create_tool_calling_agent, AgentExecutor
from tools import (
    search_tool, wiki_tool, attractions_tool, hotels_tool, 
    weather_tool, transportation_tool, budget_tool, itinerary_tool, restaurants_tool
)
import time
import json
from langchain_mistralai.chat_models import ChatMistralAI

load_dotenv()

class TripPlanModel(BaseModel):
    destination: str = Field(description="The destination for the trip")
    overview: str = Field(description="Brief overview of the destination")
    attractions: list[str] = Field(description="List of top attractions at the destination")
    hotels: list[dict] = Field(description="List of 3-4 recommended hotels with prices and links to book in json format")
    best_time_to_visit: str = Field(description="Current weather and is it favourable to visit now.")
    transportation: str = Field(description="Local transportation options with stations if available")
    estimated_budget: str = Field(description="Estimated budget for the trip including food and accomodation in short")
    itinerary: dict = Field(description="Day-by-day itinerary. The format should be for each day the time and activity should be key value pair.")
    travel_tips: list[str] = Field(description="Useful travel tips for the destination")
    sources: list[str] = Field(description="Sources of information used. (just names not links)")
    tools_used: list[str] = Field(description="Tools used to gather information")


llm = ChatMistralAI(
    model="codestral-latest",
    temperature=0,
    api_key=os.getenv("MISTRAL_API_KEY"),
)

parser = PydanticOutputParser(pydantic_object=TripPlanModel)
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
            You are an advanced AI Trip Planner assistant that helps users plan their perfect vacation.
            
            PROCESS:
            1. When given a destination, first gather comprehensive information about it using the appropriate tools.
            2. Use get_attractions to find top tourist attractions at the destination.
            3. Use find_hotels to discover accommodation with their links.
            4. Use get_weather to learn about current weather conditions and tell whether its good time to visit. Also give the current temperature. Also provide best time to visit.
            5. Use get_transportation to understand local transportation options.
            6. Use estimate_budget to provide a cost estimate for the trip, including food and accomodation.
            7. Use create_itinerary to develop a day-by-day plan for the trip with including restaurant timings and names. Give the Hotel name as any of the name gathered from find_hotels. Use restaurants_tool to find the restaurants and prices.
            
            GUIDELINES:
            - Plan with the given budget accordingly.
            - DO NOT MAKE UP ANYTHING.
            - Be thorough in your research, using multiple tools to gather comprehensive information.
            - Provide specific, actionable information rather than general advice.
            - Provide a timeline for each day with tourist destinations and food spots. Give the estimated budget breakdown only for each food spot if possible.
            - Include a mix of popular attractions and hidden gems.
            - Include practical travel tips specific to the destination.
            - Format the itinerary in a clear, day-by-day structure with time.
            
            After gathering all information, organize it according to the specified output format.
            
            IMPORTANT: Your output must be ONLY a valid JSON object with no additional text before or after. 
            Do not add any commentary, explanations, or lists of tools used outside the JSON structure.
            Include the tools used inside the JSON under the 'tools_used' field.
            
            Wrap the output only in the following format and do not provide any other text:\n{format_instructions}
            """,
        ),
        ("placeholder", "{chat_history}"),
        ("human", "{query}"),
        ("placeholder", "{agent_scratchpad}"),
    ]
).partial(format_instructions=parser.get_format_instructions())

tools = [
    search_tool, 
    wiki_tool, 
    attractions_tool,
    hotels_tool,
    weather_tool,
    transportation_tool,
    budget_tool,
    itinerary_tool,
    restaurants_tool
]

agent = create_tool_calling_agent(
    llm=llm,
    tools=tools,
    prompt=prompt,
)

agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
)


def run(destination, budget_preference, days):
    query = f"{destination} for {days} days with {budget_preference} budget"
    print(" Researching your destination...")
    try:
        raw_response = agent_executor.invoke(
            {
                "query": query,
            }
        )
        raw_output = raw_response["output"]
    

        if isinstance(raw_output, str):
            raw_output = raw_output.replace("```json", "").replace("```", "").strip()

        trip_data = json.loads(raw_output)
        print("Trip Data", trip_data)
        return trip_data

        
    except Exception as e:
        print(f"\n❌ Error generating trip plan: {e}")
        print(f"Raw output type: {type(raw_response['output'])}") 
        print(f"Raw output content: {raw_response['output']}")
        print("Please try again with a different destination or check your internet connection.")

