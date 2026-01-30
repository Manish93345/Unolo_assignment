# Feature A: Real-Time Distance Calculation

## Overview
Implemented real-time geographic distance calculation between employee current location and assigned client location during check-in.

Implemented Haversine formula for accurate earth-surface distance calculation.
Fetched client latitude and longitude from database.
Calculated distance using employee location and client location.
Stored calculated distance in distance_from_client column.
Updated check-in API response to include calculated distance.


Displayed real-time distance on Check-in page.
Added warning message if employee is more than 500 meters away from client location.
Displayed distance data in Check-in History table.


# Feature B: Daily Summary Report API

created a file reports.js in backend/routes
Daily Manager Summary Report API with role-based access and aggregated SQL analytics.
