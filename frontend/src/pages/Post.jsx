import { useState } from "react";

// Page for sharing internship opportunities
const Post = () => {
  // Post internship states
  const [company, setCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [applicationLink, setApplicationLink] = useState("");
  const [posting, setPosting] = useState(false);
  const [postMessage, setPostMessage] = useState("");

  // Submit a new internship to the backend
  const postInternship = async (event) => {
    event.preventDefault();

    if (!company.trim() || !newRole.trim() || posting) return;

    setPosting(true);
    setPostMessage("");

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: company.trim(),
          role: newRole.trim(),
          postedBy: postedBy.trim() || "student",
          deadline: deadline || null,
          description: description.trim() || null,
          applicationLink: applicationLink.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post internship");
      }

      setPostMessage("Internship posted successfully!");

      // Clear the form after submission
      setCompany("");
      setNewRole("");
      setPostedBy("");
      setDeadline("");
      setDescription("");
      setApplicationLink("");
    } catch (err) {
      console.error("Post error:", err);
      setPostMessage("Failed to post internship. Please try again.");
    } finally {
      setPosting(false);
    }
  };

return (
  <main>
    <section className="post-section">
      <h2>Share an Internship Opportunity</h2>

      <p>
        Found an internship opportunity?
        Share it with other students!
      </p>

      <form className="post-form" onSubmit={postInternship}>

        {/* Required internship information */}
        <label htmlFor="company">Company Name</label>
        <input
          id="company"
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          required
        />

        <label htmlFor="role">Job Title</label>
        <input
          id="role"
          type="text"
          placeholder="Job Title"
          value={newRole}
          onChange={(event) => setNewRole(event.target.value)}
          required
        />

        {/* Optional internship information */}
        <label htmlFor="postedBy">Posted By (optional)</label>
        <input
          id="postedBy"
          type="text"
          placeholder="Your Name"
          value={postedBy}
          onChange={(event) => setPostedBy(event.target.value)}
        />

        <label htmlFor="deadline">Application Deadline</label>
        <input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(event) => setDeadline(event.target.value)}
        />

        <label htmlFor="description">Job Description (optional)</label>
        <textarea
          id="description"
          placeholder="Job Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <label htmlFor="applicationLink">Application Link (optional)</label>
        <input
          id="applicationLink"
          type="url"
          placeholder="https://example.com"
          value={applicationLink}
          onChange={(event) => setApplicationLink(event.target.value)}
        />

        {/* Submit the internship */}
        <button
          type="submit"
          disabled={
            posting ||
            !company.trim() ||
            !newRole.trim()
          }
        >
          {posting ? "Posting..." : "Submit Internship"}
        </button>
      </form>

      {/* Display the submission result */}
      {postMessage && (
        <p role="status">{postMessage}</p>
      )}
    </section>
  </main>
);
};

export default Post;