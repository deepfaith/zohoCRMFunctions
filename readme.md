# Zoho Catalyst Event Function and Advanced I/O Integration

## Overview
This project involves the development of a **Zoho Catalyst** event function and advanced I/O to integrate **Salesdock** and **Steam Connect** with **Zoho CRM** using **Node.js 18** and **TypeScript**. The system leverages **Zoho Catalyst Data Store** and **Catalyst Events** for seamless data processing and automation. For REST API interactions, **Axios** is used to ensure efficient HTTP requests and responses.

## Key Integrations

### 1. Steam Connect Integration with Zoho
- Enables seamless communication and call management within Zoho CRM.
- Tracks customer interactions and call histories for a more personalized engagement.

### 2. Salesdock Integration with Zoho
- Facilitates lead management and conversion tracking.
- Ensures all relevant lead data is automatically updated in Zoho CRM.

## Features
- **Instant Lead Engagement**: As soon as a lead enters Zoho, it will integrate with Salesdock and Steam Connect.
- **Data Collection & Qualification**: Gathers relevant lead details and updates Zoho CRM.
- **Seamless CRM Integration**: Logs all lead interactions within Zoho for tracking and reporting.

## Tech Stack
- **Node.js 18**
- **TypeScript**
- **Zoho Catalyst** (Data Store, Event Function, Advanced I/O)
- **Zoho CRM**
- **Axios** (REST API requests)

## Setup & Development
### Prerequisites
Ensure you have the following installed:
- [Node.js 18](https://nodejs.org/)
- [Zoho Catalyst CLI](https://docs.catalyst.zoho.com/en/cli/)
- TypeScript (`npm install -g typescript`)
- Axios (`npm install axios`)


### Catalyst Event Function
1. Navigate to the `functions` directory.
2. Implement the event function to handle incoming CRM events.
3. Example event handler in `index.ts`:

### Deployment
To deploy your Catalyst event function:
```sh
catalyst deploy
```

## Expected Benefits
- **Efficiency**: Automates lead engagement and data updates.
- **Improved Lead Qualification**: Ensures structured lead processing before sales interaction.
- **Seamless Integration**: Synchronizes Salesdock and Steam Connect data with Zoho CRM.
- **Higher Conversion Rates**: Enhances lead nurturing with automation.

For any issues or suggestions, feel free to reach out to the development team!

