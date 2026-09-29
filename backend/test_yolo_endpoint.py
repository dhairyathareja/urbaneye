import requests

res = requests.post(
    "http://localhost:8000/api/detect-real-frame",
    data={
        "hazard_type": "pothole",
        "bus_id": "BUS-101",
        "location_name": "Rajpur Road, Near Astley Hall, Dehradun"
    }
)
print("Response Status:", res.status_code)
print("Response JSON:", res.json())
