
# 📚 Pratilipi Backend Assignment

This repository is a backend system designed for a digital book platform, created as part of the Pratilipi backend intern assignment. It includes user and content management with an integrated personalized notification system using a microservices-based architecture.

---

## 🚀 Features

- 📖 **Content Management**: Upload and fetch books and chapters.
- 👥 **User Management**: Register and manage user accounts.
- 🔔 **Notifications**: Automatically send personalized notifications based on user activity and system events.
- 📬 **Scheduled Messages**: Quote notifications are sent daily via a cron job.
- 🧩 **Microservices Architecture**: Modular services to handle content, users, and notifications separately.

---

## 🛠️ Tech Stack

- **Node.js** with **Express.js**
- **MongoDB** for persistent data storage
- **Postman** for API testing
- **Cron** for scheduled tasks
- **Event-driven design** for triggering notifications

---

## 📂 Project Structure

```
Pratilipi_Assignment/
├── controllers/         # Route handlers and logic
├── middleware/          # Middleware utilities
├── models/              # Mongoose schemas
├── routes/              # API route files
├── services/            # Notification and mail services
├── utils/               # Utility functions
├── scripts/             # Setup and test scripts
├── books_data_fixed.json# Sample book data
├── cron.js              # Cron job for daily quotes
├── index.js             # Entry point
├── package.json         # Dependencies
└── .gitignore           # Git ignore rules
```

---

## 📬 Postman API Collection

All available APIs can be explored and tested using this Postman collection:

👉 [**Click here to open Postman Collection**](https://harsh-6491001.postman.co/workspace/Harsh's-Workspace~ea59204d-b3ab-4bab-8bff-c065aab943c3/collection/44436603-305f1e90-e7fa-4e2f-86e7-4a167aae1cef?action=share&creator=44436603)

---

## 🔔 Notification System Logic

The application includes a robust notification system that sends real-time and scheduled updates to users based on the following logic:

1. **New Book Added**  
   - **Trigger**: A new book is added to the system.
   - **Action**: A notification is sent to **all users**, informing them about the newly added book.

2. **New Book by Same Author**  
   - **Trigger**: A book is added by an author whose previous books were purchased by any user.
   - **Action**: A personalized notification is sent to those users suggesting the new book, as they might be interested in books from the same author.

3. **Daily Motivational Quote**  
   - **Trigger**: Runs **once every day** using a cron job.
   - **Action**: Sends a motivational quote about the **benefits of reading books** to all users.

4. **Order Confirmation and Dispatch Updates**  
   - **Trigger**: A user **buys a book**.
   - **Action**:
     - Immediately: Sends a notification saying “Your book is being dispatched.”
     - After 6 hours: Sends another notification saying “Your book is out for delivery.”

These notifications are managed using in-app logic with future support for email/SMS integration.

---

## ⚙️ How to Run

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ShreyanshJ09/Pratilipi_Assignment.git
   cd Pratilipi_Assignment
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

4. **Start the Cron Job (Optional)**
   If the cron job isn't already embedded in `index.js`, run:
   ```bash
   node cron.js
   ```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
