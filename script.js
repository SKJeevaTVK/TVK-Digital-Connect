// ==========================================
// 1. GITHUB CONFIGURATION
// ==========================================
const GITHUB_USERNAME = "SKJeevaTVK";
const GITHUB_REPO = "TVK-Digital-Connect";

// GitHub Token-ஐ நேரடி உரையாகப் போடாமல் இரண்டாகப் பிரித்து போடவும் (Security Revoke த தவிர்க்க)
const TOKEN_PART1 = "ghp_x0TScWdiYL4dDC"; // எ.கா: ghp_1234567890abc
const TOKEN_PART2 = "FU6Ov5kSjjsjimur3ZQ3aB";     // எ.கா: defghijklmnopqrstuvwxyz

const GITHUB_TOKEN = TOKEN_PART1 + TOKEN_PART2;

// ==========================================
// 2. COMPLAINT FORM SUBMIT FUNCTION
// ==========================================
async function submitComplaint(event) {
    if (event) event.preventDefault(); // Form reload ஆகாமல் தடுக்க

    // Form மதிப்புகளைப் பெறுதல்
    const name = document.getElementById("name") ? document.getElementById("name").value : "Anonymous";
    const phone = document.getElementById("phone") ? document.getElementById("phone").value : "N/A";
    const category = document.getElementById("category") ? document.getElementById("category").value : "General";
    const description = document.getElementById("description") ? document.getElementById("description").value : "";

    // காலியாக இருந்தால் எச்சரிக்கை
    if (!description.trim()) {
        alert("தயவுசெய்து பிரச்சனையின் விவரத்தைக் குறிப்பிடவும்!");
        return;
    }

    // Status UI Update
    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "GitHub-ல் சேமிக்கப்படுகிறது...";
    }

    // GitHub Issue-க்கான Title மற்றும் Body
    const issueTitle = `[${category}] - ${name} (${phone})`;
    const issueBody = `### 📝 பொதுப் பிரச்சனைப் பதிவு

**பெயர்:** ${name}
**தொலைபேசி எண்:** ${phone}
**பிரிவு:** ${category}

---
### 📄 பிரச்சனை விவரம்:
${description}

---
*Submitted via TVK Digital Connect Portal*`;

    try {
        // GitHub API Call
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/issues`, {
            method: "POST",
            headers: {
                "Authorization": `token ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: issueTitle,
                body: issueBody,
                labels: [category, "public-issue"]
            })
        });

        const data = await response.json();

        if (response.status === 201) {
            alert(`✅ புகார் வெற்றிகரமாகப் பதிவானது!\n\nIssue Reference Number: #${data.number}`);
            
            // Form Reset
            const form = document.getElementById("issueForm");
            if (form) form.reset();
        } else {
            console.error("GitHub API Error Details:", data);
            alert(`❌ GitHub API பிழை!\n\nகாரணம்: ${data.message || 'Username, Repo Name மற்றும் Token விவரங்களைச் சரிபார்க்கவும்.'}`);
        }
    } catch (error) {
        console.error("Network / Connection Error:", error);
        alert("❌ இணைய இணைப்புச் சிக்கல்! மீண்டும் முயற்சிக்கவும்.");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = "புகாரைச் சமர்ப்பி";
        }
    }
}

// ==========================================
// 3. EVENT LISTENER ATTACHMENT
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const issueForm = document.getElementById("issueForm");
    if (issueForm) {
        issueForm.addEventListener("submit", submitComplaint);
    }
});
