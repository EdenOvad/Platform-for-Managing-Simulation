
# **Platform for Managing Simulations**

This project is a **comprehensive simulation management platform** designed to streamline the simulation process, automate critical tasks, and provide real-time monitoring and insights for complex research. The platform aims to optimize simulation workflows and improve the efficiency of researchers by centralizing simulation management and analysis tools.

---

## **Features**

- **Dynamic Tracking System**: Search and filter simulations based on their real-time status, allowing users to monitor running simulations and identify issues instantly.
- **Personalized Simulations**: Users can create and manage custom simulations by adjusting parameters to meet specific research needs.
- **Real-Time Monitoring**: The platform provides real-time insights into the simulation's performance, allowing for adjustments and resource allocation during runtime.
- **Comprehensive Analysis**: Tools for analyzing simulation results and generating in-depth insights based on performance data.
- **External Interface Integration**: Seamless integration with external systems for running simulations and retrieving results, ensuring smooth interoperability between different tools.

---

## **Problem Addressed**

Simulation systems are widely used in various research fields to study and model real-world phenomena in controlled virtual environments. However, the **lack of comprehensive management systems** creates inefficiencies, including:
- Long experiment cycles due to manual simulation management.
- Difficulty in tracking real-time performance and adjusting simulations on the go.
- Limited tools for in-depth analysis of simulation results.

---

### **Solution**

Our platform automates essential parts of the simulation process, speeding up test cycles, and providing tools for better decision-making in real-time. With the ability to **create custom simulations**, **track progress**, and **analyze results**, the platform reduces resource wastage and fosters **collaboration** and **innovation** in fields such as engineering, science, and finance.

---

## **Technologies Used**

- **Backend**:
  - **Python**: Main programming language for backend logic.
  - **FastAPI**: Web framework for building the API.
  - **MongoDB**: NoSQL database for storing simulation and user data.
- **Frontend**:
  - **TypeScript**: For writing the frontend logic.
  - **React**: Framework for building the user interface.
  - **Redux**: For managing application state.
- **Integration**:
  - **External Interface**: Communicates with external systems to run simulations and fetch results.
  - **Docker**: Used for managing the MongoDB instance.

---

## **Setup Instructions**

### **Prerequisites**
- **Backend**: 
  - Python 3.x
  - MongoDB (via Docker or local installation)
- **Frontend**: 
  - npm (Node Package Manager)
- **External Simulation Interface**: The external interface required to run the simulations must be installed and configured separately. This interface handles the actual execution of simulations and is integrated with the platform to ensure smooth operation.(Send me a message and I'll send a direct download link)

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
   - Set up MongoDB and configure the database connection in the `.env` file.
   - Ensure the external simulation interface is installed and integrated with the platform.

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

- **Name**: Eden Ovad
- **Email**: edenovad777@gmail.com
- **LinkedIn**: https://www.linkedin.com/in/edenovad/

