<h1> QuizifyAI- Real-time AI Quiz Generator </h1>

<h2> Project Overview </h2>

QuizifyAI is a real-time, interactive quiz generation platform designed for educators and students. It leverages the power of Google's Gemini AI to instantly create quizzes based on educator input. The application facilitates a seamless learning experience by allowing educators to host sessions with a unique code, and students to join and participate from any device. After submitting their answers, students receive instant feedback, including their score and correct answers. Educators can track student performance and review detailed results for each quiz session.



<h2> Key Features </h2>

<ul> 

<li> <b> AI-Powered Quiz Generation: </b> Instantly generates custom quizzes on any topic using the Gemini AI API. </li>

<li> <b>Real-time Interaction: </b> Students can join a live quiz session using a unique session code. </li>

<li> <b> Educator Dashboard:</b>A dedicated interface for educators to generate quizzes, start sessions, and view results.</li>

<li>  <b>Student-Friendly Interface: </b> A simple, intuitive experience for students to join quizzes and view their scores.</li>

<li> <b> Detailed Results Analysis:</b>  Educators can view a breakdown of student scores and individual answers for a specific session. </li>

<li> <b> Persistent Data Storage:</b>Stores quiz data, student scores, and session information in a MongoDB Atlas database. </li>

</ul>



<h2> Tech Stack</h2>

<ul>

<li> Frontend:</li>

<ul> 

<li> React: For building the dynamic user interface.</li>

<li> Vanilla CSS: For styling the application.</li>

</ul>

<li> Backend:</li>

<ul>

<li>FastAPI: A modern, high-performance web framework for the backend API. </li>

</ul>

<li> Database:</li>

<ul> 

<li>MongoDB Atlas: A cloud-hosted NoSQL database for storing all application data</li>

</ul>

<li>Deployment: </li>

<ul>

<li>Render: The platform used to deploy the frontend and backend of the application. </li>

&nbsp;</ul>

<li>API: </li>

<ul>

<li> Gemini AI API: Powers the quiz generation feature.</li>

</ul>



<h2> How to Run Locally</h2>

<h3>Perequisites: </h3>

<ul> 

<li>Node.js and npm (or yarn) </li>

<li> Python 3.8+</li>

<li> A Gemini AI API Key</li>

<li>A MongoDB Atlas connection URI </li>

</ul>

<ol> Clone the Repository:

<li> git clone https://github.com/your-username/your-repo-name.git</li>

<li>cd your-repo-name </li>

</ol>

<ol>Backend Setup:

<!--# Navigate to the backend directory--> <br>

<p> cd backend </p> 

<br>

<!--# Create and activate a virtual environment--><br>

<p>python3 -m venv venv</p> <br>

<p>venv\\Scripts\\activate (On Windows)

<!--# Install dependencies--><br>

<p> pip install -r requirements.txt</p>

<br>

<!--# Create a `.env` file and add your credentials--><br>

<p>GEMINI\_API\_KEY="your\_gemini\_api\_key"</p>

<br>

<p>MONGODB\_URI="your\_mongodb\_connection\_string" </p>

<br>

<!-- # Run the server--><br>

<p> uvicorn main:app --reload</p>

</ol>



<ol> Frontend Setup:

<!--# Navigate to the frontend directory--><br>

<p> cd ../frontend</p>

<br>

<!--# Install dependencies--><br>

<p>npm install</p>

<br>

<!--# Start the development server--> <br>

<p> npm start</p>



<h2> Usage</h2>

<h3> For Educators</h3>

<ol>

<li>Navigate to the Educator Dashboard on the homepage. </li>

<li>Click the "Generate Quiz" button. </li>

<li> Enter the quiz topic and select number of questions you want to generate and difficulty level and click "Generate."</li>

<li>A unique session code will be displayed. Share this code with your students. </li>

<li> Click "Start Quiz" to begin the session.</li>

<li>After the quiz, click "View Results" and enter the session code to see student scores and answers. </li>

</ol>



<h3>For Students </h3>

<ol>

<li>On the homepage, enter the session code provided by your educator. </li>

<li> You will be directed to a waiting page until the educator starts the quiz.</li>

<li> Once the quiz begins, enter your name.</li>

<li> Answer the questions and click "Submit" to see your score and the correct answers.</li>

</ol>



<h2> Deployment</h2>

<p> The project is deployed on Render, with the frontend and backend running as separate services. The backend API communicates with the MongoDB Atlas database. The Gemini API key is configured as an environment variable in the Render service settings.</p>

