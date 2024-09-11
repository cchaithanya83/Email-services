
# Automated Email Handling: AI-Powered Categorization, Replies, and Task Scheduling

This project provides a comprehensive solution for email management, including reading and sending emails from Gmail and Outlook accounts, AI-powered context-based replies, and task scheduling using BullMQ.

## Features

- **AI-Powered Email Categorization and Replies**: Automatically categorize emails and generate appropriate responses using OpenAI.
- **Email Processing Queue**: Efficient task scheduling and email processing using BullMQ.
- **Read and Send Emails**: Fetch incoming emails from Gmail and Outlook, and send replies based on categorized content.
- **Automated Labeling**: Assign labels such as "Interested", "Not Interested", or "More Information" based on email content.

## Technology Stack

- **Node.js**: Server-side runtime.
- **Nodemailer**: For sending emails.
- **IMAP-Simple**: For reading emails.
- **BullMQ**: Task scheduler and queue management.
- **OpenAI API**: To generate intelligent replies based on email content.
- **Redis**: For BullMQ job queue.

## Prerequisites

- **Node.js**: Install [Node.js](https://nodejs.org/).
- **Redis**: You need to have Redis installed for BullMQ. Install Redis using the following instructions:
  - On Linux: `sudo apt-get install redis-server`
  - On Windows: Download and install Redis from [here](https://redis.io/download).

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/cchaithanya83/Email-services.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Email-services
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Setup environment variables in a `.env` file at the root of the project:

   ```bash
   EMAIL=your_gmail_account
   APPPASS=your_gmail_app_password
   OUTLOOK_EMAIL=your_outlook_account
   OUTLOOK_PASSWORD=your_outlook_password
   OPENAI_API_KEY=your_openai_api_key
   ```

5. Start Redis:
   ```bash
   redis-server
   ```

## Usage

### To Start the Application

1. Start the application by running:
   ```bash
   npm start
   ```



### AI-Powered Replies

The system automatically categorizes emails into the following labels:
- **Interested**
- **Not Interested**
- **More Information**

It then generates a response based on the email content using OpenAI.

### BullMQ Email Queue

All email tasks are handled by BullMQ, ensuring asynchronous and efficient processing of tasks like reading and sending emails.

## BullMQ Worker Setup

- The worker (`index.js`) processes incoming emails in a loop and uses AI to categorize and reply to them.
- Ensure that Redis is running before you start the worker.

### To Run the Worker

1. Run the worker to process queued emails:
   ```bash
   node index.js
   ```

## Testing the Application

1. Send an email to the connected Gmail or Outlook account.
2. The system will read the email, categorize it, and send an automated reply.
3. The entire process is asynchronous, handled via BullMQ and Redis.

