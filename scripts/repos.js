const relevantRepos = document.getElementById('relevantRepos');
const relevantReposLabel = document.querySelector('label[for="relevantRepos"]');
const repoList = document.getElementById('repo-list');
// priority projects selection
const projectList = [
    'steam-id-scraper', 
    'password-generator', 
    'textlua-editor', 
    'todo-list', 
    'kpl1337.github.io'
];

let allRepos = [];

// function to retrieve github repositories
const fetchRepos = async () => {
    try {
        const response = await fetch(`https://api.github.com/users/kpl1337/repos?per_page=100`);
        const repos = await response.json();
        // sort by update date
        allRepos = repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        renderRepos();
    } catch (error) {
        console.error('Error fetching repositories:', error);
        repoList.innerHTML = '<p class="text-danger">Failed to load repositories.</p>';
    }
}

const renderRepos = () => {
    // clear repository list element
    repoList.innerHTML = ''; 

    let filteredRepos = allRepos;
    
    if (relevantRepos.checked) { 
        if (relevantReposLabel) 
            relevantReposLabel.textContent = 'Relevant only';
        
        // repoList.textContent = '<p class="text-muted mb-0">Some repositories were hidden due to the selected filter.</p>';
        // relevantReposLabel.textContent = 'Relevant only';
        const infoMsg = document.createElement('div');
        infoMsg.className = 'col-12 text-muted mb-3';
        infoMsg.textContent = 'Only selected repositories are shown.';
        repoList.appendChild(infoMsg);

        filteredRepos = allRepos.filter(repo => projectList.includes(repo.name));
    }
    // if no filter is selected, show all repositories
    else { 
        // relevantReposLabel.textContent = 'All GitHub repositories';
        if (relevantReposLabel) relevantReposLabel.textContent = 'All GitHub repositories';
    }

    // render each shown repository using this template: 
    filteredRepos.forEach(repo => {
        const col = document.createElement('div');
        const description = repo.description ? repo.description : 'No description available.';
        
        col.className = 'col-md-6 col-lg-4 mb-4';
        col.innerHTML = `
            <div class="card repo-card h-100 shadow-sm">
                <div class="card-body">
                    <div class="d-flex align-items-baseline gap-2">
                        <h5 class="card-title hover-anim-2 mb-0">${repo.name}</h5>
                        <!-- <h6 class="mb-0 ms-auto" style="font-weight: 400; ">${repo.fork ? "Fork" : ""}</h6> -->
                        ${repo.fork ? '<span class="badge bg-secondary ms-auto">FORK</span>' : ''}
                    </div>
                    
                    <p class="card-text flex-grow-1">${description}</p>

                    <a href="${repo.html_url}" target="_blank" class="btn btn-primary">View on GitHub</a>
                    <!-- <button class="btn btn-primary">Preview</button> -->
                </div>
            </div>
        `;
        repoList.appendChild(col);
        // @TODO: ADD PREVIEW FOR PROJECT (iframe? github sites?)
    });
}

relevantRepos.addEventListener('change', () => {
    // const label = document.querySelector('label[for="relevantRepos"]');
    // if (relevantRepos.checked) {
    //     relevantReposLabel.classList.add('active');
    //     label.classList.add('active');
    // } else {
    //     label.classList.remove('active');
    // }

    if (relevantReposLabel) {
        relevantRepos.checked ? relevantReposLabel.classList.add('active') : relevantReposLabel.classList.remove('active');
    }
    // render repositories each time the filter button gets pressed
    renderRepos();
});

// call fetch repos on website load
fetchRepos();