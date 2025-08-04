import requests
import json

company_name = input ("Enter company name: ")
company_details = input("Enter companies details: ")
product_name = input("Enter product name: ")
product_names = [product_name.split(',')]
product_details = input("Enter product details: ")
    
# Function to get user input for the JSON fields
def get_user_input():
    if len(product_names) == 1:
        brief = (
            f"Create a video/presentation for a sales pitch targeted at {company_name} which is a {company_details} "
            f"presenting our product, {product_name}, {product_details} made by my firm, Airo Digital Labs explaining how our "
            f"{product_name} can benefit them and why they should purchase it."
        )
    else:
        brief = (
            f"Create a video/presentation for a sales pitch targeted at {company_name}, which is a {company_details} "
            f"presenting our products, {product_names}, made by my firm, Airo Digital Labs. Explain how each of our {product_details} "
            f"can benefit them and why they should purchase these products."
        )x
        
    settings = "Formal serious tone that is required for a sales pitch"
    platforms = ["youtube" , "presentations"]
    audiences = ["clients" , "employers/employees"]
    length_in_minutes = 2
    openaiFileIdRefs = input("Enter the OpenAI file ID references (comma separated, leave blank if none): ").strip()
    if openaiFileIdRefs:
        openaiFileIdRefs = [file_id.strip() for file_id in openaiFileIdRefs.split(',')]
    else:
        openaiFileIdRefs = []
    
    return {
        "brief": brief,
        "settings": settings,
        "platforms": platforms,
        "audiences": audiences,
        "length_in_minutes": length_in_minutes,
        "openaiFileIdRefs": openaiFileIdRefs
    }

# Function to create title and description using the brief
def create_title_and_description(brief):
    title = f"Sales Pitch for {product_name}"
    description = (
        f"This presentation is targeted at showcasing our product {product_name} to {company_name}. "
        f"It explains the benefits and reasons to purchase our innovative solutions."
    )
    return title, description

# Define the URL for the API endpoint
url = "https://video-ai.invideo.io/api/copilot/request/chatgpt-new-from-brief"
# Get dynamic input JSON from the user
input_json = get_user_input()
# Create title and description using the brief
input_json['title'], input_json['description'] = create_title_and_description(input_json['brief'])
# Set the headers
headers = {
    "Content-Type": "application/json"
}

# Make the API call
response = requests.post(url, headers=headers, data=json.dumps(input_json))
# Check if the request was successful
if response.status_code == 200:
    # Parse the output JSON
    output_json = response.json()
    video_url = output_json.get("video_url")
    thumbnail_url = output_json.get("thumbnail_url")

    # Print the results
    print("Video URL:", video_url)
    print("Thumbnail URL:", thumbnail_url)
else:
    print("Failed to make the API call. Status code:", response.status_code)
    print("Response:", response.text)
