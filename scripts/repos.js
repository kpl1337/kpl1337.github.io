const relevantRepos = document.getElementById('relevantRepos');
const relevantReposLabel = document.querySelector('label[for="relevantRepos"]');
const repoList = document.getElementById('repo-list');

const RELEVANCE_THRESHOLD = 80;
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

// function to get a repository's "relevance" score
const getRelevanceScore = (repo) => {
    let score = 0;

    // explicit priority list
    const priorityRepos = [
        'steam-id-scraper',
        'password-generator',
        'textlua-editor',
        'todo-list',
        'kpl1337.github.io',
        'excelconverter'
    ];
    if (priorityRepos.includes(repo.name)) score += 100;

    // forks = less relevant
    if (repo.fork) score -= 50;

    // community interest
    score += repo.stargazers_count * 10;
    score += repo.watchers_count * 5;
    score += repo.forks_count * 3;

    // description
    if (repo.description) score += 15;

    // homepage / live demo
    if (repo.homepage) score += 20;

    // last updated within the last 6 months
    const sixMonthsAgo = Date.now() - 1000 * 60 * 60 * 24 * 180;
    if (new Date(repo.pushed_at) > sixMonthsAgo) score += 10;

    // topics/tags set
    if (repo.topics && repo.topics.length > 0) score += repo.topics.length * 5;

    return score;
};

const renderRepos = () => {
    // clear repository list element
    repoList.innerHTML = '';

    let filteredRepos = [...allRepos];

    if (relevantRepos.checked) {
        if (relevantReposLabel) relevantReposLabel.textContent = 'Relevant only';

        filteredRepos = allRepos
            .map(repo => ({ repo, score: getRelevanceScore(repo) }))
            .filter(({ score }) => score >= RELEVANCE_THRESHOLD)
            .sort((a, b) => b.score - a.score)   // best first
            .map(({ repo }) => repo);

        const infoMsg = document.createElement('div');
        infoMsg.className = 'col-12 text-muted mb-3';
        infoMsg.textContent = `Showing ${filteredRepos.length} relevant repositories.`;
        repoList.appendChild(infoMsg);
    } else {
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
    if (relevantReposLabel) {
        relevantRepos.checked ? relevantReposLabel.classList.add('active') : relevantReposLabel.classList.remove('active');
    }
    // render repositories each time the filter button gets pressed
    renderRepos();
});

// call fetch repos on website load
fetchRepos();