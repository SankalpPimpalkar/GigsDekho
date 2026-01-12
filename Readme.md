<h1>GigFlow 🚀</h1>

<p><strong>GigFlow</strong> is a full-stack freelancing platform where users can browse gigs, apply with proposals, and track their applications. Freelancers can apply to gigs, view their hired gigs, and see stats. Gig owners can post new gigs, review proposals, and hire freelancers. The application uses a React frontend (Vite) and Node.js + Express backend with MongoDB.</p>

<h2>Features</h2>
<ul>
    <li>Browse gigs and view details (title, description, budget, owner, etc.)</li>
    <li>Search gigs by title or description</li>
    <li>Apply to gigs with a custom proposal message and budget</li>
    <li>View all applied gigs and track status</li>
    <li>Post new gigs and manage them</li>
    <li>Hire freelancers for gigs</li>
    <li>View bids for your gigs and manage them</li>
    <li>See stats: total revenue, total gigs applied, total gigs hired</li>
    <li>JWT-based authentication and authorization</li>
</ul>

<h2>Project Setup</h2>

<h3>1. Clone the Repository</h3>
<pre><code>git clone https://github.com/SankalpPimpalkar/GigFlow.git
cd GigFlow</code></pre>

<h3>2. Configure Environment Variables</h3>
<p>Rename <code>.env.sample</code> to <code>.env</code> in both <strong>backend</strong> and <strong>client</strong> folders.</p>

<h4>Backend <code>.env</code></h4>
<pre><code>NODE_ENV=""

MONGO_URL="&lt;Your MongoDB URL&gt;"
PORT=3000
JWT_SECRET="JWT_SECRET"
BASE_URL="http://localhost:3000"
CLIENT_URL="http://localhost:5173"</code></pre>

<h4>Client <code>.env</code></h4>
<pre><code>VITE_SERVER_URL="http://localhost:3000/api"</code></pre>


<h3>3. Install Dependencies & Build</h3>
<pre><code>
npm run build
npm run start
</code></pre>

<h3>4. Running the Project</h3>

<h4>Development Mode</h4>
<pre><code>npm run dev</code></pre>
<p>Backend: <code>http://localhost:3000</code><br>
Client: <code>http://localhost:5173</code></p>

<h4>Production Mode</h4>
<pre><code>npm run build
npm run start</code></pre>
<p>Access the app at <code>http://localhost:3000</code>. Backend serves React client as fallback.</p>

<h3>5. Fallback Route in Production</h3>
<pre><code>if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));
    app.get("/{*any}", (req, res) => {
        return res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
    });
}</code></pre>

<h2>API Routes</h2>

<h3>Auth Routes (<code>/api/auth</code>)</h3>
<table border="1" cellpadding="5">
    <tr>
        <th>Method</th>
        <th>Route</th>
        <th>Description</th>
        <th>Access</th>
    </tr>
    <tr><td>POST</td><td>/register</td><td>Register a new user</td><td>Public</td></tr>
    <tr><td>POST</td><td>/login</td><td>Login user</td><td>Public</td></tr>
    <tr><td>DELETE</td><td>/logout</td><td>Logout user</td><td>Authenticated</td></tr>
    <tr><td>GET</td><td>/me</td><td>Get logged-in user details</td><td>Authenticated</td></tr>
    <tr><td>GET</td><td>/stats</td><td>Get freelancer stats (total gigs applied, hired, revenue)</td><td>Authenticated</td></tr>
</table>

<h3>Gig Routes (<code>/api/gigs</code>)</h3>
<table border="1" cellpadding="5">
    <tr>
        <th>Method</th>
        <th>Route</th>
        <th>Description</th>
        <th>Access</th>
    </tr>
    <tr><td>POST</td><td>/</td><td>Create a new gig</td><td>Authenticated</td></tr>
    <tr><td>POST</td><td>/:gigId/hire/:freelancerId</td><td>Hire a freelancer for a gig</td><td>Authenticated</td></tr>
    <tr><td>GET</td><td>/</td><td>Browse all gigs</td><td>Public</td></tr>
    <tr><td>GET</td><td>/applications</td><td>Get gigs applied by logged-in freelancer</td><td>Authenticated</td></tr>
    <tr><td>GET</td><td>/my-gigs</td><td>Get gigs posted by logged-in user</td><td>Authenticated</td></tr>
</table>

<h3>Bid Routes (<code>/api/bids</code>)</h3>
<table border="1" cellpadding="5">
    <tr>
        <th>Method</th>
        <th>Route</th>
        <th>Description</th>
        <th>Access</th>
    </tr>
    <tr><td>POST</td><td>/:gigId</td><td>Apply to a gig (create bid)</td><td>Authenticated</td></tr>
    <tr><td>GET</td><td>/:gigId</td><td>Fetch all bids for a gig</td><td>Authenticated</td></tr>
</table>

<h2>Tech Stack</h2>
<ul>
    <li><strong>Frontend:</strong> React, Vite, Tailwind CSS, Lucide Icons, Axios, React Router</li>
    <li><strong>Backend:</strong> Node.js, Express.js, JWT Authentication</li>
    <li><strong>Database:</strong> MongoDB</li>
</ul>

</body>
</html>