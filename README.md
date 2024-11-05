# **Platform for Managing Simulations**

This project is a **comprehensive simulation management platform** designed to streamline the simulation process, automate critical tasks, and provide real-time monitoring and insights for complex research. The platform aims to optimize simulation workflows and improve the efficiency of researchers by centralizing simulation management and analysis tools.

---

## **Features**

- 🔍 **Dynamic Tracking System**: Search and filter simulations based on real-time status, allowing users to monitor active simulations and address issues instantly.
- ⚙️ **Personalized Simulations**: Create and manage custom simulations by adjusting parameters to meet specific research needs.
- 📊 **Real-Time Monitoring**: Gain real-time insights into simulation performance, enabling adjustments and resource allocation during runtime.
- 📈 **Comprehensive Analysis**: Analyze simulation results with in-depth tools to generate valuable insights.
- 🔗 **External Interface Integration**: Seamlessly integrates with external systems for running simulations and retrieving results, ensuring smooth interoperability.

---

## **Problem Addressed**

Simulation systems are widely used across various research fields to study and model real-world phenomena in controlled environments. However, the **lack of comprehensive management systems** creates inefficiencies, including:
- 🕒 Long experiment cycles due to manual simulation management.
- 📉 Difficulty in tracking real-time performance and adjusting simulations on the go.
- 🧩 Limited tools for in-depth analysis of simulation results.

---

## **Solution**

Our platform automates essential parts of the simulation process, accelerates test cycles, and provides tools for better decision-making in real time. With capabilities for **custom simulation creation**, **progress tracking**, and **result analysis**, the platform minimizes resource waste and fosters **collaboration** and **innovation** in fields like engineering, science, and finance.

---

## **Technologies Used**

- **Backend**:
  - 🐍 **Python**: Primary language for backend logic.
  - 🚀 **FastAPI**: Web framework for building the API.
  - 🗄️ **MongoDB**: NoSQL database to manage simulation and user data.
- **Frontend**:
  - 💻 **TypeScript**: For frontend development.
  - ⚛️ **React**: Framework for creating interactive UIs.
  - 🗃️ **Redux**: State management for consistent data flow.
- **Integration**:
  - 🔌 **External Interface**: Communicates with external systems to run simulations and retrieve results.
  - 🐳 **Docker**: Manages the MongoDB instance.

---

## **Setup Instructions**

### **Prerequisites**
- **Backend**:
  - Python 3.x
  - MongoDB (Docker or local installation)
- **Frontend**:
  - npm (Node Package Manager)
- **External Simulation Interface**: The required external interface must be installed and configured separately for running simulations. (Contact for download link if needed.)

---

### **Installation Steps**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/Platform-For-Managing-Simulation.git
   ```

2. **Backend Setup**:
   - Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
   - Install the required Python packages:
     ```bash
     pip install -r requirements.txt
     ```
   - Configure MongoDB in the `.env` file.
   - Ensure the external simulation interface is installed and integrated.

3. **Frontend Setup**:
   - Navigate to the `frontend` directory:
     ```bash
     cd frontend
     ```
   - Install frontend dependencies:
     ```bash
     npm install
     ```

4. **Running the Project**:
   - **Backend**: Start the FastAPI backend server:
     ```bash
     uvicorn main:app --reload
     ```
   - **Frontend**: Start the React frontend server:
     ```bash
     npm start
     ```

---

## **How to Contribute**

Feel free to fork this repository, submit pull requests, or open issues if you encounter any bugs or have suggestions for improvements.

---

## **Contact**

- **Name**: Eden Oved
- **Email**: edenoved.swe@gmail.com
- **LinkedIn**: [https://www.linkedin.com/in/edenoved/](https://www.linkedin.com/in/edenoved/)
