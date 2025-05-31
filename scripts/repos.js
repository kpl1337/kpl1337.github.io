const relevantRepos = document.getElementById('relevantRepos');
const repoList = document.getElementById('repo-list');

const projectlist = ['steam-id-scraper', 'password-generator', 'textlua-editor', 'todo-list', 'kpl1337.github.io'];

let allRepos = [];

// function to retrieve github repositories
async function fetchRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/kpl1337/repos`);
        const repos = await response.json();
        allRepos = repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        renderRepos();
    } catch (error) {
        console.error('Error fetching repos:', error);
        repoList.innerHTML = '<p class="text-danger">Failed to load repositories.</p>';
    }
}

function renderRepos() {
    // clear repo list element
    repoList.innerHTML = ''; 

    const filtered = allRepos.filter(repo => {
        // show only relevant repos defined in 'projectlist'
        // doesn't include forks etc.
        if (relevantRepos.checked) { 
            repoList.innerHTML = '<p class="text-muted mb-0">Some repositories were hidden due to the selected filter.</p>';
            relevantReposLabel.textContent = 'Relevant only';
            return projectlist.includes(repo.name);
        }
        // if no filter is selected, show all repositories
        else { 
            relevantReposLabel.textContent = 'All GitHub repositories';
        }
        return true;
    });

    // render each shown repo using this template: 
    filtered.forEach(repo => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
            <div class="card repo-card h-100 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title hover-anim-2">${repo.name}
                        <!-- <p style="font-weight: 300; font-size: small;">${repo.html_url}</p> -->
                    </h5>
                    <p class="card-text">${repo.description || 'No description available.'}</p>
                    <a href="${repo.html_url}" target="_blank" class="btn btn-primary">View on GitHub</a>
                </div>
            </div>
        `;
        repoList.appendChild(col);
    });
}

relevantRepos.addEventListener('change', () => {
    const label = document.querySelector('label[for="relevantRepos"]');
    if (relevantRepos.checked) {
        relevantReposLabel.classList.add('active');
        label.classList.add('active');
    } else {
        label.classList.remove('active');
    }

    // render repos on every filter button press
    renderRepos();
});

// fetch repos on site load
fetchRepos();